"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _bluebird = require("bluebird");

var _copyday = require("./copyday");

var _emptyData = require("./emptyData");

var _connectionScenterDB = _interopRequireDefault(require("../../services/connectionScenterDB"));

exports.newday =
/*#__PURE__*/
function () {
  var _ref = (0, _bluebird.coroutine)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(servers) {
    var currentTime, day, now, facts, windows, inst;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            currentTime = new Date().toLocaleDateString();
            _context.next = 4;
            return (0, _copyday.daysList)();

          case 4:
            day = _context.sent;

            if (!day) {
              _context.next = 44;
              break;
            }

            if (!(day.length > 0)) {
              _context.next = 28;
              break;
            }

            now = day[0].copy_date;

            if (!(now === currentTime)) {
              _context.next = 12;
              break;
            }

            return _context.abrupt("return", true);

          case 12:
            _context.next = 14;
            return (0, _emptyData.truncateFacts)();

          case 14:
            facts = _context.sent;
            _context.next = 17;
            return (0, _emptyData.truncateWindow)();

          case 17:
            windows = _context.sent;

            if (!(facts && windows)) {
              _context.next = 25;
              break;
            }

            _context.next = 21;
            return (0, _copyday.insertDay)(currentTime);

          case 21:
            inst = _context.sent;
            return _context.abrupt("return", true);

          case 25:
            return _context.abrupt("return", false);

          case 26:
            _context.next = 42;
            break;

          case 28:
            _context.next = 30;
            return (0, _emptyData.truncateFacts)();

          case 30:
            facts = _context.sent;
            _context.next = 33;
            return (0, _emptyData.truncateWindow)();

          case 33:
            windows = _context.sent;

            if (!(facts && windows)) {
              _context.next = 41;
              break;
            }

            _context.next = 37;
            return (0, _copyday.insertDay)(currentTime);

          case 37:
            inst = _context.sent;
            return _context.abrupt("return", true);

          case 41:
            return _context.abrupt("return", false);

          case 42:
            _context.next = 45;
            break;

          case 44:
            return _context.abrupt("return", false);

          case 45:
            _context.next = 51;
            break;

          case 47:
            _context.prev = 47;
            _context.t0 = _context["catch"](0);
            console.log('error newday ' + _context.t0);
            return _context.abrupt("return", false);

          case 51:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 47]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();