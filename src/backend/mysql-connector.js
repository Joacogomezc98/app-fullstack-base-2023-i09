//===============================IMPORTS==================================================
const mysql = require('mysql');
const config = require("./config.js");

//===============================DB CONNECTION============================================
const connection = mysql.createConnection({
    host: config.DB_HOST,
    port: config.DB_PORT,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME
});

//=======[ Main module code ]==================================================

connection.connect((err) => {
    if (err) {
        console.error('Error while connect to DB: ' + err.stack);
        return;
    }
    console.log('Connected to DB under thread ID: ' + connection.threadId);
});

module.exports = connection;

//=======[ End of file ]=======================================================
