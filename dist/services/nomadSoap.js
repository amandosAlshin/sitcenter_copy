"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _xml2js = _interopRequireDefault(require("xml2js"));

var _request = _interopRequireDefault(require("request"));

var _vars = require("../config/vars");

exports.NomadSoap = function (host, port, url) {
  var parser = new _xml2js.default.Parser({
    trim: true,
    normalizeTags: true,
    normalize: true,
    stripPrefix: true,
    mergeAttrs: true
  }),
      serverUrl = 'http://' + host + ':' + port + url,
      requests = {
    getAllTickets: _vars.soap.getAllTickets,
    BranchIdWindowList: _vars.soap.branchIdWindowList,
    AllOperatorList: _vars.soap.allOperatorList,
    EventConfirmation: _vars.soap.eventConfirmation
  };

  var getAllTickets = function getAllTickets(branchIp, server, callback) {
    var body = requests.getAllTickets;

    _request.default.post({
      url: serverUrl,
      body: body
    }, function (error, response, body) {
      if (error) return callback('', server, false);else if (response.statusCode == 200) {
        parser.parseString(body, function (err, result) {
          if (err) console.log('Error2: ' + err);else {
            var temp = result['soapenv:envelope']['soapenv:body'][0]['cus:nomadallticketlist'][0]['xsd:complextype'][1]['xsd:element'];

            if (temp) {
              var allTickets = [];
              var obj = {};

              for (var i = 0; i < temp.length; i++) {
                obj = {};

                for (var prop in temp[i]) {
                  if (temp[i].hasOwnProperty(prop) && prop !== 'type') obj[prop.toLowerCase()] = temp[i][prop][0];
                }

                allTickets.push(obj);
              }

              return callback(branchIp, server, allTickets);
            } else {
              return callback(branchIp, server, []);
            }
          }
        });
      } else {
        return callback('', server, false);
        console.log('getAllTickets Error: ' + response.statusCode);
      }
    });
  };

  var BranchIdWindowList = function BranchIdWindowList(branchId, callback) {
    var body = requests.BranchIdWindowList;
    body = body.replace('$branchId', branchId);

    _request.default.post({
      url: serverUrl,
      body: body
    }, function (error, response, body) {
      if (error) console.log('Error related to SOAP BranchIDWindowList: ' + error);else if (response.statusCode == 200) {
        parser.parseString(body, function (err, result) {
          if (err) console.log('Error2: ' + err);else {
            var temp = result['soapenv:envelope']['soapenv:body'][0]['cus:nomadwindowlist'][0]['xsd:complextype'][1]['xsd:element'];

            if (temp) {
              var allTickets = [];
              var obj = {};

              for (var i = 0; i < temp.length; i++) {
                obj = {};

                for (var prop in temp[i]) {
                  if (temp[i].hasOwnProperty(prop) && prop !== 'type') obj[prop.toLowerCase()] = temp[i][prop][0];
                }

                allTickets.push(obj);
              }

              return callback(branchId, allTickets);
            } else {
              return callback(branchId, []);
            }
          }
        });
      } else {
        console.log('BranchIdWindowList Error: ' + response.statusCode);
      }
    });
  };

  var AllOperatorList = function AllOperatorList(callback) {
    var body = requests.AllOperatorList;

    _request.default.post({
      url: serverUrl,
      body: body
    }, function (error, response, body) {
      if (error) console.log('Error related to SOAP AllOperatorList ' + error);else if (response.statusCode == 200) {
        parser.parseString(body, function (err, result) {
          if (err) console.log('Error2: ' + err);else {
            if (result) {
              var temp = result['soapenv:envelope']['soapenv:body'][0]['cus:nomadalloperatorlist'][0]['xsd:complextype'][1]['xsd:element'];

              if (temp) {
                var AllOperators = [];
                var obj = {};

                for (var i = 0; i < temp.length; i++) {
                  obj = {};

                  for (var prop in temp[i]) {
                    if (temp[i].hasOwnProperty(prop) && prop !== 'type') obj[prop.toLowerCase()] = temp[i][prop][0];
                  }

                  AllOperators.push(obj);
                }

                return callback(AllOperators);
              } else {
                return callback([]);
              }
            }
          }
        });
      } else {
        console.log('AllOperatorList Error: ' + response.statusCode);
      }
    });
  };

  var EventConfirmation = function EventConfirmation(eventId, callback) {
    var body = requests.EventConfirmation;
    body = body.replace('$eventId', eventId);

    _request.default.post({
      url: serverUrl,
      body: body
    }, function (error, response, body) {
      if (error) {
        console.log('related to SOAP EventConfirmation ' + error);
      } else {
        return true;
      }
    });
  };

  return {
    getAllTickets: getAllTickets,
    BranchIdWindowList: BranchIdWindowList,
    AllOperatorList: AllOperatorList,
    EventConfirmation: EventConfirmation
  };
};