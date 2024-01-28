// Import necessary modules
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import config from "./config"; // Adjust the path as necessary

const serverAddress = config.serverAddress;
const clientId = uuidv4();

// Function to queue a prompt
export async function queuePrompt(prompt) {
  const response = await axios.post(`http://${serverAddress}/prompt`, {
    prompt,
    client_id: clientId,
  });
  return response.data;
}

// Function to get an image
export async function getImage(filename, subfolder, folderType) {
  const url = `http://${serverAddress}/view?filename=${encodeURIComponent(
    filename
  )}&subfolder=${encodeURIComponent(subfolder)}&type=${encodeURIComponent(
    folderType
  )}`;
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return response.data;
}

// Function to get history
export async function getHistory(promptId) {
  const response = await axios.get(
    `http://${serverAddress}/history/${promptId}`
  );
  return response.data;
}

// Function to get images for a single prompt
export async function getImages(prompt, customPrompt) {
  prompt["6"]["inputs"]["text"] = customPrompt;
  prompt["3"]["inputs"]["seed"] = Math.floor(Math.random() * 5000000);
  const { prompt_id } = await queuePrompt(prompt);

  // Use native WebSocket in the browser
  const ws = new WebSocket(`ws://${serverAddress}/ws?clientId=${clientId}`);

  return new Promise((resolve, reject) => {
    let outputImages = {};

    ws.onmessage = async (event) => {
      const parsedMessage = JSON.parse(event.data);
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
    };

    ws.onerror = (err) => {
      reject(err);
    };
  });
}

// Function to process multiple prompts
export async function processPrompts(prompts) {
  console.log(ProcessingInstruction);
  let completedPrompts = [];
  let promptText = `{
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
  console.log("starting loop");
  for (const customPrompt of prompts) {
    console.log("CUrrently processing prompt: ", customPrompt);
    try {
      const images = await getImages(prompt, customPrompt);
      completedPrompts.push({ customPrompt, images, prompt: customPrompt });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  return completedPrompts;
}

// Export the main function to be used as an ES module
export default processPrompts;
