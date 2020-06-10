require('dotenv').config();
require('console.table');

const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const questions = require('./util/questions');

async function main() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 3306
    });

    const { action } = await inquirer.prompt(questions.startingQuestion());

    if (action === "View all employees") {
        const [results] = await connection.execute(`with 
	    managers as (select id, first_name, last_name from employee where manager_id is null)
        select employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, concat(managers.first_name, ' ', managers.last_name) as manager
        from employee
        join role on employee.role_id = role.id
        join department on role.department_id = department.id
        left join managers on employee.manager_id = managers.id`);
        console.table(results);
    } else if (action === 'View all departments') {
        const [results] = await connection.execute(`select id, name from department;`);
        console.table(results);
    } else if (action === 'View all roles') {
        const [results] = await connection.execute(`select r.id, r.title, d.name as department, r.salary from role as r, department as d where r.department_id = d.id;`);
        console.table(results);
    } else if (action === 'Add a department') {
        const { department } = await inquirer.prompt(questions.getDepartmentData());
        const [results] = await connection.execute(`insert into department (name) values (?);`, [department]);
    } else if (action === 'Add a role') {
        const [departments] = await connection.execute(`select id, name from department;`);
        console.log(departments);
        const choices = departments.map(department => department.name);
        
        const role = await inquirer.prompt(questions.getRoleData(choices));
        console.log(role);
        const roleArray = transformRole(role, departments);
        // role ok, change 
        // { role: 'HR Rep', salary: '34589', department: 'Human Resources' } => ['HR Rep', 34589, 4]
        // const [results] = await connection.execute(`insert into role (title, salary, department_id) values (?, ?, ?);`, roleArray);
    } else if (action === 'Add an employee') {
        // prompt user for employee data
        const [results] = await connection.execute(`insert into employee (first_name, last_name, role_id, manager_id) values ('Penis', 'Monster', 9, 4);`);
    }
}

main();

function transformRole(role, departments) {
    return [role.role, parseInt(role.salary), departments.filter(department => department.name === role.department )[0].id];
}
