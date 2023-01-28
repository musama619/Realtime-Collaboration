const io = require("socket.io")(8000, {
    cors: {
        origin: "*",
    },
});

const users = [];
var session = [];

io.on("connection", (socket) => {
    socket.on("message", (data) => {
        socket.in(data.session).emit("new-data", {
            message: data.text,
            name: users[socket.id],
        });
    });

    socket.on("create-session", (sessionName) => {
        session.push({ name: sessionName, users: [socket.id] });
        socket.join(sessionName);
        io.to(sessionName).emit("user-joined", { user: socket.id });
    });

    socket.on("join-session", (sessionName) => {
        if (session.find((r) => r.name === sessionName)) {
            socket.join(sessionName);
            io.to(sessionName).emit("user-joined", { user: socket.id });
        } else {
            socket.emit("session-not-exists")
        }
    });

    socket.on("disconnect", (message) => {
        socket.broadcast.emit("left", users[socket.id]);
        delete users[socket.id];
    });
});
