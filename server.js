var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
// var employeeName = require("./develop/JS/employeeName");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "0404abcdef",
    database: "employeeDB"
});

connection.connect((err) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    // console.log(employeeName);
    //main function goes here :
    takeAction();
});

function takeAction() {
    inquirer.prompt({
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
            "View All Employees",
            "View All Empoyees by Department",
            "View All Empoyees by Manager",
            "View All Roles in a specific Department",
            "Add Department",
            "Add Role",
            "Add Employee",
            "Remove Department",
            "Remove Role",
            "Remove Employee",
            "Update Employee Role",
            "Update Employee Manager",
            "View the total utilized budget of a department",
            "EXIT"

        ]
    }).then(function (answer) {
        switch (answer.action) {
            case "View All Employees":
                viewAllEmployees();
                break;

            case "View All Empoyees by Department":
                employeeByDepartment();
                break;

            case "View All Empoyees by Manager":
                //function goes under:
                break;

            case "Add Department":
                // addDepartment();
                break;

            case "Add Role":
                //function goes under:
                break;

            case "Add Employee":
                addEmployee();
                break;

            case "Remove Department":
                //function goes under:
                break;

            case "Remove Role":
                //function goes under:
                break;

            case "Remove Employee":
                removeEmployee();
                break;

            case "Update Employee Role":
                //function goes under:
                break;

            case "Update Employee Manager":
                //function goes under:
                break;

            case "View the total utilized budget of a department":
                //function goes under:
                break;

            case "EXIT":
                console.table("Thank you for using my Employee tracker app!")
                connection.end();
                break;

            default:
                return "You will never get to this point)"

        }
    });
}
const query = "CREATE TABLE allEmployees AS SELECT  employee.id, employee.first_name, employee.last_name,employee.manager_id, role.title, role.salary, department.name FROM employee LEFT JOIN role ON employee.role_id=role.roleID LEFT JOIN department ON role.department_id=department.id ORDER BY employee.id;";


function viewAllEmployees() {
    var query = "SELECT * FROM employeeDB.allEmployees"
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        takeAction();
    });
};


function employeeByDepartment() {
    inquirer.prompt({
        name: "department",
        type: "list",
        message: "By what department would you like to view all employees?",
        choices: [
            "Sales",
            "Engineering",
            "Finance",
            "Marketing"
        ]
    }).then(function (answer) {
        var query = `SELECT * FROM employeeDB.allEmployees WHERE name="${answer.department}"`;
        connection.query(query, function (err, res) {
            if (err) throw err;
            console.table(res);
            takeAction();
        });
    })
};

function addEmployee() {
    inquirer.prompt([
        {
            name: "employeeFirstName",
            type: "input",
            message: "What is the Employee's First name?"

        },
        {
            name: "employeeLastName",
            type: "input",
            message: "What is the Employee's Last name?"
        },
        {
            name: "employeeRole",
            type: "input",
            message: "What is the Employee's Role?"
        }]).then(function (answer) {
            var query = "INSERT INTO allEmployees SET ?";
            var employeeAnswers = {
                first_name: answer.employeeFirstName,
                last_name: answer.employeeLastName,
                title: answer.employeeRole
            }
            connection.query(query, employeeAnswers, function (err, res) {
                if (err) throw err;
                console.table(res);
                takeAction();
            });
        })
}

function removeEmployee() {
    var query = "SELECT CONCAT(first_name, ' ', last_name) AS fullName,id FROM allEmployees";
    connection.query(query, function (err, res) {
        console.table(res);
        inquirer.prompt([{
            name: "removeEmployee",
            type: "list",
            message: "What Employee would you like to remove?",
            choices:
                function () {
                    let dEmployee = [];
                    for (i = 0; i < res.length; i++) {
                        dEmployee.push(`${res[i].id}: ${res[i].fullName}`)

                    }
                    return dEmployee;
                }


        }]).then(function (answer) {
            var query = `DELETE FROM allEmployees WHERE id = "${answer.removeEmployee[0]}"`;
            connection.query(query, function (err, res) {
                if (err) throw err;
                console.log(`Employee ${answer.removeEmployee[0]} has been removed`);
                takeAction();
            });
        })
    });
};

