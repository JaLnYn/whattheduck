import axios from "axios";

// Function to call Cohere API
const callCohereApi = async (preferences) => {
  const cohereApiKey = "axItsFvEMPwChHWP5Ys7ECenX08VMXK6VYDOAVPU";
  const cohereEndpoint = "https://api.cohere.ai/generate";

  try {
    const response = await axios.post(
      cohereEndpoint,
      {
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
    );

    let my_list = response.data.text.split("\n");
    const additionalItems = [
      "pizza duck in a pizza restaurant",
      "average duck walking a dog at the park",
      "roadtrip duck driving a car on the road",
      "muscle duck lifting weights at the gym",
      "rockstar duck playing guitar on stage",
    ];
    while (my_list.length < 5) {
      // Find which item to add (the next item from the additionalItems list)
      let itemIndex = my_list.length % additionalItems.length;

      // Add the item to the original list
      my_list.push(additionalItems[itemIndex]);
    }

    return my_list;
  } catch (error) {
    console.error("Error calling Cohere API:", error);
    throw error;
  }
};

export default callCohereApi;
