const axios = require('axios');
const fs = require('fs');
// import axios from 'axios';

const cohereApiKey = 'axItsFvEMPwChHWP5Ys7ECenX08VMXK6VYDOAVPU';
const cohereEndpoint = 'https://api.cohere.ai/generate';

const options = {
  method: 'POST',
  url: 'https://api.cohere.ai/v1/classify',
  headers: {accept: 'application/json', 'content-type': 'application/json'},
  data: {truncate: 'END'}
};

// axios
//   .request(options)
//   .then(function (response) {
//     console.log(response.data);
//   })
//   .catch(function (error) {
//     console.error(error);
//   });

const preferences = "Hi my name is Alan and I like to go skiing and play volleyball, I am 23 year old and I am doing my master."

axios
    .post(cohereEndpoint, {
    // Your request payload goes here
    // For example, if using a text generation model, you'd include the prompt and other parameters
    // See https://docs.cohere.ai/api-reference/models/gpt-3
    prompt: "Pretend I am a duck instead of human that has this dating bio: " + preferences + " can you just give me a list of adjective attributes that summarizes me as a duck? \n\n" ,
    max_tokens: 100,
    temperature: 0.7,
    stop_sequences: ["###"]

}, {
    headers: {
        'Authorization': `Bearer ${cohereApiKey}`,
        'Content-Type': 'application/json'
    }
})
.then(response => {
    console.log('Response from Cohere:', response.data);
    const responseData = response.data; 
    // Save to a JSON file
    fs.writeFile('cohere_response.json', JSON.stringify(responseData, null, 4), (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('Saved response to response.json');
        }
    });
})
.catch(error => {
    console.error('Error calling Cohere API:', error);
});