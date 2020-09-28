// Requirements and global variables //
const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("console.table");

const arrayRoles = [];
const arrayManagers = [];
const arrayDepartments = [];

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
   start();
 });
 
// Functions //
employeeTracker = function() {
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
            console.log ("Have a nice day");
            break;
         }
      }
   })
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
         type: "string"
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
   connection.query( `SELECT role.title AS Title, role.salary AS Salary FROM role`, (err, results) => {
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
         "INSERT INTO role SET ?",
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
   connection.query( `SELECT * FROM employeeTracker.department`, (err, results) => {
        if (err) throw err;
   inquirer.prompt([
      {
         name: "newDepartment",
         message: "What is the name of the new department?",
         type: "input"
      }
   ]).then(function (answers) {
      connection.query(
         "INSERT INTO department SET ?",
         {
        name: annswer.newDepartmemt,
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
   connection.query(`SELECT employee.first_name AS FirstName, employee.last_name AS LastName, role.title AS Role, department.name AS Department, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id LEFT JOIN employee e on employee.manager_id = e.id;`,
    (err, answer) => {
        if (err) throw err;
        console.table(answer);
        employeeTracker();
        });
}
function viewRoles() {
   connection.query(`SELECT employee.first_name AS FirstName, employee.last_name AS LastName, role.title AS Role FROM employee JOIN role ON employee.role_id = role.id;`,
   (err, answer) => {
       if (err) throw err;
       console.table(answer);
       employeeTracker();
       });
}
function viewDepartments() {
   connection.query(`SELECT employee.first_name AS FirstName, employee.last_name AS LastName, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;`,
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
                     console.log("\n Employee role updated! \n");
                     start();
                  }
               )
           })
       })
   })
}

// Call //
employeeTracker();