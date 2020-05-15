var mysql = require('mysql');
var dbconfig = require('../config/database');
var pool = mysql.createPool(dbconfig.connection);

// Function used to get player data from database
exports.loadGame = function(username, callback) {
    var sql = "SELECT playerdata FROM save WHERE username = ?";
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log(err);
            callback(true);
            return;
        }
        connection.query("USE " + dbconfig.database);
        connection.query(sql, [username], function(error, rows) {
            console.log(rows);
            if (error) {
                console.log(error);
                callback(true);
                return;
            }
            if (rows.length) {
                console.log(rows);
                callback(false, rows);
                return;
            }
        });
    })
}


