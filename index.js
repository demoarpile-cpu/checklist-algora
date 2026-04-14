const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

// Custom Modules
const { dbConnect } = require("./Config/dbConnect.js");
const routes = require("./app.js");
const { handleSocketConnection } = require("./Utills/SocketHelper.js");

// __dirname automatically available in CommonJS
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("🔑 Loaded ENV Vars:");
console.log("PORT:", process.env.PORT);
console.log(
  "MONGODB_URL:",
  process.env.MONGODB_URL
    ? process.env.MONGODB_URL.slice(0, 30) + "..."
    : "❌ Not Found"
);

const PORT = process.env.PORT || 3000;

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

// DB Connect
dbConnect();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Socket.IO
handleSocketConnection(io);

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Alvore Backend is Working! 🎉");
});

// API Routes
app.use(routes);

// Start Server
server.listen(PORT, () => {
  console.log(`✅ ChecklistManagement Server is running on port ${PORT} ❤❤❤❤`);
});
