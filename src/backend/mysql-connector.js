//===============================IMPORTS==================================================
const mysql = require('mysql');

//===============================DB CONNECTION============================================
const connection = mysql.createConnection({
    host: 'mysql-server',
    port: 3306,
    user: 'root',
    password: 'userpass',
    database: 'smart_home'
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
