// Requirements and global variables //
const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("console.table");

// mysql connection //
var connection = mysql.createConnection({
   host: "localhost",
   port: 3306,
   user: "root",
   password: "",
   database: "employeeTracker"
});

connection.connect((err) => {
   if (err) throw err;
   start();
});

function start(){
   inquirer.prompt({
      name: "options",
      type: "list",
      message: "What would you like to do?",
      choices: [
         "View all Departments",
         "View all Roles",
         "View all Employees",
         "Add a Department",
         "Add a Role",
         "Add an Employee",
         "Update a Role",
         "Exit"
      ]
   }).then(function(answer){
      switch (answer.options) {
         case "Add an Employee":
            addEmployee();
            break;
         case "Add a Department":
            addDepartment();
            break;
         case "Add a Role": 
            addRole();
            break;
         case "View all Employees": 
            viewEmployees();
            break;
         case "View all Departments": 
            viewDepartments();
            break;
         case "View all Roles": 
            viewRoles();
            break;
         case "Update a Role": 
            updateRole();
            break;
         case "Exit":
            console.log("\n Have a nice day \n");
            connection.end();
            break;
      }
   })
}

function viewDepartments(){
   const query = "SELECT * FROM departments";
   connection.query(query, function(err, res){
      if(err) throw err;
      console.table(res);
      console.log(res)
      start();
   }) 
}

function viewRoles(){
   const query = "SELECT roles.id, roles.title, roles.salary, roles.department_id FROM roles LEFT JOIN departments ON roles.department_id = departments.department";
   connection.query(query, function(err, res){
      if(err) throw err;
      console.table(res);
      start();
   })
}

function viewEmployees(){
   const query = "SELECT * FROM employees";
   connection.query(query, function(err, res){
      if(err) throw err;
      console.table(res);
      start();
   })
}

function addDepartment(){
   inquirer.prompt({
      name: "newDepartment",
      type: "input",
      message: "What department would you like to add?"
   }).then(function(answer){
      const newDepartment = answer.newDepartment;
      var query = "INSERT INTO departments(department) VALUES (?)";
      connection.query(query, newDepartment, function(err, res){
         if(err) throw err;
         viewDepartments();
      })
   })
}

function addRole(){
  let arrayDepartments = function() {
      connection.query("SELECT * FROM departments",
      (err, answer) => {
          if (err) throw err;
          for (var i = 0; i < answer.length; i++) {
              arrayDepartments.push(answer[i].department);
              return arrayDepartments;
            }
      })
      console.log (arrayDepartments);
      return arrayDepartments;
      
   }
   inquirer.prompt([
      {
      name: "newRole",
      type: "input",
      message: "What role would you like to add?"
   },
   {
      name: "salary",
      type: "input",
      message: "What is the salary for the role?",
   },
   {
      name: "department",
      type: "list",
      message: "What department is this role in?",
      choices: arrayDepartments
   }
   ]).then(function(answer){
      const newRole = answer.newRole;
      var query = "INSERT INTO roles(department) VALUES (?)";
      connection.query(query, newRole, function(err, res){
         if(err) throw err;
         viewRoles();
      })
   })
}

function addEmployee(){

}

function updateRole(){
   //run a select all query
      //in the then section youll run inquirer for questgion
         //run an update query
}