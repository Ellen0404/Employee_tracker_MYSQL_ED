DROP DATABASE IF EXISTS employeeDB;

CREATE DATABASE employeeDB;

USE employeeDB;


CREATE TABLE department
(
  id INT NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY
    (id)
);

INSERT INTO department (id, name) VALUES (111,"Sales"); 
INSERT INTO department (id, name) VALUES (222,"Engineering");
INSERT INTO department (id, name) VALUES (333,"Finance");
INSERT INTO department (id,name) VALUES (444,"Marketing");


 CREATE TABLE role
(
  roleID INT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department_id INT,
  PRIMARY KEY (roleID),
  FOREIGN KEY (department_id) REFERENCES department (id)
  
);

INSERT INTO role (roleID, title, salary, department_id) VALUES (11,"Manager",170000,111); 
INSERT INTO role (roleID, title, salary, department_id) VALUES (22,"Engineer",130000,222); 
INSERT INTO role (roleID, title, salary, department_id) VALUES (33,"Sales lead",110000,111); 
INSERT INTO role (roleID, title, salary, department_id) VALUES (44,"Saleperson",100000,111); 
INSERT INTO role (roleID, title, salary, department_id) VALUES (55,"Accountant",85000,333); 
INSERT INTO role (roleID, title, salary, department_id) VALUES (66,"Software Engineer",125000,222); 
INSERT INTO role (roleID, title, salary, department_id) VALUES (77,"Marketologist",78000,444); 
INSERT INTO role (roleID, title, salary, department_id) VALUES (88,"Lead Engineer",150000,222); 

 CREATE TABLE employee
(
  id INT NOT NULL AUTO_INCREMENT,
  first_name  VARCHAR(30),
  last_name VARCHAR(30),
  role_id  INT,
  manager_id INT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (role_id) REFERENCES role (roleID)
  
);

 INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Bob","Collen",11,null); 
 INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Sarah","Parker",22,null); 
 INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Dill","Tron",33,null); 
 INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Mike","Geler",44,null); 
 INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Rita","Obsman",55,null); 
 INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Nicol","Kidman",77,null); 
 INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Tom","Hender",88,null); 
 INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Mila","Cohen",66,null); 


SELECT  employee.id, employee.first_name, employee.last_name,employee.manager_id, role.title, role.salary, department.name
FROM employee 
LEFT JOIN role ON employee.role_id=role.roleID
LEFT JOIN department ON role.department_id=department.id
ORDER BY employee.id;

CREATE TABLE allEmployees AS 
SELECT  employee.id, employee.first_name, employee.last_name,employee.manager_id, role.title, role.salary, department.name
FROM employee 
LEFT JOIN role ON employee.role_id=role.roleID
LEFT JOIN department ON role.department_id=department.id
ORDER BY employee.id;