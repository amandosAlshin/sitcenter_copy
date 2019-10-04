"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _bluebird = require("bluebird");

var _vars = require("../../config/vars");

var _additionalFunction = require("../../services/additionalFunction");

var _mysql = _interopRequireDefault(require("mysql"));

var _connectionScenterDB = _interopRequireDefault(require("../../services/connectionScenterDB"));

var _util = _interopRequireDefault(require("util"));

var sql = require('mssql');

exports.branchList =
/*#__PURE__*/
(0, _bluebird.coroutine)(
/*#__PURE__*/
_regenerator.default.mark(function _callee() {
  var pool, result, dbNomad, data;
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
          return pool.request().query('SELECT * FROM t_g_branch');

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
          dbNomad = _mysql.default.createConnection(_vars.mysqlNomad);
          dbNomad.query = _util.default.promisify(dbNomad.query);
          _context.next = 30;
          return dbNomad.query('SELECT * FROM t_g_branch');

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

exports.branchSave =
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
            return _connectionScenterDB.default.query('UPDATE branches SET ' + 'F_NAME="' + (0, _additionalFunction.htmlspecialchars)(data.F_NAME) + '", ' + 'F_IP_ADDRESS="' + data.F_IP_ADDRESS + '", ' + 'F_PARENT_ID="' + data.F_PARENT_ID + '" ' + 'WHERE F_ID=' + data.F_ID + ' ');

          case 2:
            update = _context2.sent;

            if (!(update && update.affectedRows === 0)) {
              _context2.next = 14;
              break;
            }

            _context2.next = 6;
            return _connectionScenterDB.default.query('INSERT INTO branches SET ' + 'F_ID="' + data.F_ID + '", ' + 'F_NAME="' + (0, _additionalFunction.htmlspecialchars)(data.F_NAME) + '", ' + 'F_PARENT_ID="' + data.F_PARENT_ID + '", ' + 'F_IP_ADDRESS="' + data.F_IP_ADDRESS + '" ');

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