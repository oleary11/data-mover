// Imports
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Constants
const app = express();
const port = 8080;

// Database
const DB_URL = `mongodb://${process.env.config_database_host}:${process.env.config_database_port}/config_db`;
console.log(DB_URL);
const DB_OPTIONS = { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    user: 'user', 
    pass: 'Password@123' 
}
mongoose.connect(DB_URL,DB_OPTIONS);
mongoose.connection.once('open', function () {
    console.log('Database connected Successfully');
}).on('error', function (err) {
    console.log('Error', err);
})
const db = mongoose.connection;

// Adding routes
require('./routes/source')(app);
require('./routes/destination')(app);
require('./routes/connection')(app);

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

// Listener
app.listen(port, () => console.log(`Config service listening to port - ${port}!`))
