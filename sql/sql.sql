/*
SQLyog Ultimate v12.09 (64 bit)
MySQL - 5.0.87-community-nt 
*********************************************************************
*/
/*!40101 SET NAMES utf8 */;

create table `m_group` (
	`username` char (48),
	`avator` blob ,
	`sex` int (1),
	`group_id` int (6)
); 
insert into `m_group` (`username`, `avator`, `sex`, `group_id`) values('gxlself','‰PNG\r\n\Z\n','1','1');
insert into `m_group` (`username`, `avator`, `sex`, `group_id`) values('test1','‰PNG\r\n\Z\n','0','1');
