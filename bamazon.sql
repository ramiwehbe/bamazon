use bamazon;
create table if not exists products(
	item_id int auto_increment,
    product_name char(255) not null,
    department_name char(255) not null,
    price decimal (10,3) not null,
    stock_quantity int not null,
    primary key (item_id)
    );
    
insert into products (product_name, department_name, price, stock_quantity)
values ("HP-Spectre", "Computers&Laptops", 1599, 200);
insert into products (product_name, department_name, price, stock_quantity)
values ("HP-Envy", "Computers&Laptops", 919, 300);
insert into products (product_name, department_name, price, stock_quantity)
values ("DELL-Inspiron", "Computers&Laptops", 926, 250);
insert into products (product_name, department_name, price, stock_quantity)
values ("HISENSE-43", "TV & HomeTheater", 270, 150);
insert into products (product_name, department_name, price, stock_quantity)
values ("SAMSUNG-40", "TV & HomeTheater", 330, 175);
insert into products (product_name, department_name, price, stock_quantity)
values ("TOSHIBA-55", "TV & HomeTheater", 450, 225);
insert into products (product_name, department_name, price, stock_quantity)
values ("SONY-65", "TV & HomeTheater", 1500, 275);
insert into products (product_name, department_name, price, stock_quantity)
values ("CANON-EOS-Rebel", "Cameras & Camcoders", 450, 125);
insert into products (product_name, department_name, price, stock_quantity)
values ("NIKON-D3400-DSLR", "Cameras & Camcoders", 600, 75);
insert into products (product_name, department_name, price, stock_quantity)
values ("NIKON-D5600-DSLR", "Cameras & Camcoders", 800, 325);


    
    
    
    
