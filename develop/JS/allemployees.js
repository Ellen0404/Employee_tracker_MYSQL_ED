class AllEmployees {
    allEmployees = () => {
        var query = "SELECT  employee.id, employee.first_name, employee.last_name,employee.manager_id, role.title, role.salary, department.name FROM employee LEFT JOIN role ON employee.role_id=role.roleID LEFT JOIN department ON role.department_id=department.id ORDER BY employee.id";
        connection.query(query, function (err, res) {
            return console.table(res);

        });

    };
}

module.exports = AllEmployees;