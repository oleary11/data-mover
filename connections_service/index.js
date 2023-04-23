// Imports
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {
    getAuthToken,
    getSpreadSheetValues
  } = require('./connectors/GoogleSheetsConnector.js');

const { writeDataToMySQL } = require('./connectors/MySQLConnector.js')
// Constants
const app = express();
const port = 3001;

async function getGSheetData(spreadsheetId,sheetName) {
    try {
        const auth = await getAuthToken();
        const response = await getSpreadSheetValues({
        spreadsheetId,
        auth,
        sheetName
    })
    return response.data;
    } catch(error) {
      console.log(error.message, error.stack);
    }
}

async function writeToMySQL(sheetName, data) {
  try {
      const response = await writeDataToMySQL(sheetName, data);
      return response.data;
  } catch(error) {
    console.log(error.message, error.stack);
  }
}

async function gSheetToMySQL(spreadsheetId,sheetName) {
  let data = await getGSheetData(spreadsheetId,sheetName);
  return writeToMySQL(sheetName,data.values);
}

// Adding routes
app.post('/gsheet', jsonParser, (req, res) => {
    const bodyParams = req.body;
    const sheetId = bodyParams.sheetId;
    const sheetName = bodyParams.sheetName;
    getGSheetData(sheetId,sheetName).then(val => {
        res.json({ message: "Data fetched successfully!", data: val })
      });
});

app.post('/gsheetToMySQL', jsonParser, (req, res) => {
  const bodyParams = req.body;
  const sheetId = bodyParams.sheetId;
  const sheetName = bodyParams.sheetName;
  gSheetToMySQL(sheetId,sheetName).then(val => {
    console.log('gsheetToMySQL successful!', JSON.stringify(val, null, 2));
    res.json({ message: "Data moved successfully!", data: val })
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