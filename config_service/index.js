// Imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Source = require('./models/Source')
const Destination = require('./models/Destination');

// Constants
const app = express();
const port = 3000;
const jsonParser = bodyParser.json() // create application/json parser

// Database
const DB_URL = 'mongodb://127.0.0.1:27017/config_db';
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

// Endpoints
app.get('/source', (req, res) => {
    Source.find({})
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        console.log(err);
        res.json({"message" : "Error fetching sources."});
    })
});

app.get('/source/:id', (req, res) => {
    Source.findOne({"SourceId" : req.params.id})
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        console.log(err);
        res.json({"message" : "Error fetching source."});
    })
});

app.post('/source', jsonParser, (req, res) => {
    const new_source = new Source(req.body);
    new_source.save().then(val => {
        res.json({ message: "Source added successfully", data: val })
      });
});

app.put('/source/:id', jsonParser, (req, res) => {
    const new_source = new Source(req.body);
    Source.updateOne({ "SourceId" : req.params.id}, {
        $set: {
            SourceType : new_source.SourceType,
            ClientId : new_source.ClientId,
            ClientSecret : new_source.ClientSecret,
            RefreshToken : new_source.RefreshToken
        }
    }).then(val => {
        res.json({ message: "Source updated successfully", data: val })
      });
  });

app.delete('/source/:id', jsonParser, (req, res) => {
    
    Source.deleteOne({ "SourceId" : req.params.id})
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.json({"message" : "Error deleting source."});
    })
});

app.get('/destination', (req, res) => {
    Destination.find({})
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.json({"message" : "Error fetching destinations."});
    })
});

app.get('/destination/:id', (req, res) => {
    Source.findOne({"DestinationId" : req.params.id})
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        console.log(err);
        res.json({"message" : "Error fetching destination."});
    })
});

app.post('/destination', jsonParser, (req, res) => {
    const new_destination = new Destination(req.body);
    new_destination.save().then(val => {
        res.json({ message: "Destination added successfully", data: val })
      });
});

app.put('/destination/:id', jsonParser, (req,res) => {
    const new_destination = new Destination(req.body);
    Destination.updateOne({"DestinationId" : req.params.id}, {
        $set: {
            DestinationType: new_destination.DestinationType,
            Host: new_destination.Host,
            Post: new_destination.port,
            DBName: new_destination.DBName,
            User: new_destination.User,
            Pass: new_destination.Pass
        }
    })
    .then(val => {
        res.json({message : "Destination updated successfully", data: val})
    })
    .catch((err) => {
        console.log(err);
        res.json({"message" : "Error updating Destination."});
    });
})

app.delete('/destination/:id', jsonParser, (req,res) => {
    Destination.deleteOne({"DestinationId" : req.params.id})
    .then((data) => {
        res.json(data)
    })
    .catch((err) => {
        res.json({"message" : "Error deleting destination."});
    })
});

// Middleware
app.use(cors({
    origin: '*'
}));

// Listener
app.listen(port, () => console.log(`Config service listening to port - ${port}!`))
