"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _bluebird = require("bluebird");

var _axios = _interopRequireDefault(require("axios"));

var _vars = require("../config/vars");

var _xml2js = _interopRequireDefault(require("xml2js"));

exports.branchIdWindowList =
/*#__PURE__*/
function () {
  var _ref = (0, _bluebird.coroutine)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(branch_host, branchId) {
    var branchIdWindowList, url, parser, response, tickets;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            branchIdWindowList = _vars.soap.branchIdWindowList.replace('$branchId', branchId);
            return _context.abrupt("return", branchIdWindowList);

          case 6:
            response = _context.sent;

            if (!response) {
              _context.next = 14;
              break;
            }

            _context.next = 10;
            return parser.parseString(response.data, function (err, result) {
              if (err) {
                return false;
              } else {
                return result;
              }
            });

          case 10:
            tickets = _context.sent;
            console.log('tickets', tickets);
            _context.next = 15;
            break;

          case 14:
            return _context.abrupt("return", false);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();