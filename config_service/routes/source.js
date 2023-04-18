const bodyParser = require('body-parser');
const Source = require('./../models/Source');
const jsonParser = bodyParser.json()

module.exports = function(app){
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
}