"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _bluebird = require("bluebird");

var _axios = _interopRequireDefault(require("axios"));

var _vars = require("../config/vars");

var _xml2js = _interopRequireDefault(require("xml2js"));

exports.eventConfirmation =
/*#__PURE__*/
function () {
  var _ref = (0, _bluebird.coroutine)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(branch_host) {
    var eventConfirmation, url, parser, response, tickets;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            eventConfirmation = _vars.soap.eventConfirmation;
            url = 'http://' + branch_host + _vars.soap.port;
            parser = new _xml2js.default.Parser({
              trim: true,
              normalizeTags: true,
              normalize: true,
              stripPrefix: true,
              mergeAttrs: true,
              async: true
            });
            _context.next = 5;
            return (0, _axios.default)({
              method: 'post',
              url: url,
              data: eventConfirmation
            }).then(function (response) {
              return response;
            }).catch(function (error) {
              return false;
            });

          case 5:
            response = _context.sent;

            if (!response) {
              _context.next = 12;
              break;
            }

            _context.next = 9;
            return parser.parseString(response.data, function (err, result) {
              if (err) {
                return false;
              } else {
                return result;
              }
            });

          case 9:
            tickets = _context.sent;
            _context.next = 13;
            break;

          case 12:
            return _context.abrupt("return", false);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();