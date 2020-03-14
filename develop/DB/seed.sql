DROP DATABASE IF EXISTS employeeDB;

CREATE DATABASE employeeDB;

USE employeeDB;


CREATE TABLE department
(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY
    (id)
);

INSERT INTO department (name) VALUES ("Sales"); 
INSERT INTO department (name) VALUES ("Engineering");
INSERT INTO department (name) VALUES ("Finance");
INSERT INTO department (name) VALUES ("Marketing");


 CREATE TABLE role
(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department (id)
  
);

INSERT INTO role (title, salary, department_id) VALUES ("Manager",170000,1); 
INSERT INTO role (title, salary, department_id) VALUES ("Engineer",130000,2); 
INSERT INTO role (title, salary, department_id) VALUES ("Sales lead",110000,1); 
INSERT INTO role (title, salary, department_id) VALUES ("Saleperson",100000,1); 
INSERT INTO role (title, salary, department_id) VALUES ("Accountant",85000,3); 
INSERT INTO role (title, salary, department_id) VALUES ("Software Engineer",125000,2); 
INSERT INTO role (title, salary, department_id) VALUES ("Marketologist",78000,4); 
INSERT INTO role (title, salary, department_id) VALUES ("Lead Engineer",150000,2); 

 CREATE TABLE employees
(
  id INT NOT NULL AUTO_INCREMENT,
  first_name  VARCHAR(30),
  last_name VARCHAR(30),
  role_id  INT,
  manager_id INT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (role_id) REFERENCES role (id)
  
);

 INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Bob","Collen",1,null); 
 INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Sarah","Parker",2,7); 
 INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Dill","Tron",3,1); 
 INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Mike","Geler",4,3); 
 INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Rita","Obsman",5,1); 
 INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Nicol","Kidman",7,null); 
 INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Tom","Hender",8,null); 
 INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Mila","Cohen",6,7); 


SELECT  employees.id, employees.first_name, employees.last_name,employees.manager_id, role.title, role.salary, department.name
FROM employees 
LEFT JOIN role ON employees.role_id=role.id
LEFT JOIN department ON role.department_id=department.id
ORDER BY employees.id;

CREATE TABLE allEmployees AS 
SELECT  employees.id, employees.first_name, employees.last_name,employees.manager_id, role.title, role.salary, department.name
FROM employees
LEFT JOIN role ON employees.role_id=role.id
LEFT JOIN department ON role.department_id=department.id
ORDER BY employees.id;

---ALL EMPLOYEES--

SELECT employees.id, employees.first_name, employees.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
 FROM employees LEFT JOIN role on employees.role_id = role.id
 LEFT JOIN department on role.department_id = department.id 
LEFT JOIN employees manager on manager.id = employees.manager_id;

--BY MANAGER 
SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, role.title, role.salary, role.department_id AS Department, CONCAT(m.first_name, " ", m.last_name) AS Manager 
FROM employees
LEFT JOIN role ON employees.role_id = role.id
INNER JOIN department ON role.department_id = department_id 
INNER JOIN employees m ON employees.manager_id = m.id WHERE CONCAT(m.first_name, " ", m.last_name) IN ('Bob Collen')
GROUP BY employees.id;


