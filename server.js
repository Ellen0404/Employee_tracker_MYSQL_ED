var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");

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
                //function goes under:
                break;

            case "View All Empoyees by Department":
                //function goes under:
                break;

            case "View All Empoyees by Manager":
                //function goes under:
                break;

            case "View All Roles in a specific Department":
                //function goes under:
                break;

            case "Add Department":
                //function goes under:
                break;

            case "Add Role":
                //function goes under:
                break;

            case "Add Employee":
                //function goes under:
                break;

            case "Remove Department":
                //function goes under:
                break;

            case "Remove Role":
                //function goes under:
                break;

            case "Remove Employee":
                //function goes under:
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
                connection.end();
                break;

            default:
                return "You will never get to this point)"

        }
    });
}