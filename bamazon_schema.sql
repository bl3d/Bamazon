CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products(
	item_id INTEGER(10) AUTO_INCREMENT NOT NULL, 
	product_name  VARCHAR(100) NULL, 
    department_name VARCHAR(100) NULL, 
    price DECIMAL(10,2) DEFAULT '0.00', 
    stock_quantity INTEGER(100) DEFAULT 0,
    PRIMARY KEY (item_id)
);
