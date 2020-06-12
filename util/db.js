// move all db functionality to here and expose functions as needed.

const getEmployeesDetailed = async (connection) => {
    const [employees] = await connection.execute(
        `with 
            managers as (select id, first_name, last_name from employee)
            select employee.id, employee.first_name, employee.last_name, role.title, role.salary,
            department.name, concat(managers.first_name, ' ', managers.last_name) as manager
            from employee
            join role on employee.role_id = role.id
            join department on role.department_id = department.id
            left join managers on employee.manager_id = managers.id`
    );
    return employees;
}

const getRoles = async (connection) => {
    // automatically destructure the result
    const [returnVal] = await connection.execute(`select r.id, r.title, d.name as department,
        r.salary from role as r, department as d where r.department_id = d.id;`);
    return returnVal;
}

const getDepartments = async (connection) => {
    const [returnVal] = await connection.execute(`select id, name from department;`);
    return returnVal;
}

const getEmployeesBasic = async (connection) => {
    const [employees] = await connection.execute(`select id, concat(first_name, ' ', last_name) as name from employee`);
    return employees;
}

const getManagers = async (connection) => {
    let managers = await getEmployeesBasic(connection);
    // create a none manager for employees without managers
    const noneManager = { id: null, name: "None" };

    // merge returned managers + the none option
    // call Array constructor because it might not be an array if only one
    return ([...managers, noneManager]);
}

const updateRole = async (connection, data) => {
    await connection.execute(`update employee  set role_id = ? where id = ?`, data);
}

module.exports.getDepartments = getDepartments;
module.exports.getRoles = getRoles;
module.exports.getEmployeesDetailed = getEmployeesDetailed;
module.exports.getEmployeesBasic = getEmployeesBasic;
module.exports.getManagers = getManagers;
module.exports.updateRole = updateRole;