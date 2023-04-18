const bodyParser = require('body-parser');
const Connection = require('./../models/Connection');
const jsonParser = bodyParser.json()

module.exports = function(app){

app.get('/connection', jsonParser, (req, res) => {
    Connection.find({})
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.json({"message" : "Error fetching connections."});
    })
});

app.get('/connection/:id', jsonParser, (req, res) => {
    Connection.findOne({"ConnectionId" : req.params.id})
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.json({"message" : "Error fetching connection."});
    })
});

app.post('/connection', jsonParser, (req, res) => {
    const new_connection = new Connection(req.body);
    new_connection.save().then(val => {
        res.json({ message: "Connection added successfully", data: val })
      });
});

app.put('/connection/:id', jsonParser, (req,res) => {
    const new_connection = new Connection(req.body);
    Connection.updateOne({"ConnectionId" : req.params.id}, {
        $set: {
            SourceId: new_connection.SourceId,
            DestinationId: new_connection.DestinationId
        }
    })
    .then(val => {
        res.json({message : "Connection updated successfully", data: val})
    })
    .catch((err) => {
        console.log(err);
        res.json({"message" : "Error updating Connection."});
    });
});

app.delete('/connection/:id', jsonParser, (req,res) => {
    Connection.deleteOne({"ConnectionId" : req.params.id})
    .then((data) => {
        res.json(data)
    })
    .catch((err) => {
        res.json({"message" : "Error deleting connection."});
    })
});

}