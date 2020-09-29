// Requirements and global variables //
const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("console.table");

const arrayRoles = [];
const arrayManagers = [];
const arrayDepartments = [];
const arrayEmployees = [];

// mysql connection //
var connection = mysql.createConnection({
   host: "localhost",
   port: 3306,
   user: "root",
   password: "Dinosql4",
   database: "employeeTracker"
 });

 connection.connect((err) => {
   if (err) throw err;
   employeeTracker();
 });
 
// Functions //
employeeTracker = function() {

   //Array Calls //
   arrayEmployeesFunc();
   arrayManagersFunc();
   arrayRolesFunc();
   arrayDepartmentsFunc();

   inquirer.prompt({
      name: "greeting",
      type: "list",
      message: "What do you want to do?",
      choices: [
         "Add Employee", "Add Department", "Add Role",
         "View all Employees", "View all Departments", "View all Roles",
         "Update Employee Role",
         "EXIT"
      ]
   }).then(function (answer){
      switch (answer.greeting) {
         case "Add Employee": {
            addEmployee();
            break;
         }
         case "Add Department": {
            addDepartment();
            break;
         }
         case "Add Role": {
            addRole();
            break;
         }
         case "View all Employees": {
            viewEmployees();
            break;
         }
         case "View all Departments": {
            viewDepartments();
            break;
         }
         case "View all Roles": {
            viewRoles();
            break;
         }
         case "Update Employee Role": {
            updateRole();
            break;
         }
         case "EXIT": {
            console.log ("\n Have a nice day \n");
            connection.end();
            break;
         }
      }
   })
}
// Array Functions //
function arrayManagersFunc() {
   connection.query("SELECT first_name, last_name FROM employees WHERE manager_id IS NULL",
   (err, answer) => {
       if (err) throw err;
       for (var i = 0; i < answer.length; i++) {
           arrayManagers.push(`${answer[i].first_name} ${answer[i].last_name}`);
         }
   })
   return arrayManagers;
}
function arrayRolesFunc() {
   connection.query("SELECT * FROM roles",
   (err, answer) => {
       if (err) throw err;
       for (var i = 0; i < answer.length; i++) {
           arrayRoles.push(answer[i].title);
         }
   })
   return arrayRoles;
}
function arrayEmployeesFunc() {
   connection.query("SELECT first_name, last_name FROM employees",
   (err, answer) => {
       if (err) throw err;
       for (var i = 0; i < answer.length; i++) {
           arrayEmployees.push(answer[i].title);
         }
   })
   return arrayEmployees;
}
function arrayDepartmentsFunc() {
   connection.query("SELECT * FROM departments",
   (err, answer) => {
       if (err) throw err;
       for (var i = 0; i < answer.length; i++) {
           arrayDepartments.push(answer[i].title);
         }
   })
   return arrayDepartments;
}

// Adder functions //
function addEmployee() {
   inquirer.prompt([
      {
         name: "firstName",
         message: "What is your employee's first name?",
         type: "string"
      },
      {
         name: "lastName",
         message: "What is your employee's last name?",
         type: "string"
      },
      {
         name: "employeeRole",
         message: "What is your employee's role?",
         type: "list",
         choices: arrayRoles
      },
      {
         name: "employeeManager",
         message: "Dooes your employee have a manager?",
         type: "list",
         choices: ["yes", "no"]
      },
   ]).then(function (answers){
         switch (answer.employeeManager) {
            case "yes": {
               managerPrompt();
               break;
            }
            case "no": {
               console.log("Your employee has been entered");
               employeeTracker();
               break;
            }
         }
   })
}
function managerPrompt() {
   inquierer.prompt ([{
      name: "managerName",
      message: "What is the manager's name",
      type: "list",
      choices: arrayManagers
   }])
}
function addRole() {
   connection.query( `SELECT roles.title AS Title, roles.salary AS Salary FROM roles`, (err, results) => {
        if (err) throw err;
   inquirer.prompt([
      {
         name: "roleTitle",
         message: "What is the job title of the new role?",
         type: "input"
      },
      {
         name: "salary",
         message: "What is the salary for the role?",
         type: "input"
      },
      {
         name: "department",
         message: "What department is this role in?",
         type: "list",
         choices: arrayDepartments
      }
   ]).then(function (answers) {
      connection.query(
         "INSERT INTO roles SET ?",
         {
         title: answers.roleTitle,
         salary: answers.salary,
         },
         (err) => {
         if (err) throw err;
         
         console.log("New role added");
         employeeTracker();
         }
     );
   })
   })
}
function addDepartment() {
   connection.query( `SELECT departments.name FROM employeeTracker.departments`, (err, results) => {
        if (err) throw err;
   inquirer.prompt([
      {
         name: "newDepartment",
         message: "What is the name of the new department?",
         type: "input"
      }
   ]).then(function (answers) {
      connection.query(
         "INSERT INTO departments SET ?",
         {
        department: answers.newDepartmemt,
         },
         (err) => {
         if (err) throw err;
         
         console.log("New department added");
         employeeTracker();
         }
     );
   })
   })
}

// Viewing Functions //
function viewEmployees() {
   connection.query(`SELECT employees.first_name AS FirstName, employees.last_name AS LastName, roles.title AS Role, departments.name AS Department, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employees INNER JOIN roles ON roles.id = employees.role_id INNER JOIN departments ON departments.id = roles.department_id LEFT JOIN employees e on employees.manager_id = e.id;`,
    (err, answer) => {
        if (err) throw err;
        console.table(answer);
        employeeTracker();
        });
}
function viewRoles() {
   connection.query(`SELECT employees.first_name AS FirstName, employees.last_name AS LastName, roles.title AS Role FROM employees JOIN roles ON employees.role_id = roles.id;`,
   (err, answer) => {
       if (err) throw err;
       console.table(answer);
       employeeTracker();
       });
}
function viewDepartments() {
   connection.query(`SELECT employees.first_name AS FirstName, employees.last_name AS LastName, departments.department AS Department FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id ORDER BY employees.id;`,
   (err, answer) => {
       if (err) throw err;
       console.table(answer);
       employeeTracker();
     });
}

// Update Roles //

function updateRole() {
   connection.query("SELECT * FROM employee", function(err, empData) {
       if (err) throw err;
   connection.query("SELECT * FROM role", function(err, roleData) {
       if (err) throw err;
           inquirer.prompt([
               {
                  name: "employeeName",
                  type: "list",
                  message: "who are you updating?",
                  choices: arrayEmployees
               },
               {
                  name: "employeeRole",
                  type: "list",
                  message: "What is their new role?",
                  choices: arrayRoles
               }
           ]).then (answers => {
               connection.query(
                  "UPDATE employee SET ? WHERE ?",
                  [
                     {
                        role_id: empData.find(function(data) {
                              return data.title === answers.employeeRole
                        })
                     },
                     {
                        id: roleData.find(function(data) {
                              return `${data.first_name} ${data.last_name}` === answers.employeeName
                        })
                     }
                  ],
                  function(err) {
                     if (err) throw err;
                     console.log("Employee role updated!");
                     employeeTracker();
                  }
               )
           })
       })
   })
}
