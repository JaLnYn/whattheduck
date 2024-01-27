
import websocket  # NOTE: websocket-client (https://github.com/websocket-client/websocket-client)
import uuid
import json
import urllib.request
import urllib.parse
from PIL import Image
import io
import matplotlib.pyplot as plt
from config import server_address


prompt_text = """
{
  "3": {
    "inputs": {
      "seed": 70049499214056,
      "steps": 10,
      "cfg": 8,
      "sampler_name": "euler",
      "scheduler": "normal",
      "denoise": 0.75,
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
      "image": "noisy_duck.png",
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
}
"""

print("Myserverad:",server_address)

def queue_prompt(prompt):
    p = {"prompt": prompt, "client_id": client_id}
    data = json.dumps(p).encode('utf-8')
    req = urllib.request.Request(f"http://{server_address}/prompt", data=data)
    return json.loads(urllib.request.urlopen(req).read())

def get_image(filename, subfolder, folder_type):
    data = {"filename": filename, "subfolder": subfolder, "type": folder_type}
    url_values = urllib.parse.urlencode(data)
    with urllib.request.urlopen(f"http://{server_address}/view?{url_values}") as response:
        return response.read()

def get_history(prompt_id):
    with urllib.request.urlopen(f"http://{server_address}/history/{prompt_id}") as response:
        return json.loads(response.read())

def get_images(ws, prompt, custom_prompt):
    prompt["6"]["inputs"]["text"] = custom_prompt
    prompt_id = queue_prompt(prompt)['prompt_id']
    output_images = {}
    while True:
        out = ws.recv()
        if isinstance(out, str):
            message = json.loads(out)
            if message['type'] == 'executing':
                data = message['data']
                if data['node'] is None and data['prompt_id'] == prompt_id:
                    break  # Execution is done
            else:
                continue  # previews are binary data

    history = get_history(prompt_id)[prompt_id]
    for o in history['outputs']:
        for node_id in history['outputs']:
            node_output = history['outputs'][node_id]
            if 'images' in node_output:
                images_output = []
                for image in node_output['images']:
                    image_data = get_image(image['filename'], image['subfolder'], image['type'])
                    images_output.append(image_data)
                output_images[node_id] = images_output

    return output_images

# Set up the WebSocket connection
client_id = str(uuid.uuid4())
ws = websocket.WebSocket()
try:
    # ws = websocket.create_connection(f"wss://{server_address}/ws?clientId={client_id}", header=headers)
    ws.connect(f"ws://{server_address}/ws?clientId={client_id}")
except Exception as e:
    print("Error connecting to websocket")
    print(e)
    print("Trying again...")
    exit(0)


# ws.connect(f"ws://{server_address}/ws?clientId={client_id}")

# Prompt text


prompt = json.loads(prompt_text)
images = get_images(ws, prompt, "duck in a space suit")

# Displaying the images
for node_id, image_data_list in images.items():
    for image_data in image_data_list:
        image = Image.open(io.BytesIO(image_data))
        plt.imshow(image)
        plt.axis('off')
        plt.show()

