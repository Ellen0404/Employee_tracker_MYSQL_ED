
var inquirer = require("inquirer");
var connection = require("./develop/JS/connection")
const cTable = require('console.table');
const colors = require('colors');


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
            "View All Departments",
            "View All Roless",
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
                employeeByManager();

                break;

            case "View All Departments":
                allDepartment();

                break;

            case "View All Roless":
                allRoles();

                break;

            case "Add Department":
                addDepartment();
                break;

            case "Add Role":
                addRole();
                break;

            case "Add Employee":
                addNewEmployee();
                break;

            case "Remove Department":
                removeDepartment();
                break;

            case "Remove Role":
                removeRole();
                break;

            case "Remove Employee":
                removeEmployee();
                break;

            case "Update Employee Role":
                updateRole();
                break;

            case "Update Employee Manager":
                updateManager();
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


const viewAllEmployees = () => {
    var query = "SELECT employees.id, employees.first_name, employees.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees";
    query += " LEFT JOIN role on employees.role_id = role.id";
    query += " LEFT JOIN department on role.department_id = department.id";
    query += " LEFT JOIN employees manager on manager.id = employees.manager_id";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("ALL Employees View".green)
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
        var query = `SELECT employees.id, CONCAT(employees.first_name," ", employees.last_name) AS FullName, department.name AS department
        FROM employees 
        LEFT JOIN role on employees.role_id = role.id
        LEFT JOIN department on role.department_id = department.id 
        WHERE department.name ="${answer.department}"`;
        connection.query(query, function (err, res) {
            if (err) throw err;
            console.log("ALL Employees By Department".green)
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
            choices: res.map(o => ({ name: o.Manager, value: o.id }))

        }).then(function (answer) {
            var query = `SELECT employees.id, CONCAT(first_name, " ", last_name) AS Name, role.title 
            FROM employees INNER JOIN role ON employees.role_id = role.id 
            WHERE employees.manager_id = ${answer.manager_id} GROUP BY employees.id`;
            connection.query(query,
                function (err, result) {
                    if (err) throw err;
                    console.log("ALL Employees By Manager".green)
                    console.table(result);
                    takeAction();
                });
        })
    });
}

function allDepartment() {
    var query = "SELECT * FROM department";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("ALL Departments".magenta)
        console.table(res);
        takeAction();
    });
}
function allRoles() {
    var query = `SELECT role.id,role.title, role.salary, department.name AS Department
     FROM role 
     LEFT JOIN department ON department.id =role.department_id
    ORDER BY role.id `;
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("ALL Roles".magenta)
        console.table(res);
        takeAction();
    });
}
function addDepartment() {
    inquirer.prompt([{
        message: "What department would you like to add?",
        type: "input",
        name: "newdepartment"
    }]).then(answer => {
        connection.query(`INSERT INTO department (name) VALUES ("${answer.newdepartment}")`, function (err, res) {
            if (err) throw err;
            console.log(`Department ${answer.newdepartment} has been added`.yellow);
            takeAction();
        });

    })

}

function addRole() {
    connection.query("SELECT * FROM  department", function (req, res) {
        inquirer.prompt([{
            message: "What is going to be a new Role Title?",
            type: "input",
            name: "newTitle"
        }, {
            message: "What is going to be a Salary for that Role?",
            type: "input",
            name: "newSalary"
        }, {
            message: "To what Department would you like to assign this new Role?",
            type: "list",
            name: "roleDepartID",
            choices: res.map(item => ({ name: item.name, value: item.id }))

        }]).then(answer => {
            connection.query(`INSERT INTO role(title, salary,department_id) VALUES ('${answer.newTitle}', '${answer.newSalary}',${answer.roleDepartID})`, function (err, res) {
                if (err) throw err;
                console.log(`New Role has been added`.yellow);
                takeAction();
            });
        });
    });
}
function addNewEmployee() {
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
                choices: data.map(o => ({ name: o.title, value: o.id }))

            }, {
                message: "Who will be this employee's Manager?",
                type: "list",
                name: 'manager_id',
                choices: res.map(o => ({ name: o.Manager, value: o.id }))


            }]).then(answer => {
                connection.query(`INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES ('${answer.first_name}', '${answer.last_name}', ${answer.role_id}, ${answer.manager_id})`, function (err, res) {
                    if (err) throw err;
                    console.log("--------------")
                    console.log(`Employee ${answer.first_name} ${answer.last_name} has been added`.yellow);
                    console.log("--------------")
                    takeAction();
                });
            });
        });
    });
};
function removeDepartment() {
    connection.query("SELECT name, id FROM  department", function (err, res) {

        const departmentChoices = res.map(item => {
            return {
                name: item.name,
                value: item.id
            }
        });

        inquirer.prompt([{
            message: "What Department would you like to remove?",
            type: "list",
            name: "removedDepartment",
            choices: departmentChoices

        }]).then(function (answer) {

            const thisDepartment = departmentChoices.filter(item => item.value === answer.removedDepartment);
            var query = `DELETE FROM department WHERE id ="${answer.removedDepartment}"`;
            connection.query(query, function (err, res) {
                if (err) throw err;
                console.log(`Department ${thisDepartment[0].name} has been removed`.red);
                takeAction();
            });
        });
    });
};
function removeRole() {
    connection.query("SELECT title, id FROM role", function (req, res) {
        const roleChoices = res.map(item => ({ name: item.title, value: item.id }));

        inquirer.prompt([{
            message: "What Role whould you like to remove?",
            type: "list",
            name: "removeRoleChoice",
            choices: roleChoices
        }]).then(function (answer) {
            const thisRole = roleChoices.filter(item => item.value === answer.removeRoleChoice);
            var query = `DELETE FROM role WHERE id ="${answer.removeRoleChoice}"`;
            connection.query(query, function (err, res) {
                if (err) throw err;
                console.log(`Role ${thisRole[0].name} has been removed`.red);
                takeAction();
            });
        });
    });
}
function removeEmployee() {
    var query = "SELECT CONCAT(first_name, ' ', last_name) AS fullName,id FROM employees";
    connection.query(query, async function (err, res) {

        const employeeChoices = res.map(item => {
            return {
                name: item.fullName,
                value: item.id
            }
        });

        inquirer.prompt([{

            type: "list",
            name: "employeeId",
            message: "Which employee do you want to remove?",
            choices: employeeChoices

        }]).then(function (answer) {

            const thisUser = employeeChoices.filter(item => item.value === answer.employeeId);
            var query = `DELETE FROM employees WHERE id = "${answer.employeeId}"`;
            connection.query(query, function (err, res) {
                if (err) throw err;
                console.log(`Employee ${thisUser[0].name} has been removed`.red);
                takeAction();
            });
        })
    });
};

function updateRole() {
    connection.query(`SELECT CONCAT(first_name, " ", last_name) AS Employee, id FROM employees`, function (err, res) {
        connection.query(`SELECT title, id from role`, function (err, data) {
            inquirer.prompt([{
                message: "What is yhe name of Employee that you would like to update a Role?",
                type: "list",
                name: "updatedEmployee",
                choices: res.map(o => ({ name: o.Employee, value: o.id }))
            }, {
                message: "What is the employee's new Role?",
                type: "list",
                name: 'role_id',
                choices: data.map(o => ({ name: o.title, value: o.id }))

            }]).then(answer => {
                connection.query(`UPDATE employees SET role_id ="${answer.role_id}" WHERE id ="${answer.updatedEmployee}"`, function (err, res) {
                    if (err) throw err;
                    console.log(" Employee's Role has been updated".green)

                    takeAction();
                });
            });
        });
    });

}

function updateManager() {
    connection.query(`SELECT CONCAT(first_name, " ", last_name) AS Employee, id FROM employees`, function (err, res) {
        connection.query(`SELECT CONCAT(first_name, " ", last_name) AS Manager, id FROM employees`, function (err, data) {
            inquirer.prompt([{
                message: "What is the name of Employee that you would like to update a Manager?",
                type: "list",
                name: "employeeID",
                choices: res.map(o => ({ name: o.Employee, value: o.id }))
            }, {
                message: "Who is the new employee's Manager?",
                type: "list",
                name: 'managerID',
                choices: data.map(o => ({ name: o.Manager, value: o.id }))

            }]).then(answer => {
                connection.query(`UPDATE employees SET manager_id ="${answer.managerID}" WHERE id ="${answer.employeeID}"`, function (err, res) {
                    if (err) throw err;
                    console.log(" Employee's Manager has been updated".green)

                    takeAction();
                });
            });
        });
    });
}
function budgetOfDepartment() {
    var query = "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employees";
    query += " LEFT JOIN role on employees.role_id = role.id";
    query += " LEFT JOIN department on role.department_id = department.id";
    query += " GROUP BY department.id, department.name";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log(`View Budget of a Department`.yellow);
        console.table(res);
        takeAction();

    });
}