const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const apiRoutes = require('./apiRoutes');
const sequelize = require('./config/connection');

const app = express();
const PORT = 3001;

// In-memory user store (use a database in real projects)
const users = [];

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', apiRoutes);



sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})

