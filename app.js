// Requirements and global variables //
const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("console.table");

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
            exit();
            break;
         }
      }
   })
}



// Call //
employeeTracker();