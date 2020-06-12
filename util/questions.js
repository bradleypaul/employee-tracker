function startingQuestion() {
    return [
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role"
            ]
        }
    ];
}

function getDepartmentData() {
    return [
        {
            type: "input",
            name: "department",
            message: "Which department would you like to add?"
        }
    ]
}

function getRoleData(departments) {
    return [
        {
            type: "input",
            name: "role",
            message: "Which role would you like to add?"
        },
        {
            type: "input",
            name: "salary",
            message: (ans) => `What is the salary for a ${ans.role}?`
        },
        {
            type: "list",
            name: "department",
            message: (ans) => `To which department does ${ans.role} belong?`,
            choices: departments
        }
    ]
}

function getEmployeeData(roles, managers) {
    return [
        {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: (ans) => `What is ${ans.firstName}'s last name?`
        },
        {
            type: "list",
            name: "role",
            message: (ans) => `Which role does ${ans.firstName} ${ans.lastName} fill?`,
            choices: roles
        }, {
            type: "list",
            name: "manager",
            message: (ans) => `Who is ${ans.firstName} ${ans.lastName}'s manager?`,
            choices: managers
        }
    ]
}

function updateEmployee(employees, roles) {
    return [
        {
            type: "list",
            name: "name",
            message: "Which employee would you like to update?",
            choices: employees
        },
        {
            type: "list",
            name: "role",
            message: (ans) => `Which role does ${ans.employee} fill?`,
            choices: roles
        }
    ]
}

function done() {
    return [
        {
            type: 'list',
            name: 'continue',
            choices: [
                'yes',
                'no'
            ]
        }
    ]
}

module.exports.startingQuestion = startingQuestion;
module.exports.getDepartmentData = getDepartmentData;
module.exports.getRoleData = getRoleData;
module.exports.getEmployeeData = getEmployeeData;
module.exports.updateEmployee = updateEmployee;
module.exports.done = done;