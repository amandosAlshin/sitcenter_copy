"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _connectionScenterDB = _interopRequireDefault(require("../../services/connectionScenterDB"));

var _nomadSoap = require("../../services/nomadSoap");

var _vars = require("../../config/vars");

exports.windows = function (servers) {
  servers.forEach(function (val) {
    var soapGet = new _nomadSoap.NomadSoap(val.ip, _vars.soap.port, _vars.soap.url);
    soapGet.BranchIdWindowList(val.F_ID, function (branchId, body) {
      if (body) {
        body.forEach(function (value) {
          _connectionScenterDB.default.query('UPDATE `window_state` SET ' + 'winno = ' + value.no + ', windowid =  "' + value.windowid + branchId + '",' + 'idoperator=' + value.operatorid + ', idbranch=' + branchId + ',' + 'worktitle="' + value.role + ' " ' + 'where windowid="' + value.windowid + branchId + ' " ', function (err, result) {
            if (err) {
              console.log('Error when updating window_state ' + value.eventid);
            } else {
              if (result.affectedRows == 0 || result.length == 0) {
                _connectionScenterDB.default.query('INSERT INTO `window_state` SET ' + 'winno = ' + value.no + ', windowid = ' + value.windowid + branchId + ',' + 'idoperator = ' + value.operatorid + ',idbranch=' + branchId + ',' + 'worktitle="' + value.role + '"', function (err, result) {
                  if (err) {
                    console.log('\n\t Error when inserting window to table window_state');
                  } else {//console.log("\n\t Inserting new window =-" + value.windowid + branchId + " ");
                  }
                });
              } else {//console.log("\n\t window Update  " + value.windowid + branchId);
              }
            }
          });
        });
      }
    });
  });
};