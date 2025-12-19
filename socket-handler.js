let roomUsers = [];

export const handleSocketConnection = (socket, io) => {
  console.log("A User connected", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    socket.roomId = roomId;
    if (!roomUsers[roomId]) roomUsers[roomId] = {};
    roomUsers[roomId][socket.id] = {};
  });

  socket.on("locationUpdate", async (data) => {
    const { lat, lng } = data;
    const roomId = socket.roomId;
    if (!roomId) return;
    roomUsers[roomId][socket.id] = { lat, lng };

    // calculate distance/ Estimated Time (ETA)

    const users = roomUsers[roomId];
    const updatedUsers = await Promise.all(
      Object.keys(users).map(async (id) => {
        let distance = null;
        let duration = null;

        if (users[id] && users[socket.id]) {
          try {
            if (id !== socket.id) {
              const result = await calculateDistanceAndEta(
                users[id],
                users[socket.id]
              );
              distance = result.distance;
              duration = result.duration;
            }
          } catch (error) {
            distance = "N/A";
            duration = "N/A";
          }
        }
      })
    );
  });
};
