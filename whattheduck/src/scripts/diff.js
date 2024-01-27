const axios = require("axios");
const sharp = require("sharp");
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const config = require("./config"); // Adjust the path as necessary

// Use the server address from the config file
const serverAddress = config.serverAddress;

// Unique client ID
const clientId = uuidv4();

// Function to queue a prompt
async function queuePrompt(prompt) {
  const response = await axios.post(`http://${serverAddress}/prompt`, {
    prompt,
    client_id: clientId,
  });
  return response.data;
}

// Function to get an image
async function getImage(filename, subfolder, folderType) {
  const url = `http://${serverAddress}/view?filename=${encodeURIComponent(
    filename
  )}&subfolder=${encodeURIComponent(subfolder)}&type=${encodeURIComponent(
    folderType
  )}`;
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return response.data;
}

// Function to get history
async function getHistory(promptId) {
  const response = await axios.get(
    `http://${serverAddress}/history/${promptId}`
  );
  return response.data;
}

// Function to get images
async function getImages(prompt, customPrompt) {
  prompt["6"]["inputs"]["text"] = customPrompt;
  prompt["3"]["inputs"]["seed"] = Math.floor(Math.random() * 5000000);
  const { prompt_id } = await queuePrompt(prompt);

  const ws = new WebSocket(`ws://${serverAddress}/ws?clientId=${clientId}`);

  return new Promise((resolve, reject) => {
    let outputImages = {};

    ws.on("message", async (message) => {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.type === "executing") {
        const data = parsedMessage.data;
        if (data.node === null && data.prompt_id === prompt_id) {
          ws.close();
          const history = await getHistory(prompt_id);
          for (const node_id in history[prompt_id].outputs) {
            const nodeOutput = history[prompt_id].outputs[node_id];
            if (nodeOutput.images) {
              outputImages[node_id] = await Promise.all(
                nodeOutput.images.map((img) =>
                  getImage(img.filename, img.subfolder, img.type)
                )
              );
            }
          }
          resolve(outputImages);
        }
      }
    });

    ws.on("error", (err) => {
      reject(err);
    });
  });
}

// Example usage
(async () => {
  try {
    const promptText = `
{
  "3": {
    "inputs": {
      "seed": 70049499214056,
      "steps": 8,
      "cfg": 8,
      "sampler_name": "euler",
      "scheduler": "normal",
      "denoise": 0.70,
      "model": [
        "4",
        0
      ],
      "positive": [
        "6",
        0
      ],
      "negative": [
        "7",
        0
      ],
      "latent_image": [
        "11",
        0
      ]
    },
    "class_type": "KSampler",
    "_meta": {
      "title": "KSampler"
    }
  },
  "4": {
    "inputs": {
      "ckpt_name": "copax.safetensors"
    },
    "class_type": "CheckpointLoaderSimple",
    "_meta": {
      "title": "Load Checkpoint"
    }
  },
  "6": {
    "inputs": {
      "text": "duck in a knight costume",
      "clip": [
        "4",
        1
      ]
    },
    "class_type": "CLIPTextEncode",
    "_meta": {
      "title": "CLIP Text Encode (Prompt)"
    }
  },
  "7": {
    "inputs": {
      "text": "text, watermark, ",
      "clip": [
        "4",
        1
      ]
    },
    "class_type": "CLIPTextEncode",
    "_meta": {
      "title": "CLIP Text Encode (Prompt)"
    }
  },
  "8": {
    "inputs": {
      "samples": [
        "3",
        0
      ],
      "vae": [
        "4",
        2
      ]
    },
    "class_type": "VAEDecode",
    "_meta": {
      "title": "VAE Decode"
    }
  },
  "9": {
    "inputs": {
      "filename_prefix": "ComfyUI",
      "images": [
        "8",
        0
      ]
    },
    "class_type": "SaveImage",
    "_meta": {
      "title": "Save Image"
    }
  },
  "10": {
    "inputs": {
      "image": "noisy_duck_small.png",
      "upload": "image"
    },
    "class_type": "LoadImage",
    "_meta": {
      "title": "Load Image"
    }
  },
  "11": {
    "inputs": {
      "pixels": [
        "10",
        0
      ],
      "vae": [
        "4",
        2
      ]
    },
    "class_type": "VAEEncode",
    "_meta": {
      "title": "VAE Encode"
    }
  }
}`; // Your JSON string here
    const prompt = JSON.parse(promptText);

    const images = await getImages(
      prompt,
      "duck in a top hat, in a fancy room"
    );

    // Processing the images
    for (const node_id in images) {
      for (const image_data of images[node_id]) {
        // Using Sharp to process the image
        sharp(image_data)
          .resize(200, 200) // Example: resize to 200x200 pixels
          .toFile(`${node_id}.png`) // Save the processed image
          .then(() => {
            console.log(`Image saved: ${node_id}.png`);
          })
          .catch((err) => {
            console.error("Error processing image:", err);
          });
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
