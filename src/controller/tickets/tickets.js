import db from '../../services/connectionScenterDB'
import {NomadSoap} from '../../services/nomadSoap'
import {soap,smtpEmail,serverStateSend,sendInfoTime,notificationInservice,notificationWaiting,notificationServerStatus,SendNotificationTicketToUser} from '../../config/vars';
import {htmlspecialchars,nulltozero,getRandom} from '../../services/additionalFunction'
import events from 'events';
var eventEmitter = new events.EventEmitter();
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8081 });
var moment = require('moment');
var serverState = [];
var _ = require('lodash'),
    app = require('express')(),
    mailer = require('nodemailer-promise');
wss.on('connection', function(ws){
    ws.on('message', function(message) {
     console.log('r : %s', message);
    });
    eventEmitter.on('noconnect', function(data){
      if (ws.readyState === 1) {
        ws.send(JSON.stringify({type: "noconnect", name: data.F_NAME,ip: data.ip}));
      }
    });
    eventEmitter.on('inservice', function(data){
      if (ws.readyState === 1){
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
    eventEmitter.on('waiting', function(data){
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
wss.on('close', function() {
  console.log('connection closed');
});
var sendEmail = mailer.config({
    port: smtpEmail.portSend,
    host: smtpEmail.hostSend,
    auth:{
      user: smtpEmail.authUserSend,
      pass: smtpEmail.authPassSend
    }
});

export const timeDifference =(date1,date2,moment=false)=>{
    date1 = parseInt(date1,10)/1000;
    var a = new Date(date1*1000);
    var b = false;
    if(moment){
      b = new Date(date2*1000);
    }else{
      date2 = parseInt(date2,10)/1000
      b = new Date(date2*1000);
    }
    var difference = Math.abs(a - b)/1000;
    return Math.round(Math.floor((difference/60)));
}
const filterService = (services,data)=>{
  if(data){
    var service = _.filter(services, function(o) {return parseInt(o.F_ID,10) === parseInt(data.idqueue,10)});
    if(service.length>0){
      return service[0];
    }else{
      return false;
    }
  }
}
const ticketTimeCheck=(ticket,server,service)=>{
  if(ticket.state === 'INSERVICE'){
    let age = timeDifference(ticket.startservtime, moment().unix(),true);
    if(age>service.F_MAX_SERV_TIME){
      ticket.branchName = server.F_NAME;
      eventEmitter.emit('inservice', ticket);
      return true;
    }
  }else if (ticket.state === 'NEW') {
    let age = timeDifference(ticket.starttime, moment().unix(),true);
    if(age>service.F_QWAIT_TIME){
      ticket.branchName = server.F_NAME;
      eventEmitter.emit('waiting', ticket);
      return true;
    }
  }else{
    return true;
  }
}

const StateSend=(id,server)=>{
  serverState.push(id);
  var count = _.countBy(serverState)[id];
  if(count>sendInfoTime){
    app.mailer.send('email', {
     to: 'daulet_777_00@mail.ru', // REQUIRED. This can be a comma delimited string just like a normal email to field.
     subject: 'Сервер не доступен ' + server.F_NAME + 'IP address ' + server.ip, // REQUIRED.
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
}
const filterBranch = (branchs,fid)=>{
    let branchsUser = [];
    _.filter(branchs, function(o) {
        if( parseInt(o,10) === parseInt(fid,10)){
            branchsUser.push(fid);
        }
    });
    if(branchsUser.length>0){
        return true;
    }else{
        return false;
    }

}
const checkUserBranch = (users,data)=>{
    return new Promise(function(resolve,reject){
        if(data){
          let usersSend = [];
          for(let i=0; i<=users.length-1;i++){
              if(filterBranch(users[i].id_branch.split(","),data.idbranch)){
                  usersSend.push(users[i]);
              }
          }
          resolve(usersSend);
        }
    })

}
const checkTicketSendStatus = (eventid)=>{
    return new Promise(function(resolve, reject){
        db.query('SELECT send_n FROM facts WHERE eventid="'+ eventid+'"', function (err, result) {
            if (err){
                console.log('Error when updating send_n status '+err);
                resolve(false);
            }else{
                if(result.length>0){
                    if (result[0].send_n === 1) {
                        resolve(false);
                    }else{
                        resolve(true);
                    }
                }else{
                    resolve(true);
                }
            }
        });
    });
}
const ticketSendStatus = (eventid)=>{
    return new Promise(function(resolve,reject){
        db.query('UPDATE `facts` SET '+
            'send_n = 1 WHERE eventid="'+eventid+'"', function (err, result) {
                if (err){
                    console.log('Error when updating facts state_n '+err);
                }
        });
    });
    return true;
}
const SendNotificationUserEmail=(server,email,ticket)=>{
    let subject = "";
    if(ticket.state === "INSERVICE"){
        subject = "Билет долго обслуживаеться";
    }else{
        subject = "Билет долго ожидает";
    }
    console.log(ticket);
    var message = {
        from: smtpEmail.fromSendemail,
        to: email,
        subject: subject,
        text: subject + ' \nОтделение: ' + server + '\nНомер билета: ' + ticket.ticketno + '\nУслуга: ' + ticket.servicename + '\nСотрудник: '  + ticket.operator, // REQUIRED.
    };
    sendEmail(message)
    .then(function(info){return true;})   // if successful
    .catch(function(err){console.log('got error'); console.log(err)});

}
const ticketUserCheck = (users,ticket,server,service)=>{
    if(ticket.state === 'INSERVICE'){
      let age = timeDifference(ticket.startservtime, moment().unix(),true);
      if(age>service.F_MAX_SERV_TIME){
        checkTicketSendStatus(ticket.eventid).then(function(send_n) {
            if(send_n){
               checkUserBranch(users,ticket).then(function(userList){
                   if(userList.length>0){
                       for(var s=0;s<=userList.length-1; s++){
                            SendNotificationUserEmail(server.F_NAME,userList[s].email,ticket);
                       }
                       ticketSendStatus(ticket.eventid);
                       return true;
                   }else{
                       return true;
                   }
               }).catch((err) => setImmediate(() => { throw err; }));

            }else{
                return true;
            }
        });
      }
    }else if (ticket.state === 'NEW') {
      let age = timeDifference(ticket.starttime, moment().unix(),true);
      if(age>service.F_QWAIT_TIME){
          checkTicketSendStatus(ticket.eventid).then(function(send_n) {
              if(send_n){
                 checkUserBranch(users,ticket).then(function(userList){
                     if(userList.length>0){
                         for(var s=0;s<=userList.length-1; s++){
                              SendNotificationUserEmail(server.F_NAME,userList[s].email,ticket);
                         }
                         ticketSendStatus(ticket.eventid);
                         return true;
                     }else{
                         return true;
                     }
                 }).catch((err) => setImmediate(() => { throw err; }));
              }else{
                  return true;
              }
          });
      }
    }else{
      return true;
    }
}
exports.tickets=(servers,services,users)=>{
      servers.forEach(function (val) {
      var soapGet = new NomadSoap(val.ip, soap.port, soap.url);
      soapGet.getAllTickets(val.ip,val,function(branchIp,server,body) {
          if(body){
              db.query('UPDATE branches SET ONN=1 where F_ID=' + server.F_ID, function (err, result) {
                  if (err){
                      logs.error('Error when updating server status');
                  }
              });
              body.forEach(function (value) {
                let service = false;
                if(services){
                    service = filterService(services,value);
                }
                if((notificationInservice==='true' || notificationWaiting==='true')){
                  if(service){
                    ticketTimeCheck(value,server,service);
                  }
                }
                if(SendNotificationTicketToUser === 'true'){
                    if(service){
                      ticketUserCheck(users,value,server,service);
                    }
                }
                if(value.state == 'COMPLETED'){
                  var soap2 = new NomadSoap(val.ip, soap.port, soap.url);
                  soap2.EventConfirmation(value.eventid, false);
                }
                db.query('UPDATE `facts` SET '+
                                'last = 0, time =  CURRENT_TIMESTAMP(),'+
                                'ticketno="' +value.ticketno+'", starttime="' +value.starttime+'",'+
                                'iin="' +value.iin+'",redirected="' +value.redirected+'",'+
                                'targetoperatorid="' +value.targetoperatorid+'",state="' +value.state+'",'+
                                'servover="' +value.servover+'",waitover="' +value.waitover+'",'+
                                'startservtime="' +value.startservtime+'",stopservtime="' +value.stopservtime+'",'+
                                'additionalstatus="' +value.additionalstatus+'",operator="' +value.operator+'",'+
                                'windownum="' +value.windownum+'",rolestring="' +value.rolestring+'",'+
                                'autocode="' +value.autocode+'",idoperator="' +value.idoperator+'",'+
                                'idqueue="' +value.idqueue+'",rating="' +value.rating+'",'+
                                'opinion="' +value.opinion+'",servicename="' +value.servicename+'",'+
                                'PreServOver="' +value.preservover+'",PreWaitOver="' +value.prewaitover+'"'+
                                'where eventid="' + value.eventid + '" and idbranch = "' +value.idbranch+'" ', function (err, result) {
                    if (err){
                        console.log('Error when updating facts '+value.eventid);
                    }else{
                        if (result.affectedRows == 0 || result.length==0) {
                          db.query('INSERT INTO `facts` SET '+
                            'last = 0, picnum = ' + getRandom() + ','+
                            'time =  CURRENT_TIMESTAMP(),servicename="' +value.servicename+'",'+
                            'ticketno="' +value.ticketno+'", starttime="' +value.starttime+'",'+
                            'eventid="' +value.eventid+'", idbranch="' +value.idbranch+'",'+
                            'iin="' +value.iin+'",redirected="' +value.redirected+'",'+
                            'targetoperatorid="' +value.targetoperatorid+'",state="' +value.state+'",'+
                            'servover="' +value.servover+'",waitover="' +value.waitover+'",'+
                            'startservtime="' +value.startservtime+'",stopservtime="' +value.stopservtime+'",'+
                            'additionalstatus="' +value.additionalstatus+'",operator="' +value.operator+'",'+
                            'windownum="' +value.windownum+'",rolestring="' +value.rolestring+'",'+
                            'autocode="' +value.autocode+'",idoperator="' +value.idoperator+'",'+
                            'idqueue="' +nulltozero(value.idqueue)+'",rating="' +value.rating+'",'+
                            'opinion="' +value.opinion+'",PreServOver="' +value.preservover+'",'+
                            'PreWaitOver="' +value.prewaitover+'"',function (err, result) {
                              if (err) {
                                  console.log('\n\t Error when inserting new tickets to table FACTS');
                              } else {
                                  //console.log("\n\t Inserting new ticket =-" + value.eventid + " ");
                              }
                          });
                        }else{
                          console.log("\n\t ticket Update  " + value.eventid);
                        }
                    }
                });
              });
          }else{
            db.query('UPDATE branches SET ONN=0 where F_ID=' + server.F_ID, function (err, result) {
                if (err){
                    logs.error('Error when updating server status');
                }
            });
            if(serverStateSend === 'true'){
                StateSend(server.F_ID,server);

            }
            if(notificationServerStatus === 'true'){
                eventEmitter.emit('noconnect', server);
            }

          }
      });
  });
}
