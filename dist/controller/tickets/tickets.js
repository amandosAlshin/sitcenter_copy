"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timeDifference = void 0;

var _connectionScenterDB = _interopRequireDefault(require("../../services/connectionScenterDB"));

var _nomadSoap = require("../../services/nomadSoap");

var _vars = require("../../config/vars");

var _additionalFunction = require("../../services/additionalFunction");

var _events = _interopRequireDefault(require("events"));

var eventEmitter = new _events.default.EventEmitter();

var WebSocketServer = require('ws').Server;

var wss = new WebSocketServer({
  port: 8081
});

var moment = require('moment');

var serverState = [];

var _ = require('lodash'),
    app = require('express')(),
    mailer = require('express-mailer');

wss.on('connection', function (ws) {
  ws.on('message', function (message) {
    console.log('r : %s', message);
  });
  eventEmitter.on('noconnect', function (data) {
    if (ws.readyState === 1) {
      ws.send(JSON.stringify({
        type: "noconnect",
        name: data.F_NAME,
        ip: data.ip
      }));
    }
  });
  eventEmitter.on('inservice', function (data) {
    if (ws.readyState === 1) {
      ws.send(JSON.stringify({
        type: 'inservice',
        ticketno: data.ticketno,
        branchID: data.idbranch,
        operator: data.operator,
        startservtime: data.startservtime,
        servicename: data.servicename,
        windownum: data.windownum,
        branchName: data.branchName
      }));
    }
  });
  eventEmitter.on('waiting', function (data) {
    if (ws.readyState === 1) {
      ws.send(JSON.stringify({
        type: 'waiting',
        ticketno: data.ticketno,
        branchID: data.idbranch,
        operator: data.operator,
        servicename: data.servicename,
        startservtime: data.startservtime,
        windownum: data.windownum,
        branchName: data.branchName
      }));
    }
  });
});
wss.on('close', function () {
  console.log('connection closed');
});
mailer.extend(app, {
  from: _vars.smtpEmail.fromSendemail,
  host: _vars.smtpEmail.hostSend,
  // hostname
  secureConnection: true,
  // use SSL
  port: _vars.smtpEmail.portSend,
  // port for secure SMTP
  transportMethod: 'SMTP',
  // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: _vars.smtpEmail.authUserSend,
    pass: _vars.smtpEmail.authPassSend
  }
});

var timeDifference = function timeDifference(date1, date2) {
  var moment = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  date1 = parseInt(date1, 10) / 1000;
  var a = new Date(date1 * 1000);
  var b = false;

  if (moment) {
    b = new Date(date2 * 1000);
  } else {
    date2 = parseInt(date2, 10) / 1000;
    b = new Date(date2 * 1000);
  }

  var difference = Math.abs(a - b) / 1000;
  return Math.round(Math.floor(difference / 60));
};

exports.timeDifference = timeDifference;

var ticketTimeCheck = function ticketTimeCheck(ticket, server) {
  if (ticket.state === 'INSERVICE') {
    var age = timeDifference(ticket.startservtime, moment().unix(), true);

    if (age > _vars.notificationInserviceTime) {
      ticket.branchName = server.F_NAME;
      eventEmitter.emit('inservice', ticket);
      return true;
    }
  } else if (ticket.state === 'NEW') {
    var _age = timeDifference(ticket.starttime, moment().unix(), true);

    if (_age > _vars.notificationWaitingTime) {
      ticket.branchName = server.F_NAME;
      eventEmitter.emit('waiting', ticket);
      return true;
    }
  } else {
    return true;
  }
};

var StateSend = function StateSend(id, server) {
  serverState.push(id);

  var count = _.countBy(serverState)[id];

  if (count > _vars.sendInfoTime) {
    app.mailer.send('email', {
      to: 'daulet_777_00@mail.ru',
      // REQUIRED. This can be a comma delimited string just like a normal email to field.
      subject: 'Сервер не доступен ' + server.F_NAME + 'IP address ' + server.ip,
      // REQUIRED.
      otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables.

    }, function (err) {
      if (err) {
        // handle error
        console.log(err);
        res.send('There was an error sending the email');
        return;
      }

      res.send('Email Sent');
    });
  }
};

exports.tickets = function (servers) {
  servers.forEach(function (val) {
    var soapGet = new _nomadSoap.NomadSoap(val.ip, _vars.soap.port, _vars.soap.url);
    soapGet.getAllTickets(val.ip, val, function (branchIp, server, body) {
      if (body) {
        _connectionScenterDB.default.query('UPDATE branches SET ONN=1 where F_ID=' + server.F_ID, function (err, result) {
          if (err) {
            logs.error('Error when updating server status');
          }
        });

        body.forEach(function (value) {
          if (_vars.notificationInservice === 'true' || _vars.notificationWaiting === 'true') {
            ticketTimeCheck(value, server);
          }

          if (value.state == 'COMPLETED') {
            var soap2 = new _nomadSoap.NomadSoap(branchIp, val.ip, _vars.soap.port, _vars.soap.url);
            soap2.EventConfirmation(value.eventid, false);
          }

          _connectionScenterDB.default.query('UPDATE `facts` SET ' + 'last = 0, time =  CURRENT_TIMESTAMP(),' + 'ticketno="' + value.ticketno + '", starttime="' + value.starttime + '",' + 'iin="' + value.iin + '",redirected="' + value.redirected + '",' + 'targetoperatorid="' + value.targetoperatorid + '",state="' + value.state + '",' + 'servover="' + value.servover + '",waitover="' + value.waitover + '",' + 'startservtime="' + value.startservtime + '",stopservtime="' + value.stopservtime + '",' + 'additionalstatus="' + value.additionalstatus + '",operator="' + value.operator + '",' + 'windownum="' + value.windownum + '",rolestring="' + value.rolestring + '",' + 'autocode="' + value.autocode + '",idoperator="' + value.idoperator + '",' + 'idqueue="' + value.idqueue + '",rating="' + value.rating + '",' + 'opinion="' + value.opinion + '",servicename="' + value.servicename + '",' + 'PreServOver="' + value.preservover + '",PreWaitOver="' + value.prewaitover + '"' + 'where eventid="' + value.eventid + '" and idbranch = "' + value.idbranch + '" ', function (err, result) {
            if (err) {
              console.log('Error when updating facts ' + value.eventid);
            } else {
              if (result.affectedRows == 0 || result.length == 0) {
                _connectionScenterDB.default.query('INSERT INTO `facts` SET ' + 'last = 0, picnum = ' + (0, _additionalFunction.getRandom)() + ',' + 'time =  CURRENT_TIMESTAMP(),servicename="' + value.servicename + '",' + 'ticketno="' + value.ticketno + '", starttime="' + value.starttime + '",' + 'eventid="' + value.eventid + '", idbranch="' + value.idbranch + '",' + 'iin="' + value.iin + '",redirected="' + value.redirected + '",' + 'targetoperatorid="' + value.targetoperatorid + '",state="' + value.state + '",' + 'servover="' + value.servover + '",waitover="' + value.waitover + '",' + 'startservtime="' + value.startservtime + '",stopservtime="' + value.stopservtime + '",' + 'additionalstatus="' + value.additionalstatus + '",operator="' + value.operator + '",' + 'windownum="' + value.windownum + '",rolestring="' + value.rolestring + '",' + 'autocode="' + value.autocode + '",idoperator="' + value.idoperator + '",' + 'idqueue="' + (0, _additionalFunction.nulltozero)(value.idqueue) + '",rating="' + value.rating + '",' + 'opinion="' + value.opinion + '",PreServOver="' + value.preservover + '",' + 'PreWaitOver="' + value.prewaitover + '"', function (err, result) {
                  if (err) {
                    console.log('\n\t Error when inserting new tickets to table FACTS');
                  } else {//console.log("\n\t Inserting new ticket =-" + value.eventid + " ");
                  }
                });
              } else {//console.log("\n\t ticket Update  " + value.eventid);
              }
            }
          });
        });
      } else {
        _connectionScenterDB.default.query('UPDATE branches SET ONN=0 where F_ID=' + server.F_ID, function (err, result) {
          if (err) {
            logs.error('Error when updating server status');
          }
        });

        if (_vars.serverStateSend === 'true') {
          StateSend(server.F_ID, server);
        }

        if (_vars.notificationServerStatus === 'true') {
          eventEmitter.emit('noconnect', server);
        }
      }
    });
  });
};