"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _bluebird = require("bluebird");

var _vars = require("../../config/vars");

var _additionalFunction = require("../../services/additionalFunction");

var _mysql = _interopRequireDefault(require("mysql"));

var _connectionScenterDB = _interopRequireDefault(require("../../services/connectionScenterDB"));

var sql = require('mssql');

var util = require('util');

exports.servicesList =
/*#__PURE__*/
(0, _bluebird.coroutine)(
/*#__PURE__*/
_regenerator.default.mark(function _callee() {
  var pool, result, connect, data;
  return _regenerator.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(_vars.nomadDB === 'MSSQL')) {
            _context.next = 24;
            break;
          }

          _context.prev = 1;
          _context.next = 4;
          return sql.connect(_vars.mssqlNomad);

        case 4:
          pool = _context.sent;
          _context.next = 7;
          return pool.request().query('SELECT * FROM t_g_queue');

        case 7:
          result = _context.sent;

          if (!result.recordset) {
            _context.next = 13;
            break;
          }

          sql.close();
          return _context.abrupt("return", result.recordset);

        case 13:
          sql.close();
          return _context.abrupt("return", false);

        case 15:
          _context.next = 22;
          break;

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](1);
          sql.close();
          console.log('error connect mssql db nomad ' + _context.t0);
          return _context.abrupt("return", false);

        case 22:
          _context.next = 42;
          break;

        case 24:
          if (!(_vars.nomadDB === 'MYSQL')) {
            _context.next = 40;
            break;
          }

          _context.prev = 25;
          connect = _mysql.default.createConnection(_vars.mysqlNomad);
          connect.query = util.promisify(connect.query);
          _context.next = 30;
          return connect.query('SELECT * FROM t_g_queue');

        case 30:
          data = _context.sent;
          return _context.abrupt("return", data);

        case 34:
          _context.prev = 34;
          _context.t1 = _context["catch"](25);
          console.log('error connect mysql db nomad ' + _context.t1);
          return _context.abrupt("return", false);

        case 38:
          _context.next = 42;
          break;

        case 40:
          console.log('error type db not correctly');
          return _context.abrupt("return", false);

        case 42:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, null, [[1, 17], [25, 34]]);
}));

exports.serviceSave =
/*#__PURE__*/
function () {
  var _ref2 = (0, _bluebird.coroutine)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(data) {
    var update, insert;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _connectionScenterDB.default.query('UPDATE services_list SET ' + 'F_NAME="' + (0, _additionalFunction.htmlspecialchars)(data.F_WORK_NAME) + '", ' + 'F_QWAIT_TIME="' + data.F_QWAIT_TIME + '", ' + 'F_WORK_NAME="' + (0, _additionalFunction.htmlspecialchars)(data.F_WORK_NAME) + '", ' + 'F_QWAIT_TIME="' + (0, _additionalFunction.nulltozero)(data.F_QWAIT_TIME) + '", ' + 'F_F_2="' + data.F_F_2 + '", ' + 'F_ID_PARENT="' + (0, _additionalFunction.nulltozero)(data.F_ID_PARENT) + '", ' + 'F_MAX_SERV_TIME=' + (0, _additionalFunction.nulltozero)(data.F_MAX_SERV_TIME) + ' ' + 'WHERE F_ID=' + data.F_ID + ' ');

          case 2:
            update = _context2.sent;

            if (!(update && update.affectedRows === 0)) {
              _context2.next = 14;
              break;
            }

            _context2.next = 6;
            return _connectionScenterDB.default.query('INSERT INTO services_list SET ' + 'F_ID="' + data.F_ID + '", ' + 'F_NAME="' + (0, _additionalFunction.htmlspecialchars)(data.F_WORK_NAME) + '", ' + 'F_QWAIT_TIME="' + (0, _additionalFunction.nulltozero)(data.F_QWAIT_TIME) + '", ' + 'F_MAX_SERV_TIME="' + (0, _additionalFunction.nulltozero)(data.F_MAX_SERV_TIME) + '", ' + 'F_WORK_NAME="' + data.F_WORK_NAME + '", ' + 'F_F_2="' + data.F_F_2 + '", ' + 'F_ID_PARENT="' + (0, _additionalFunction.nulltozero)(data.F_ID_PARENT) + '" ');

          case 6:
            insert = _context2.sent;

            if (!insert) {
              _context2.next = 11;
              break;
            }

            return _context2.abrupt("return", true);

          case 11:
            return _context2.abrupt("return", false);

          case 12:
            _context2.next = 19;
            break;

          case 14:
            if (!(update && update.affectedRows > 0)) {
              _context2.next = 18;
              break;
            }

            return _context2.abrupt("return", true);

          case 18:
            return _context2.abrupt("return", false);

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();