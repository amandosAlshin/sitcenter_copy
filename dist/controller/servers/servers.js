"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _bluebird = require("bluebird");

var _connectionScenterDB = _interopRequireDefault(require("../../services/connectionScenterDB"));

exports.serverList =
/*#__PURE__*/
(0, _bluebird.coroutine)(
/*#__PURE__*/
_regenerator.default.mark(function _callee() {
  var servers;
  return _regenerator.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return _connectionScenterDB.default.query('SELECT distinct(F_IP_ADDRESS) as ip, F_ID, F_PARENT_ID, F_NAME, F_PARENT_ID FROM branches WHERE LOCATE(".",F_IP_ADDRESS) and F_PARENT_ID >0 GROUP BY ip');

        case 3:
          servers = _context.sent;
          return _context.abrupt("return", servers);

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log('error get server list ' + _context.t0);
          return _context.abrupt("return", false);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, null, [[0, 7]]);
}));