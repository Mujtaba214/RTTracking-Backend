// import { calculateDistanceAndEta } from "./controller/locatonController.js";

// let roomUsers = [];

// export const handleSocketConnection = (socket, io) => {
//   console.log("A User connected", socket.id);

//   socket.on("joinRoom", (roomId) => {
//     socket.join(roomId);
//     socket.roomId = roomId;
//     if (!roomUsers[roomId]) roomUsers[roomId] = {};
//     roomUsers[roomId][socket.id] = {};
//   });

//   socket.on("locationUpdate", async (data) => {
//     const { lat, lng } = data;
//     const roomId = socket.roomId;
//     if (!roomId) return;
//     roomUsers[roomId][socket.id] = { lat, lng };

//     // calculate distance/ Estimated Time (ETA)

//     const users = roomUsers[roomId];
//     const updatedUsers = await Promise.all(
//       Object.keys(users).map(async (id) => {
//         let distance = null;
//         let duration = null;

//         if (users[id] && users[socket.id]) {
//           try {
//             if (id !== socket.id) {
//               const result = await calculateDistanceAndEta(
//                 users[id],
//                 users[socket.id]
//               );
//               distance = result.distance;
//               duration = result.duration;
//             }
//           } catch (error) {
//             distance = "N/A";
//             duration = "N/A";
//           }
//         }
//         return {
//           userId: id,
//           lat: users[id].lat,
//           lng: users[id].lng,
//           distance,
//           duration,
//         };
//       })
//     );
//     io.to(roomId).emit("location update", updatedUsers);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected", socket.id);

//     const roomId = socket.roomId;

//     if (!roomId || !roomUsers[roomId]) return;

//     delete roomUsers[roomId][socket.id];

//     io.to(roomId).emit(
//       "user-offline",
//       Object.keys(roomUsers[roomId]).map((id) => ({
//         userId: id,
//         ...roomUsers[roomId][id],
//       }))
//     );

//     if (Object.keys(roomUsers[roomId]).length === 0) {
//       delete roomUsers[roomId];
//     }
//   });
// };


import { calculateDistanceAndEta } from "./controller/locatonController.js";

let roomUsers = {}; // ✅ OBJECT, not array

export const handleSocketConnection = (socket, io) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    socket.roomId = roomId;

    if (!roomUsers[roomId]) roomUsers[roomId] = {};
    roomUsers[roomId][socket.id] = {};
  });

  socket.on("locationUpdate", async ({ lat, lng }) => {
    const roomId = socket.roomId;
    if (!roomId) return;

    roomUsers[roomId][socket.id] = { lat, lng };

    const users = roomUsers[roomId];

    const updatedUsers = await Promise.all(
      Object.keys(users).map(async (id) => {
        let distance = null;
        let eta = null;

        if (id !== socket.id) {
          try {
            const result = await calculateDistanceAndEta(
              users[id],
              users[socket.id]
            );
            distance = result.distance;
            eta = result.duration;
          } catch {
            distance = "N/A";
            eta = "N/A";
          }
        }

        return {
          userId: id,
          lat: users[id].lat,
          lng: users[id].lng,
          distance,
          eta,
        };
      })
    );

    // ✅ SINGLE CONSISTENT EVENT
    io.to(roomId).emit("users-update", updatedUsers);
  });

  socket.on("disconnect", () => {
    const roomId = socket.roomId;
    if (!roomId || !roomUsers[roomId]) return;

    delete roomUsers[roomId][socket.id];

    io.to(roomId).emit(
      "users-update",
      Object.keys(roomUsers[roomId]).map((id) => ({
        userId: id,
        ...roomUsers[roomId][id],
      }))
    );

    if (Object.keys(roomUsers[roomId]).length === 0) {
      delete roomUsers[roomId];
    }
  });
};
