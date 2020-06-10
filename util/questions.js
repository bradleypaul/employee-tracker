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

module.exports.startingQuestion = startingQuestion;
module.exports.getDepartmentData = getDepartmentData;
module.exports.getRoleData = getRoleData;