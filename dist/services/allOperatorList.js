"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _bluebird = require("bluebird");

var _vars = require("../config/vars");

var _axios = _interopRequireDefault(require("axios"));

var _xml2js = _interopRequireDefault(require("xml2js"));

exports.allOperatorList =
/*#__PURE__*/
function () {
  var _ref = (0, _bluebird.coroutine)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(branch_host) {
    var allOperatorList, url, parser, response, operators, temp, AllOperators, obj, i, prop;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            allOperatorList = _vars.soap.allOperatorList;
            url = 'http://' + branch_host + ':' + _vars.soap.port;
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
              data: allOperatorList
            }).then(function (response) {
              return response;
            }).catch(function (error) {
              return false;
            });

          case 5:
            response = _context.sent;

            if (!response) {
              _context.next = 22;
              break;
            }

            _context.next = 9;
            return parser.parseString(response.data);

          case 9:
            operators = _context.sent;
            console.log(operators);

            if (!operators) {
              _context.next = 19;
              break;
            }

            temp = operators['soapenv:envelope']['soapenv:body'][0]['cus:nomadalloperatorlist'][0]['xsd:complextype'][1]['xsd:element'];
            AllOperators = [];
            obj = {};

            for (i = 0; i < temp.length; i++) {
              obj = {};

              for (prop in temp[i]) {
                if (temp[i].hasOwnProperty(prop) && prop !== 'type') obj[prop.toLowerCase()] = temp[i][prop][0];
              }

              AllOperators.push(obj);
            }

            return _context.abrupt("return", AllOperators);

          case 19:
            return _context.abrupt("return", false);

          case 20:
            _context.next = 23;
            break;

          case 22:
            return _context.abrupt("return", false);

          case 23:
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