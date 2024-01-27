const axios = require("axios");
const fs = require("fs");
// import axios from 'axios';

const cohereApiKey = "axItsFvEMPwChHWP5Ys7ECenX08VMXK6VYDOAVPU";
const cohereEndpoint = "https://api.cohere.ai/generate";

const options = {
  method: "POST",
  url: "https://api.cohere.ai/v1/classify",
  headers: { accept: "application/json", "content-type": "application/json" },
  data: { truncate: "END" },
};

// axios
//   .request(options)
//   .then(function (response) {
//     console.log(response.data);
//   })
//   .catch(function (error) {
//     console.error(error);
//   });

const preferences =
  "Hi my name is Alan and I like to go skiing and play volleyball, I am 23 year old and I am doing my master.";

axios
  .post(
    cohereEndpoint,
    {
      // Your request payload goes here
      // For example, if using a text generation model, you'd include the prompt and other parameters
      // See https://docs.cohere.ai/api-reference/models/gpt-3
      prompt:
        `Bio: Hey there! I'm the human equivalent of a Sunday morning cartoon - full of fun and unexpected adventures. I love pineapple on pizza (yes, I said it!), and my playlist is a wild mix of 80s rock and today's hits. My hobbies include trying to pet every dog I see.
This person likes: 
pizza duck in a pizza restuarant, 
average duck walking a dog at the park
roadtrip duck driving a car on the road
muscle duck lifting weights at the gym
rockstar duck playing guitar on stage
----
Bio: Hello, world! I’m the one you’ll find knee-deep in glitter and paint, turning everyday items into masterpieces. My kitchen often smells like freshly baked cookies, and I believe in the power of a good DIY tutorial!
This person likes:
artist duck painting a picture in a studio
baker duck baking a cake in the kitchen
gardener duck watering plants in the garden
movie duck watching a movie in a cinema
comedian duck telling jokes on stage
----
Bio: Hi! I'm a fan of sunny days, and good books. Always in search of the perfect cup of coffee.
This person likes:
librarian duck reading a book in a library
beach duck surfing at the beach
coffee duck drinking coffee at a cafe
art duck drawing a picture at home
relaxed duck meditating in a park
----
Bio: ` +
        preferences +
        "\nThis person likes:\n",
      max_tokens: 100,
      temperature: 0.7,
      stop_sequences: ["###"],
    },
    {
      headers: {
        Authorization: `Bearer ${cohereApiKey}`,
        "Content-Type": "application/json",
      },
    }
  )
  .then((response) => {
    console.log("Response from Cohere:", response.data);
    const responseData = response.data;
    // Save to a JSON file
  })
  .catch((error) => {
    console.error("Error calling Cohere API:", error);
  });
