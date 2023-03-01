create database mydatabase;
use mydatabase;
create table user(
   id int not null auto_increment,
   username varchar(20),
   email varchar(50),
   password varchar(255),
   primary key(id)
);
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456';
flush privileges;
select * from user;
delete from user;

create table contact(
   serial_no int not null auto_increment,
   name varchar(25),
   email varchar(35),
   subject varchar(55),
   message varchar(500),
   primary key(serial_no)
);

select * from contact;
