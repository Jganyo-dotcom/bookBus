const socket = (req, res, next) => {
  if (req.user)
    io.on("connection", (socket) => {
      socket.join(req.user.id);
      next();
    });
};

module.exports = { socket };
