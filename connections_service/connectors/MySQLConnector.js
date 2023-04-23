const mysql = require('mysql');

// TODO: Move this to a config file. No hardcoding.
// Create a connection object
const connection = mysql.createConnection({
    host: '34.106.94.151',
    port: 3306,
    user: 'testuser',
    password: 'Password@123',
    database: 'import'
});

async function writeDataToMySQL(tableName, data) {
    // Check if the connection is valid
    if (!connection) {
        throw new Error('Invalid connection');
    }

    // Create table if it doesn't exist.
        var sql = "CREATE TABLE IF NOT EXISTS Sheet1 (city VARCHAR(255), number INT)";
        connection.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Table created!");
        });

    // TODO: remove this
    console.log("Console logging data!");
    console.log(data);

    // Build the query
    let keys = data.splice(0, 1);
    const query = `INSERT INTO ${tableName} (${keys}) VALUES ?`;

    // Execute the query
    connection.query(query, [data], (err, results) => {
        if (err) {
            throw new Error('Error writing to MySQL:', err);
        }
        return { "message": "Data written successfully" }
    });
}

module.exports = {
    writeDataToMySQL
}