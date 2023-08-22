const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");

loginButton.addEventListener("click", async () => {
  const username = usernameInput.value;
  const password = passwordInput.value;

  // Send login request to server
  const response = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  }).then((res) => res.json());

  if (response.success) {
    window.location.href = "chat.html"; // Redirect to the chat screen
  } else {
    alert("Invalid credentials");
  }
});
