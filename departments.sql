use bamazon;
drop table if exists departments;
create table if not exists departments(
	department_id int auto_increment,
    department_name varchar(255),
    over_head_costs decimal(10,3) default 0,
    primary key (department_id)
    );