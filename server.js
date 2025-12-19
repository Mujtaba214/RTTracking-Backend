// import cors from "cors";
// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import { handleSocketConnection } from "./socket-handler.js";
// import locationRoutes from "./routes/locationRoutes.js";

// const app = express();
// app.use(express.json());
// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );
// app.use("/api/locations", locationRoutes);
// app.get("/", (req, res) => {
//   res.send("Hello /");
// });

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   },
// });

// // SOCKET CONNECTION

// io.on("connection", (socket) => {
//   console.log("New client connected", socket?.id);
//   /*
//   {

//   this code is nromally used for making a connection with socket.io, its of no use currently but commented out for this project solely
  
// //   recieve event from client

//   socket.on("message", (data) => {
//     console.log("Message from client", data);
//   });

// //   send back to all clients

//   io.emit("message", data);
// }
// */

//   handleSocketConnection(socket, io);
//   socket.on("disconnect", () => {
//     console.log("CLient disconnect", socket.id);
//   });
// });

// const PORT = 5000;

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
