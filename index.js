require('dotenv').config();
require('console.table');

const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const questions = require('./util/questions');
const db = require('./util/db');

function getRoleId(role, roles) {
    return roles.filter(r => r.title === role)[0].id
}

function getEmployeeId(name, employees) {
    return employees.filter(employee => name === employee.name)[0].id;
}


function transformRole(role, departments) {
    return [
        role.role,
        parseInt(role.salary),
        departments.filter(department => department.name === role.department)[0].id
    ];
}

function transformEmployee(employee, roles, managers) {
    return [
        employee.firstName,
        employee.lastName,
        getRoleId(employee.role, roles),
        managers.filter(manager => manager.name === employee.manager)[0].id
    ];
}

(async function () {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 3306
    });

    let continueFlag = true;
    while (continueFlag) {
        const { action } = await inquirer.prompt(questions.startingQuestion());

        if (action === "View all employees") {
            const employees = await db.getEmployeesDetailed(connection);
            console.table(employees);
        } else if (action === 'View all departments') {
            const departments = await db.getDepartments(connection);
            console.table(departments);
        } else if (action === 'View all roles') {
            const results = await db.getRoles(connection);
            console.table(results);
        } else if (action === 'Add a department') {
            const { department } = await inquirer.prompt(questions.getDepartmentData());
            await connection.execute(`insert into department (name) values (?);`, [department]);
        } else if (action === 'Add a role') {
            const departments = await db.getDepartments(connection);
            const choices = departments.map(department => department.name);
            const role = await inquirer.prompt(questions.getRoleData(choices));
            const roleArray = transformRole(role, departments);
            await connection.execute(`insert into role (title, salary, department_id) values (?, ?, ?);`, roleArray);
        } else if (action === 'Add an employee') {
            const roles = await db.getRoles(connection);
            const roleChoices = roles.map(role => role.title);
            const managers = await db.getManagers(connection);
            const managerChoices = managers.map(manager => manager.name);
            const employee = await inquirer.prompt(questions.getEmployeeData(roleChoices, managerChoices));
            const employeeArray = transformEmployee(employee, roles, managers);
            await connection.execute(`insert into employee (first_name, last_name, role_id, manager_id) values (?, ?, ?, ?);`, employeeArray);
        } else if (action === "Update an employee role") {
            const employees = await db.getEmployeesBasic(connection);
            const employeeChoices = employees.map(employee => employee.name);
            const roles = await db.getRoles(connection);
            const roleChoices = roles.map(role => role.title);
            const ans = await inquirer.prompt(questions.updateEmployee(employeeChoices, roleChoices));

            const roleId = getRoleId(ans.role, roles);
            const employeeId = getEmployeeId(ans.name, employees);
            await db.updateRole(connection, [roleId, employeeId]);
        }

        continueFlag = (await inquirer.prompt(questions.done())).continue == "yes";
    }

    connection.end();
})();