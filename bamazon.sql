
/* ***************homework****************** */

DROP DATABASE IF EXISTS bamazon_DB;
  create database bamazon_DB;

  use bamazon_DB;
  
  
create table products(
item_id INT NOT NULL AUTO_INCREMENT,
product_name varchar(50) NOT NULL,
department_name varchar(50) NOT NULL,
price decimal(10,4) NOT NULL,
stock_quantity INT(30) NOT NULL default 0,
product_sales INT(10) default 0,
PRIMARY KEY(item_id)
);



insert into products(product_name,department_name,price,stock_quantity)
values("camera","Electronic",900,2),("IPhoneX","Mobile Device",1200,10),("Jeans","Clothing",65,12),("Mouse","Accessories",52,3);


insert into products(product_name,department_name,price,stock_quantity)
values("oven","Home Appliance",1500,6),("Xbox","Game",450,2),("Barbie","Toy",120,11);

insert into products(product_name,department_name,price)
values("Bose","Headphones",349),("Printer","Electronic","135"),("Projector","Electronic","748");



select * from products


CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(30) NOT NULL,
    over_head_costs INTEGER(30) NOT NULL,
    PRIMARY KEY ( department_id)
);

SELECT * FROM departments


INSERT INTO departments (department_name, over_head_costs)
VALUES  ("Clothing", 4000),
        ("Clothing", 5000),
        ("Electronic", 6000),
        ("Electronic", 3000);
