
var inquirer = require("inquirer");
var connection = require("./develop/JS/connection")
const cTable = require('console.table');


takeAction();
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
                // employeeByDepartment();
                break;

            case "View All Empoyees by Manager":
                employeeByManager();

                break;

            case "Add Department":
                // addDepartment();
                break;

            case "Add Role":
                //function goes under:
                break;

            case "Add Employee":
                addNewEmployee();
                break;

            case "Remove Department":
                //function goes under:
                break;

            case "Remove Role":
                //function goes under:
                break;

            case "Remove Employee":
                // removeEmployee();
                break;

            case "Update Employee Role":
                //function goes under:
                break;

            case "Update Employee Manager":
                //function goes under:
                break;

            case "View the total utilized budget of a department":
                budgetOfDepartment();
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


function viewAllEmployees() {
    var query = "SELECT employees.id, employees.first_name, employees.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees";
    query += " LEFT JOIN role on employees.role_id = role.id";
    query += " LEFT JOIN department on role.department_id = department.id";
    query += " LEFT JOIN employees manager on manager.id = employees.manager_id";
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

function employeeByManager() {
    connection.query(`SELECT CONCAT(m.first_name, " ", m.last_name) AS Manager, m.id FROM employees INNER JOIN employees m ON employees.manager_id = m.id`, function (err, res) {
        inquirer.prompt({
            name: "manager_id",
            type: "list",
            message: "By what Manager would you like to view all employees?",
            choices: function () {
                let managerArr = [];

                for (i = 0; i < res.length; i++) {
                    managerArr.push(`${res[i].id}: ${res[i].Manager}`);

                }

                return managerArr;

            }
        }).then(function (answer) {
            var query = `SELECT employees.id, CONCAT(first_name, " ", last_name) AS Name, role.title 
            FROM employees INNER JOIN role ON employees.role_id = role.id 
            WHERE employees.manager_id = ${answer.manager_id[0]} GROUP BY employees.id`;
            connection.query(query, [answer.department],
                function (err, result) {
                    if (err) throw err;
                    console.log("HELLLOOOO")
                    console.table(result);
                    takeAction();
                });
        })
    });
}



// function removeEmployee() {
//     var query = "SELECT CONCAT(first_name, ' ', last_name) AS fullName,id FROM allEmployees";
//     connection.query(query, function (err, res) {
//         console.table(res);
//         inquirer.prompt([{
//             name: "removeEmployee",
//             type: "list",
//             message: "What Employee would you like to remove?",
//             choices:
//                 function () {
//                     let dEmployee = [];
//                     for (i = 0; i < res.length; i++) {
//                         dEmployee.push(`${res[i].id}: ${res[i].fullName}`)

//                     }
//                     return dEmployee;
//                 }


//         }]).then(function (answer) {
//             var query = `DELETE FROM allEmployees WHERE id = "${answer.removeEmployee[0]}"`;
//             connection.query(query, function (err, res) {
//                 if (err) throw err;
//                 console.log(`Employee ${answer.removeEmployee[0]} has been removed`);
//                 takeAction();
//             });
//         })
//     });
// };

const addNewEmployee = () => {
    connection.query(`SELECT CONCAT(first_name, " ", last_name) AS Manager, id FROM employees`, function (err, res) {
        connection.query(`SELECT DISTINCT title, id from role`, function (err, data) {
            inquirer.prompt([{
                message: "What is the employee's first name?",
                type: "input",
                name: "first_name"
            }, {
                message: "What is the employee's last name?",
                type: "input",
                name: "last_name"
            }, {
                message: "What is the employee's role?",
                type: "list",
                name: 'role_id',
                choices: function () {
                    let roleArr = [];
                    for (let i = 0; i < data.length; i++) {
                        roleArr.push(`${data[i].id}: ${data[i].title}`);
                    }
                    return roleArr;
                }
            }, {
                message: "Who will be this employee's Manager?",
                type: "list",
                name: 'manager_id',
                choices: function () {
                    let managerArr = [];
                    for (let i = 0; i < res.length; i++) {
                        managerArr.push(`${res[i].id}: ${res[i].Manager}`);
                    }
                    return managerArr;
                }
            }]).then(answer => {
                connection.query(`INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES ('${answer.first_name}', '${answer.last_name}', ${answer.role_id[0]}, ${answer.manager_id[0]})`, function (err, res) {
                    if (err) throw err;
                    console.log("--------------")
                    console.log(`Employee ${answer.first_name} ${answer.last_name} has been added`);
                    console.log("--------------")
                    takeAction();
                });
            });
        });
    });
};

function budgetOfDepartment() {
    var query = "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employees";
    query += " LEFT JOIN role on employees.role_id = role.id";
    query += " LEFT JOIN department on role.department_id = department.id";
    query += " GROUP BY department.id, department.name";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        takeAction();

    });
}