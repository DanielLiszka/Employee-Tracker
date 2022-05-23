// import libaries
const mysql = require('mysql2')
const inquirer = require('inquirer'); 
const cTable = require('console.table'); 

require('dotenv').config()

// Database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.PASSWORD,
  database: 'employee_db'
});

// connects to mysql server and mysql database
connection.connect(function(err){
    if (err) return console.log(err);
    InquirerPrompt();
})

// user prompt
const InquirerPrompt = () => {
  inquirer.prompt ([
    {
      type: 'list',
      name: 'choices', 
      message: 'What would you like to do?',
      choices: ['Add department', 
                'Add role', 
                'Add employee', 
				'Update employee role',
				'View all departments', 
                'View all roles', 
                'View all employees', 
                'Exit']
    }
  ])
    .then((answers) => {
      const { choices } = answers; 

      if (choices === "Add employee") {
        addEmployee();
      }
	  
      if (choices === "Add department") {
        addDepartment();
      }

      if (choices === "Add role") {
        addRole();
      }
	  
      if (choices === "View all departments") {
        showDepartments();
      }

      if (choices === "View all roles") {
        showRoles();
      }

      if (choices === "View all employees") {
        showEmployees();	
      }
	  if (choices === "Update employee role") {
        updateEmployee();
      }
      if (choices === "Exit") {
        connection.end()
    };
  });
};

// Show All Departments
showDepartments = () => {
  console.log('Showing all departments!');
  const mysql = `SELECT department.id AS id, department.name AS department FROM department`; 

  connection.query(mysql, (err, rows) => {
    if (err) return console.log(err);
    console.table(rows);
    InquirerPrompt();
  });
};

// Show All Roles
showRoles = () => {
  console.log('Showing all roles!');

  const mysql = `SELECT role.id, role.title, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id`;
  
  connection.query(mysql, (err, rows) => {
    console.table(rows); 
    InquirerPrompt();
  })
};
// Add roles
addRole = () => {
  inquirer.prompt([
    {
      type: 'input', 
      name: 'role',
      message: "What role do you want to add?",
    },
    {
      type: 'input', 
      name: 'yearly_income',
      message: "What is the yearly_income?",
    }
  ])
    .then(answer => {
      const parameters = [answer.role, answer.yearly_income];
      const role_var = `SELECT name, id FROM department`; 

      connection.query(role_var, (err, data) => {
        if (err) return console.log(err); 
        const department_var = data.map(({ name, id }) => ({ name: name, value: id }));

        inquirer.prompt([
        {
          type: 'list', 
          name: 'department_var',
          message: "What department is this role in?",
          choices: department_var
        }
        ])
          .then(department_varChoice => {
            const department_var = department_varChoice.department_var;
            parameters.push(department_var);
            const mysql = `INSERT INTO role (title, yearly_income, department_id) VALUES (?, ?, ?)`;
			
            connection.query(mysql, parameters, (err, result) => {
              if (err) return console.log(err);
              console.log('Added' + answer.role + " to roles!"); 
              showRoles();
       });
     });
   });
 });
};

// Show All Employees
showEmployees = () => {
  console.log('Showing all employees!'); 
  const mysql = `SELECT employee.id,  employee.first_name,  employee.surname,  role.title,  department.name AS department, role.yearly_income,  CONCAT (manager.first_name, " ", manager.surname) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id`;

  connection.query(mysql, (err, rows) => {
    if (err) return console.log(err); 
    console.table(rows);
    InquirerPrompt();
  });
};

// Update Employees
updateEmployee = () => {
  const employeemysql = `SELECT * FROM employee`;

  connection.query(employeemysql, (err, data) => { 
 

  const employees = data.map(({ id, first_name, surname }) => ({ name: first_name + " "+ surname, value: id }));
  
    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: "Which employee would you like to update?",
        choices: employees
      }
    ])
      .then(employeeChoice => {
        const employee = employeeChoice.name;
        const parameters = []; 
        parameters.push(employee);

        const role_var = `SELECT * FROM role`;

        connection.query(role_var, (err, data) => {
          if (err) return console.log(err); 
          const roles = data.map(({ id, title }) => ({ name: title, value: id }));
          
            inquirer.prompt([
              {
                type: 'list',
                name: 'role',
                message: "What is the employee's new role?",
                choices: roles
              }
            ])
                .then(roleChoice => {
                const role = roleChoice.role;
                parameters.push(role); 
                let employee = parameters[0]
                parameters[0] = role
                parameters[1] = employee 

                const mysql = `UPDATE employee SET role_id = ? WHERE id = ?`;
				
                connection.query(mysql, parameters, (err, result) => {
					if (err) return console.log(err);
					console.log("Employee has been updated!");
              
                showEmployees();
          });
        });
      });
    });
  });
};

// Add Departments 
addDepartment = () => {
  inquirer.prompt([
    {
      type: 'input', 
      name: 'department',
      message: "What department do you want to add?",
    }
  ])
    .then(answer => {
      const mysql = `INSERT INTO department (name) VALUES (?)`;
      connection.query(mysql, answer.department, (err, result) => {
        if (err) return console.log(err);
        console.log('Added ' + answer.department + " to departments!"); 

        showDepartments();
    });
  });
};


// Add employees
addEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'fistName',
      message: "What is the employee's first name?",
    },
    {
      type: 'input',
      name: 'lastName',
      message: "What is the employee's last name?",
    }
  ])
    .then(answer => {
    const parameters = [answer.fistName, answer.lastName]
    const role_var = `SELECT role.id, role.title FROM role`;
  
    connection.query(role_var, (err, data) => {
      if (err) return console.log(err); 
      const roles = data.map(({ id, title }) => ({ name: title, value: id }));

      inquirer.prompt([
            {
              type: 'list',
              name: 'role',
              message: "What is the employee's role?",
              choices: roles
            }
          ])
            .then(roleChoice => {
              const role = roleChoice.role;
              parameters.push(role);

              const managermysql = `SELECT * FROM employee`;

              connection.query(managermysql, (err, data) => {
                if (err) return console.log(err);

                const managers = data.map(({ id, first_name, surname }) => ({ name: first_name + " "+ surname, value: id }));

                inquirer.prompt([
                  {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: managers
                  }
                ])
                  .then(managerChoice => {
                    const manager = managerChoice.manager;
                    parameters.push(manager);

                    const mysql = `INSERT INTO employee (first_name, surname, role_id, manager_id) VALUES (?, ?, ?, ?)`;

                    connection.query(mysql, parameters, (err, result) => {
                    if (err) return console.log(err);
                    console.log("Employee has been added!")

                    showEmployees();
              });
            });
          });
        });
     });
  });
};


