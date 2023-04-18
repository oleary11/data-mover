const bodyParser = require('body-parser');
const Destination = require('./../models/Destination');
const jsonParser = bodyParser.json()

module.exports = function(app){
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
}