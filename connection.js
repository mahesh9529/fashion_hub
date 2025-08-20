var mysql=require("mysql");
var util=require("util");

var connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"shourya_fashoin_hub"
});

var execute=util.promisify(connection.query).bind(connection);

module.exports=execute;