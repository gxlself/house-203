/*
SQLyog Ultimate v12.09 (64 bit)
MySQL - 5.0.87-community-nt : Database - 203-chat
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`203-chat` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `203-chat`;

/*Table structure for table `m_token` */

DROP TABLE IF EXISTS `m_token`;

CREATE TABLE `m_token` (
  `token` varchar(43) NOT NULL,
  `a_token` char(200) NOT NULL,
  `username` char(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `m_token` */

insert  into `m_token`(`token`,`a_token`,`username`) values ('Q1X_l7RdjXUYmLXXLpWb48zT4MIQqzEtAfVO6LIPM3U','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imd4bHNlbGYiLCJpYXQiOjE1NzYxNTUxNDd9.Q1X_l7RdjXUYmLXXLpWb48zT4MIQqzEtAfVO6LIPM3U','gxlself');

/*Table structure for table `m_users` */

DROP TABLE IF EXISTS `m_users`;

CREATE TABLE `m_users` (
  `username` char(32) NOT NULL,
  `password` char(32) NOT NULL,
  `o_username` char(16) NOT NULL,
  `o_password` char(16) NOT NULL,
  `login_status` int(2) default '0',
  PRIMARY KEY  (`username`,`o_username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `m_users` */

insert  into `m_users`(`username`,`password`,`o_username`,`o_password`,`login_status`) values ('280d965a4a3395669c89131a930c7cec','0c80f8f94060f39b2685b54b0c470dc8','trfghrth','hrthrthr',1);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
