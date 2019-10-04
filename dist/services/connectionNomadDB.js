"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mysql = _interopRequireDefault(require("mysql"));

var _vars = require("../config/vars");

var util = require('util');

console.log(_vars.mysqlNomad);

var dbNomad = _mysql.default.createConnection({
  host: _vars.mysqlNomad.host,
  user: _vars.mysqlNomad.user,
  password: _vars.mysqlNomad.password,
  database: _vars.mysqlNomad.database
}); // connect to database


dbNomad.connect(function (err) {
  console.log('err', err);

  if (err) {
    console.log('error mysqlNomad connect', err);
    return err;
  }

  console.log('mysqlNomad connected');
});
dbNomad.query = util.promisify(dbNomad.query);
var _default = dbNomad;
exports.default = _default;