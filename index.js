let prompt = document.querySelector("#prompt");
let btn = document.querySelector("#btn");
let chatContainer = document.querySelector(".chat-container");

// Replace with your valid API key
let Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key="YOUR_API_KEY"; 

let userMessage = null;

function createChatBox(html, className) {
  let div = document.createElement("div");
  div.classList.add(className);
  div.innerHTML = html;
  return div;
}

async function getAPIResponse(aiChatBox) {
  let textElement = aiChatBox.querySelector(".text");

  try {
    console.log("User message:", userMessage);

    // Make the API request
    let response = await fetch(Api_Url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: userMessage, // Dynamically pass user's input
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("API error:", await response.text());
      throw new Error("Failed to fetch AI response.");
    }

    // Parse the response JSON
    let data = await response.json();
    console.log("API response:", data);

    // Extract and display the AI's response
    if (data?.candidates?.length > 0 && data.candidates[0]?.content) {
      let APIResponse = data.candidates[0].content.parts[0].text; // Adjust key based on API response
      textElement.innerText = APIResponse;
    } else {
      textElement.innerText = "No response received from the AI.";
    }
  } catch (error) {
    console.error("Error fetching AI response:", error);
    textElement.innerText = "Error: Unable to get a response from the AI.";
  } finally {
    aiChatBox.querySelector(".loading").style.display = "none"; // Remove loading indicator
  }
}

function showLoading() {
  // Show a loading animation while waiting for the AI's response
  let html = `<div class="img">
                  <img src="chatbot.png" alt="" width="50px">
              </div>
              <p class="text"></p>
              <img class="loading" src="loading.gif" alt="loading" height="50">`;
  let aiChatBox = createChatBox(html, "ai-chat-box");
  chatContainer.appendChild(aiChatBox);
  getAPIResponse(aiChatBox);
}

btn.addEventListener("click", () => {
  userMessage = prompt.value.trim(); // Trim whitespace from user input
  if (!userMessage) {
    alert("Please enter a message."); // Alert if input is empty
    return;
  }

  // Create a user chat box for the message
  let html = `<div class="img">
                  <img src="user.png" alt="" width="50px">
              </div>
              <p class="text"></p>`;
  let userChatBox = createChatBox(html, "user-chat-box");

  // Add the user's message to the chat
  let textElement = userChatBox.querySelector(".text");
  if (textElement) {
    textElement.innerText = userMessage;
  } else {
    console.error("Text element not found in userChatBox.");
  }

  chatContainer.appendChild(userChatBox);
  prompt.value = ""; // Clear input field
  setTimeout(showLoading, 500); // Simulate delay before AI response
});
