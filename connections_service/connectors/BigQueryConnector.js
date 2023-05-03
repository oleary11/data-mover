const { BigQuery } = require('@google-cloud/bigquery');

const projectId = 'data-mover-beta';
const datasetName = 'imports';
const client = new BigQuery();
const location = 'US';
										
datasetId = 'imports', 
  tableId = 'Sheet1', 
  schema = [
    {name: 'PassengerId', type: 'STRING'},
    {name: 'Survived', type: 'STRING'},
    {name: 'Pclass', type: 'STRING'},
    {name: 'Name', type: 'STRING'},
    {name: 'Sex', type: 'STRING'},
    {name: 'Age', type: 'STRING'},
    {name: 'SibSp', type: 'STRING'},
    {name: 'Parch', type: 'STRING'},
    {name: 'Ticket', type: 'STRING'},
    {name: 'Fare', type: 'STRING'},
    {name: 'Cabin', type: 'STRING'},
    {name: 'Embarked', type: 'STRING'},
  ]

async function createBQDataset(projectId, datasetName, rows){
    data = []
    let res = [rows][0].values;
    res.forEach(row => {
        item = {}
        item['PassengerId'] = row[0];
        item['Survived'] = row[1];
        item['Pclass'] = row[2];
        item['Name'] = row[3];
        item['Sex'] = row[4];
        item['Age'] = row[5];
        item['SibSp'] = row[6];
        item['Parch'] = row[7];
        item['Ticket'] = row[8];
        item['Fare'] = row[9];
        item['Cabin'] = row[10];
        item['Embarked'] = row[11];
        data.push(item);
    });
    console.log('printing data');
    console.log(data);
    // Create a BigQuery client
    const client = new BigQuery(
        keyFilename = './big_query_service_account_credentials.json',
        projectId = projectId
    );

    // // Check if the dataset exists
    // const dataset = await client.dataset(datasetName).get();

    // // If the dataset doesn't exist, create it
    // if (!dataset) {
    // const datasetConfig = {
    //     datasetId: datasetName,
    //     location: 'us',
    // };
        // const [dataset] = await client.createDataset(datasetName);
        // console.log(`Dataset ${dataset.id} created.`);
    // } else {
    // console.log('Dataset already exists');
    // return { "message": "Dataset already exists" }  
    // }

    const options = {
        schema: schema,
        location: 'US',
      };
  
    //   Create a new table in the dataset
      const [table] = await client
        .dataset(datasetId)
        .createTable(tableId, options);
      
      console.log(`Table ${table.id} created.`);

      await client
      .dataset(datasetId)
      .table('Sheet1')
      .insert(data);

}

module.exports = {
    createBQDataset
}