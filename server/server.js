const express = require('express');
//add necessary imports
const socketIo = require('socket.io')
const http = require('http')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser');
const apiRoutes = require('./apiRoutes');
const sequelize = require('./config/connection');
require('dotenv').config();

const app = express();

// Middleware to parse request bodies and use API routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', apiRoutes);

//create a server instance with http
const server = http.createServer(app)
//bind socket.io instance to server
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

const PORT = 3001;

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


//Basic listeners for socket events
io.on('connection', (socket) => {
    console.log('connected!')
    socket.on('hello', () => {
        console.log('i hear you, client! ')
        socket.emit('hello')
    })
    socket.on('message', (msg) => {
        console.log('message recieved: ', msg)
        const username = socket.user.username
        io.emit('message', {
            username: username,
            message: msg
        })
    }) 
})



sequelize.sync({ force: false }).then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})

