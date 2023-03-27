const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (receiverId) => {
  return users.find((user) => user.userId === receiverId);
};

io.on("connection", (socket) => {
  socket.on("addUserToSocketArray", (userId) => {
    addUser(userId, socket.id);
    socket.emit("usersSocketsArray", users);
  });
  
  socket.on("sendMessage", ({userId, receiverId, message}) => {
    const user = getUser(receiverId)
    console.log(message)
    socket.to(user?.socketId).emit("newMessage", {
      userId,
      message,
      notification: true
    });
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    // socket.emit("usersSocketsArray", users);
  });
});
