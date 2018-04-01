const config = require("./config");
const fs = require("fs");

var mysql = require("mysql");
var connection = mysql.createConnection({
  host: config.SERVERNAME,
  user: config.USERNAME,
  password: config.PASSWORD,
  database: config.DBNAME
});

connection.connect();

connection.query(
  {
    sql: config.QUERY,
    timeout: 40000 // 40s
  },
  function(error, results, fields) {
    if (error) {
      return console.log(error);
    }
    // loop through recordset, build JSON string
    // is there a better way to do this?
    let superString = "{";
    for (let i = 0; i < results.length; i++) {
      let timestamp = results[i].ts;
      let num = results[i].num;
      let combined = `"${timestamp}":${num},`;
      superString += combined;
    }
    superString = superString.slice(0, -1);
    superString += "}";

    fs.writeFile(config.JSONFILE, superString, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("JSON file saved..");
      }
    });
  }
);

connection.end();
