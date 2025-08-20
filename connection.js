var mysql=require("mysql");
var util=require("util");

var connection=mysql.createConnection({
    host:"bv27tjwbdybr7ducpzd4-mysql.services.clever-cloud.com",
    user:"uop3tzwjho8y6f4g",
    password:"VNAVzBDrgbuMXbGcrna2",
    database:"bv27tjwbdybr7ducpzd4"
});

var execute=util.promisify(connection.query).bind(connection);

module.exports=execute;
