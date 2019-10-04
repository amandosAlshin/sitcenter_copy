"use strict";

var path = require('path'); // import .env variables


require('dotenv-safe').load({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example')
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  scenterDB: {
    host: process.env.MYSQL_SCENTER_HOST,
    user: process.env.MYSQL_SCENTER_USER,
    password: process.env.MYSQL_SCENTER_PASSWORD,
    database: process.env.MYSQL_SCENTER_DB
  },
  nomadDB: process.env.NOMAD_DB_TYPE,
  postTimeFacts: process.env.SOAP_POST_TIME_FACTS,
  postTimeOperators: process.env.SOAP_POST_TIME_OPERATORS,
  mysqlNomad: {
    host: process.env.MYSQL_NOMAD_HOST,
    user: process.env.MYSQL_NOMAD_USER,
    password: process.env.MYSQL_NOMAD_PASSWORD,
    database: process.env.MYSQL_NOMAD_DB
  },
  mssqlNomad: {
    server: process.env.MSSQL_NOMAD_HOST,
    user: process.env.MSSQL_NOMAD_USER,
    password: process.env.MSSQL_NOMAD_PASSWORD,
    database: process.env.MSSQL_NOMAD_DB,
    port: parseInt(process.env.MSSQL_NOMAD_PORT, 10)
  },
  soap: {
    getAllTickets: process.env.SOAP_GET_ALL_TICKETS,
    branchIdWindowList: process.env.SOAP_BRANCH_ID_WINDOW_LIST,
    allOperatorList: process.env.SOAP_ALL_OPERATOR_LIST,
    eventConfirmation: process.env.EVENT_CONFIRMATION,
    port: process.env.SOAP_PORT,
    url: process.env.SOAP_URL
  },
  serverStateSend: process.env.SEND_INFO_SERVER_STATUS,
  sendInfoTime: process.env.SEND_INFO_SERVER_TIME,
  smtpEmail: {
    fromSendemail: process.env.FROM_SEND_EMAIL,
    hostSend: process.env.HOST_SEND,
    portSend: process.env.PORT_SEND,
    authUserSend: process.env.AUTH_USER_SEND,
    authPassSend: process.env.AUTH_USER_PASSWORD_SEND
  },
  notificationServerStatus: process.env.NOTIFICATION_SERVER_STATUS,
  notificationInservice: process.env.NOTIFICATION_TICKET_INSERVICE,
  notificationInserviceTime: process.env.NOTIFICATION_TICKET_INSERVICE_TIME,
  notificationWaiting: process.env.NOTIFICATION_TICKET_WAITING,
  notificationWaitingTime: process.env.NOTIFICATION_TICKET_WAITING_TIME,
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
};