const express = require('express');
//add necessary imports
const socketIo = require('socket.io')
const http = require('http')
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


//Basic listeners for socket events
io.on('connection', (socket) => {
    console.log('connected!')
    socket.on('message', (msg) => {
        console.log('message recieved: ', msg)
    }) 
})



sequelize.sync({ force: false }).then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})

