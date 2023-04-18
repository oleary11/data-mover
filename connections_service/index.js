// Imports
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {
    getAuthToken,
    getSpreadSheetValues
  } = require('./connectors/GoogleSheetsConnector.js');

// Constants
const app = express();
const port = 3001;

async function testGetSpreadSheetValues(spreadsheetId,sheetName) {
    try {
        const auth = await getAuthToken();
        const response = await getSpreadSheetValues({
        spreadsheetId,
        auth,
        sheetName
    })
    console.log('output for getSpreadSheetValues', JSON.stringify(response.data, null, 2));
    return JSON.stringify(response.data, null, 2);
    } catch(error) {
      console.log(error.message, error.stack);
    }
  }

// Adding routes
app.post('/gsheet', jsonParser, (req, res) => {
    const bodyParams = req.body;
    const sheetId = bodyParams.sheetId;
    const sheetName = bodyParams.sheetName;
    console.log(bodyParams);
    console.log(sheetId);
    console.log(sheetName);
    testGetSpreadSheetValues(sheetId,sheetName).then(val => {
        res.json({ message: "Data fetched successfully", data: val })
      });
});

app.get('/health', jsonParser, (req,res) => {
    res.json({
        "message": "connections_service up and running!"
      });
});

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

// Listener
app.listen(port, () => console.log(`connections-service listening to port - ${port}!`))