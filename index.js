const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const { MongoClient, ServerApiVersion } = require("mongodb");

// Replace with your MongoDB Atlas connection string
const mongoUri =
  "mongodb+srv://mac:mac123@bel-chat.z7k6z5u.mongodb.net/MacDb?retryWrites=true&w=majority";

// Create a MongoClient
const client = new MongoClient(mongoUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

// Serve static files from the 'public' folder
app.use(express.static("public"));
app.use(express.json()); // Parse JSON requests

// Dummy user data (for example purposes)
const users = [
  { username: "user", password: "password" },
  // Add more users as needed
];

// Route to handle user login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    fetchMessages();
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   const user = users.find(
//     (u) => u.username === username && u.password === password
//   );

//   if (user) {
//     try {
//       const messages = await fetchMessagesForUser(user); // Fetch messages
//       res.json({ success: true, messages }); // Send messages along with success response
//     } catch (error) {
//       console.log("Error fetching messages:", error);
//       res.json({ success: false });
//     }
//   } else {
//     res.json({ success: false });
//   }
// });

// Serve static files from the 'public' folder
app.use(express.static("public"));
app.use(express.json()); // Parse JSON requests

// Route to fetch messages from the database
app.get("/get-messages", async (req, res) => {
  try {
    await run();
    const messagesCollection = client.db("MacDb").collection("messages");
    const messages = await messagesCollection.find({}).toArray();
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching messages" });
  } finally {
    await client.close();
  }
});

// Set up Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", async (data) => {
    const { sender, message } = data;

    io.emit("message", { sender, message }); // Broadcast the message to all connected clients

    // Save message to MongoDB
    try {
      await run();
      const messagesCollection = client.db("MacDb").collection("messages");
      await messagesCollection.insertOne({ sender, message });
      console.log("Message saved to MongoDB");
    } catch (err) {
      console.error("Error saving message to MongoDB:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Add this catch-all route to handle unmatched routes
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Function to fetch messages using Axios
async function fetchMessages() {
  try {
    const response = await axios(config);
    const messages = response.data; // Extract messages from the response
    console.log("Fetched messages:", messages);
    // Further processing or display logic for messages can be added here
  } catch (error) {
    console.log("Error fetching messages:", error);
  }
}

// async function fetchMessagesForUser(user) {
//   const data = JSON.stringify({
//     collection: "messages",
//     database: "MacDb",
//     dataSource: "bel-chat",
//     filter: {
//       sender: user.username, // Filter messages by sender's username
//     },
//   });

//   const config = {
//     method: "post",
//     url: "https://ap-south-1.aws.data.mongodb-api.com/app/data-tfaat/endpoint/data/v1/action/find",
//     headers: {
//       "Content-Type": "application/json",
//       "Access-Control-Request-Headers": "*",
//       "api-key":
//         "f0LNAMtvH5T4f8QzllIWroB2r9J2Ekv7LPk1jM4WjjZdwOSqT44A1M0hIJfJMQPT",
//       Accept: "application/ejson",
//     },
//     data: data,
//   };

//   const response = await axios(config);
//   return response.data;
// }
