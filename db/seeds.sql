USE employeeTracker;

-- Create Departments --
INSERT INTO departments (department) VALUES ("Sales");
INSERT INTO departments (department) VALUES ("Engineering");
INSERT INTO departments (department) VALUES ("Finance");
INSERT INTO departments (department) VALUES ("Legal");

-- Create Management Roles --
INSERT INTO roles (title, salary, department_id) VALUES ("Head Salesperson", 110000, 1);
INSERT INTO roles (title, salary, department_id) VALUES ("Lead Engineer", 1500000, 2);
INSERT INTO roles (title, salary, department_id) VALUES ("Head Accountant", 140000, 3);
INSERT INTO roles (title, salary, department_id) VALUES ("Head of Legal", 200000, 4);

-- Create Heads of Departments --
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Sally", "Sample", 1, null);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Ed", "Example", 2, null);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Frank", "Fakename", 3, null);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Ted", "Tester", 4, null);