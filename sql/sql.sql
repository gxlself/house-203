/*
SQLyog Professional v12.08 (64 bit)
MySQL - 5.0.96-community-nt : Database - 203-chat
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

/*Table structure for table `m_cache_chat` */

DROP TABLE IF EXISTS `m_cache_chat`;

CREATE TABLE `m_cache_chat` (
  `from_user` char(16) NOT NULL,
  `chat_content` longblob,
  `chat_type` char(20) default NULL,
  `group_id` int(6) default NULL,
  `timestamp` datetime default NULL,
  `chat_content_type` char(20) default NULL,
  `to_user` char(16) default NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `m_cache_chat` */

insert  into `m_cache_chat`(`from_user`,`chat_content`,`chat_type`,`group_id`,`timestamp`,`chat_content_type`,`to_user`) values ('gxlself','我的文档','groupChat',1,'2019-12-16 22:10:10','text',''),('gxlself','有傻逼了','groupChat',1,'2019-12-18 22:24:47','text',''),('gxlself','有内鬼  终止交易','groupChat',1,'2019-12-18 22:24:47','text',''),('test2','称一下','groupChat',1,'2020-01-05 11:56:08','text',''),('gxlself','测试','groupChat',1,'2020-01-05 11:56:54','text',''),('test2','额/::L /::L/::L/::L/::L/::L/::L/::L/::L/::L/::L ','groupChat',1,'2020-01-05 12:06:49','text',''),('test2','😂 ','groupChat',1,'2020-01-05 12:07:01','text','');

/*Table structure for table `m_group` */

DROP TABLE IF EXISTS `m_group`;

CREATE TABLE `m_group` (
  `username` char(48) default NULL,
  `avator` blob,
  `sex` int(1) default NULL,
  `group_id` int(6) default NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `m_group` */

insert  into `m_group`(`username`,`avator`,`sex`,`group_id`) values ('gxlself','�PNG\r\n\Z\n',1,1),('test1','�PNG\r\n\Z\n',0,1);

/*Table structure for table `m_token` */

DROP TABLE IF EXISTS `m_token`;

CREATE TABLE `m_token` (
  `token` varchar(43) NOT NULL,
  `a_token` char(200) NOT NULL,
  `username` char(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `m_token` */

insert  into `m_token`(`token`,`a_token`,`username`) values ('T2FSWTqmM8ZK2s4TLasrGEK658MQlcoVLc1tS6_OwRI','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imxpbmh1YWppZSIsImlhdCI6MTU3NjMzNDU5N30.T2FSWTqmM8ZK2s4TLasrGEK658MQlcoVLc1tS6_OwRI','linhuajie'),('1Fto5A37eW3C_haB6jw0qR3b5Qixdx2hbxjfNmTwyR4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QyIiwiaWF0IjoxNTc2MzM0NTk5fQ.1Fto5A37eW3C_haB6jw0qR3b5Qixdx2hbxjfNmTwyR4','test2'),('1Fzqae1Yo67Klpz2SuWqd-IbPO4CAMt6omsqMJkcFRU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imd4bHNlbGYiLCJpYXQiOjE1NzYzNzgyNjV9.1Fzqae1Yo67Klpz2SuWqd-IbPO4CAMt6omsqMJkcFRU','gxlself'),('-tp9MG7DfMqrzAsvtxzMmcIhab00VtD_ONFIk-86T68','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QxIiwiaWF0IjoxNTc4MTk3MzE3LCJleHAiOjE1NzgzNzAxMTd9.-tp9MG7DfMqrzAsvtxzMmcIhab00VtD_ONFIk-86T68','test1');

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

insert  into `m_users`(`username`,`password`,`o_username`,`o_password`,`login_status`) values ('5a105e8b9d40e1329780d62ea2265d8a','e10adc3949ba59abbe56e057f20f883e','test1','123456',1),('5c1338f06725fee21bfe6e43ef2a18e0','e10adc3949ba59abbe56e057f20f883e','gxlself','123456',1),('5f8ec14055e33fa2c310c4ffb13ed72e','5f8ec14055e33fa2c310c4ffb13ed72e','linhuajie','linhuajie',1),('ad0234829205b9033196ba818f7a872b','e10adc3949ba59abbe56e057f20f883e','test2','123456',1);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
