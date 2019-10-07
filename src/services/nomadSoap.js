import xml2js from 'xml2js'
import request from 'request'
import { soap } from '../config/vars';
exports.NomadSoap = (host, port, url)=>{
    var parser = new xml2js.Parser({
        trim: true,
        normalizeTags: true,
        normalize: true,
        stripPrefix: true,
        mergeAttrs: true
    }),
    serverUrl = 'http://'+ host + ':' + port + url,
    requests = {
        getAllTickets: soap.getAllTickets,
        BranchIdWindowList: soap.branchIdWindowList,
        AllOperatorList: soap.allOperatorList,
        EventConfirmation: soap.eventConfirmation
    };
    var getAllTickets = function(branchIp,server,callback) {
        var body = requests.getAllTickets;
        request.post(
            {
                url: serverUrl,
                body: body
            },
            function (error, response, body) {
                if (error) return callback('',server,false);
                else if(response.statusCode == 200) {
                    parser.parseString(body, function (err, result) {
                        if(err) console.log('Error getAllTickets tickets: ' + err);
                        else {
                            var temp = result['soapenv:envelope']['soapenv:body'][0]['cus:nomadallticketlist'][0]['xsd:complextype'][1]['xsd:element'];
                            if (temp) {
                                var allTickets = [];
                                var obj = {};
                                for (var i = 0; i < temp.length; i++) {
                                    obj = {};
                                    for (var prop in temp[i]) {
                                        if((temp[i].hasOwnProperty(prop)) && (prop !== 'type'))
                                            obj[prop.toLowerCase()] = temp[i][prop][0];
                                    }
                                    allTickets.push(obj);
                                }
                                return callback(branchIp,server,allTickets);
                            }
                            else {
                                return callback(branchIp,server,[]);
                            }
                        }
                    });
                }
                else {
                    return callback('',server,false);
                    console.log('getAllTickets Error: '+ response.statusCode);
                }
            });
    };
    var BranchIdWindowList = function(branchId, callback) {
        var body = requests.BranchIdWindowList;
        body = body.replace('$branchId', branchId);
        request.post(
            {
                url: serverUrl,
                body: body
            },
            function (error, response, body) {
                if (error) console.log('Error related to SOAP BranchIDWindowList: ' + error);
                else if(response.statusCode == 200) {

                    parser.parseString(body, function (err, result) {
                        if(err) console.log('Error BranchIdWindowList tickets : ' + err);
                        else {
                            var temp = result['soapenv:envelope']['soapenv:body'][0]['cus:nomadwindowlist'][0]['xsd:complextype'][1]['xsd:element'];
                            if (temp) {
                                var allTickets = [];
                                var obj = {};
                                for (var i = 0; i < temp.length; i++) {
                                    obj = {};
                                    for (var prop in temp[i]) {
                                        if((temp[i].hasOwnProperty(prop)) && (prop !== 'type'))
                                            obj[prop.toLowerCase()] = temp[i][prop][0];
                                    }
                                    allTickets.push(obj);
                                }
                                return callback(branchId,allTickets);
                            }
                            else {
                                return callback(branchId,[]);
                            }
                        }
                    });
                }
                else {
                    console.log('BranchIdWindowList Error: '+ response.statusCode);
                }
            });
    };
    var AllOperatorList = function(callback) {
        var body = requests.AllOperatorList;
        request.post(
            {
                url: serverUrl,
                body: body
            },
            function (error, response, body) {
                if (error) console.log('Error related to SOAP AllOperatorList '+serverUrl+' fff' + error);
                else if(response.statusCode == 200) {
                    parser.parseString(body, function (err, result) {
                        if(err) console.log('Error AllOperatorList tickets: ' + err);
                        else {
                          if(result){
                              var temp = result['soapenv:envelope']['soapenv:body'][0]['cus:nomadalloperatorlist'][0]['xsd:complextype'][1]['xsd:element'];
                              if (temp) {
                                  var AllOperators = [];
                                  var obj = {};
                                  for (var i = 0; i < temp.length; i++) {
                                      obj = {};
                                      for (var prop in temp[i]) {
                                          if((temp[i].hasOwnProperty(prop)) && (prop !== 'type'))
                                              obj[prop.toLowerCase()] = temp[i][prop][0];
                                      }
                                      AllOperators.push(obj);
                                  }
                                  return callback(AllOperators);
                              }
                              else {
                                  return callback([]);
                              }
                          }
                        }
                    });
                }
                else {
                    console.log('AllOperatorList Error: '+ response.statusCode);
                }
            });
    };
    var EventConfirmation = function(eventId, callback) {
        var body = requests.EventConfirmation;
        body = body.replace('$eventId', eventId);
        request.post(
            {
                url: serverUrl,
                body: body
            },
            function (error, response, body) {
                if (error){
                  console.log('related to SOAP EventConfirmation -'+port+'-fff' + error)
                }else {
                    return true;
                }
            });
    };
    return {
        getAllTickets:getAllTickets,
        BranchIdWindowList:BranchIdWindowList,
        AllOperatorList:AllOperatorList,
        EventConfirmation:EventConfirmation
    };
};
