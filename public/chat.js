document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chatBox");
  const messageInput = document.getElementById("messageInput");
  const sendButton = document.getElementById("sendButton");
  const logoutButton = document.getElementById("logoutButton");

  let socket = io();

  // Function to display messages
  function displayMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.textContent = `${sender}: ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Fetch messages from the server when the page loads
  socket.on("connect", async () => {
    const response = await fetch("/get-messages")
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error fetching messages:", error);
        return [];
      });

    response.forEach((message) => {
      displayMessage(message.sender, message.message); // Display each message
    });
  });

  // Send button click event handler
  sendButton.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message !== "") {
      displayMessage("You", message); // Display the sent message immediately
      socket.emit("message", { sender: "You", message: message }); // Emit the message to the server
      messageInput.value = "";
    }
  });

  // Socket event handler for receiving messages
  socket.on("message", (message) => {
    displayMessage(message.sender, message.message); // Display the received message
  });
});
// document.addEventListener("DOMContentLoaded", () => {
//   const chatBox = document.getElementById("chatBox");
//   const messageInput = document.getElementById("messageInput");
//   const sendButton = document.getElementById("sendButton");
//   const logoutButton = document.getElementById("logoutButton");

//   // Establish socket connection
//   const socket = io();

//   // Function to display messages
//   function displayMessage(sender, message) {
//     const messageElement = document.createElement("div");
//     messageElement.textContent = `${sender}: ${message}`;
//     chatBox.appendChild(messageElement);
//     chatBox.scrollTop = chatBox.scrollHeight;
//   }

//   // Send button click event handler
//   sendButton.addEventListener("click", () => {
//     const message = messageInput.value.trim();
//     if (message !== "") {
//       socket.emit("message", { sender: "You", message: message });
//       messageInput.value = "";
//     }
//   });

//   // Socket event handler for receiving messages
//   socket.on("message", (message) => {
//     displayMessage(message.sender, message.message);
//   });

//   // Logout button click event handler
//   logoutButton.addEventListener("click", () => {
//     // You can add logout logic here
//     // For now, let's assume logging out redirects to the login page
//     window.location.href = "login.html";
//   });
// });
