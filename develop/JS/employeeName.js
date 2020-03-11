
var collectEmployeeName = function () {
    var query = "SELECT * FROM employeeDB.allEmployees"
    connection.query(query, function (err, res) {
        if (err) throw err;
        return res;
    });
}

collectEmployeeName();
var employeeName = JSON.stringify(collectEmployeeName);
console.log(employeeName);

module.exports = { employeeName };