-- show info on employees
with 
	managers as (select id, first_name, last_name from employee where manager_id is null)
select employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, concat(managers.first_name, ' ', managers.last_name) as manager
from employee
join role on employee.role_id = role.id
join department on role.department_id = department.id
left join managers on employee.manager_id = managers.id;

-- show info on roles
select r.id, r.title, d.name as department, r.salary from role as r, department as d where r.department_id = d.id;

-- show info on departments
select id, name from department;