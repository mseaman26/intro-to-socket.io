const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const apiRoutes = require('./apiRoutes');
const sequelize = require('./config/connection');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",  
        methods: ["GET", "POST"]          
    }
}); 
const PORT = 3001;


// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', apiRoutes);

// Middleware to authenticate socket connection with JWT
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return next(new Error("Authentication error"));
            }
            // Attach user ID and username to the socket object
            socket.user = {  username: decoded.data.username, id: decoded.data.id };
            next();
        });
    } else {
        next(new Error("Authentication error"));
    }
});
  
io.on("connection", (socket) => {
    // Access the user ID or username during the socket session
    const userId = socket.user.id;
    const username = socket.user.username;
    console.log(`User ${username} connected`);
    socket.on('message', (msg) => {
        io.emit('message', { message: msg, from: username });
    })

    socket.on("disconnect", () => {
        console.log(`User ${username} disconnected`);
    });
    
});


  

sequelize.sync({ force: false }).then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})

