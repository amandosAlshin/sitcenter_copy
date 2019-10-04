"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _bluebird = require("bluebird");

var _connectionScenterDB = _interopRequireDefault(require("../../services/connectionScenterDB"));

exports.truncateFacts =
/*#__PURE__*/
(0, _bluebird.coroutine)(
/*#__PURE__*/
_regenerator.default.mark(function _callee() {
  var trn;
  return _regenerator.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return _connectionScenterDB.default.query('truncate table facts');

        case 3:
          trn = _context.sent;
          return _context.abrupt("return", trn);

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log('error truncate facts ' + _context.t0);
          return _context.abrupt("return", false);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, null, [[0, 7]]);
}));
exports.truncateWindow =
/*#__PURE__*/
(0, _bluebird.coroutine)(
/*#__PURE__*/
_regenerator.default.mark(function _callee2() {
  var trn;
  return _regenerator.default.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return _connectionScenterDB.default.query('truncate table window_state');

        case 3:
          trn = _context2.sent;
          return _context2.abrupt("return", trn);

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          console.log('error truncate window_state  ' + _context2.t0);
          return _context2.abrupt("return", false);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2, null, [[0, 7]]);
}));