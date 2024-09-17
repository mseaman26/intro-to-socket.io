const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const apiRoutes = require('./apiRoutes');
const sequelize = require('./config/connection');
require('dotenv').config({ path: require('find-config')('.env') });

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",  // Allow requests from your Vite frontend
        methods: ["GET", "POST"]          // Allowed methods
    }
}); 
const PORT = 3001;

// In-memory user store (use a database in real projects)
const users = [];

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', apiRoutes);

// Middleware to authenticate socket connection with JWT
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
        console.log('token:', token);
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return next(new Error("Authentication error"));
            }
            console.log('decoded:', decoded);
            // Attach user ID and username to the socket object
            socket.user = {  username: decoded.data.username, id: decoded.data.id };
            next();
        });
    } else {
        next(new Error("Authentication error"));
    }
});
  
io.on("connection", (socket) => {
    console.log("User connected:", socket.user);
    console.log('user in connection event:', socket.user);
    console.log('socket id:', socket.id);   

    // Access the user ID or username during the socket session
    const userId = socket.user.id;
    const username = socket.user.username;


    socket.on("disconnect", () => {
        console.log(`User ${username} disconnected`);
    });
    socket.on('message', (msg) => {
        console.log('message: ', msg);
        console.log('from: ', socket.user.username);
        console.log('id: ', socket.user.id);
        io.emit('message', { message: msg, from: socket.user.username });
    })
});


  

sequelize.sync({ force: false }).then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})

