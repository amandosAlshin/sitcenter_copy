"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _connectionScenterDB = _interopRequireDefault(require("../../services/connectionScenterDB"));

var _nomadSoap = require("../../services/nomadSoap");

var _vars = require("../../config/vars");

var _additionalFunction = require("../../services/additionalFunction");

var currentDate = new Date();

exports.operators = function (servers) {
  servers.forEach(function (val) {
    var soapGet = new _nomadSoap.NomadSoap(val.ip, _vars.soap.port, _vars.soap.url);
    soapGet.AllOperatorList(function (body) {
      body.forEach(function (value) {
        _connectionScenterDB.default.query('UPDATE employee_list SET ' + 'F_ID=' + value.operatorid + ', F_WORK_NAME="' + (0, _additionalFunction.htmlspecialchars)(value.workname) + '",' + 'F_DESCR="' + (0, _additionalFunction.htmlspecialchars)(value.description) + '", F_BRANCH_ID="' + (0, _additionalFunction.nulltozero)(val.F_ID) + '",' + 'startTime="' + value.starttime + '" ' + 'WHERE F_ID=' + value.operatorid + ' and F_BRANCH_ID="' + (0, _additionalFunction.nulltozero)(val.F_ID) + '" and id<>0', function (err, result) {
          if (err) {
            console.log('Error when updating all operators => ' + err);
          } else {
            if (result.affectedRows == 0) {
              _connectionScenterDB.default.query('INSERT INTO employee_list SET ' + 'F_ID=' + value.operatorid + ', ' + 'F_WORK_NAME="' + (0, _additionalFunction.htmlspecialchars)(value.workname) + '", ' + 'F_DESCR="' + (0, _additionalFunction.htmlspecialchars)(value.description) + '", ' + 'startTime="' + value.starttime + '", ' + 'F_BRANCH_ID="' + (0, _additionalFunction.nulltozero)(val.F_ID) + '"', function (err, result) {
                if (err) {
                  console.log(currentDate + ' Error when inserting all operators => ' + err);
                } else {//console.log("Operator  --" + value.workname + "-- inserted to branch => " + val.F_ID);
                }
              });
            } else {//console.log("Operator updated");
            }
          }
        });
      });
    });
  });
};