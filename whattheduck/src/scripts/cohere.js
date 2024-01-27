const axios = require('axios');
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


axios
    .post(cohereEndpoint, {
    // Your request payload goes here
    // For example, if using a text generation model, you'd include the prompt and other parameters
    // See https://docs.cohere.ai/api-reference/models/gpt-3
    prompt: "There is a duck wanting to date and he has a lot of costumes... can you come up with a list",
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
})
.catch(error => {
    console.error('Error calling Cohere API:', error);
});