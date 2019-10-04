"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _bluebird = require("bluebird");

var _express = _interopRequireDefault(require("express"));

var _controller = require("./controller");

var _require = require('./config/vars'),
    port = _require.port,
    postTimeFacts = _require.postTimeFacts,
    postTimeOperators = _require.postTimeOperators;

var app = (0, _express.default)();

var cron = require('node-cron');

var servers = false;
var tickets_list = cron.schedule('*/' + postTimeFacts + ' * * * 1-6', function () {
  (0, _controller.tickets)(servers);
  (0, _controller.windows)(servers);
});
var operator_list = cron.schedule('*/' + postTimeOperators + ' * * * 1-6', function () {
  (0, _controller.operators)(servers);
});
(0, _bluebird.coroutine)(
/*#__PURE__*/
_regenerator.default.mark(function _callee() {
  var emptyDataNewDay, DataSynchronization;
  return _regenerator.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return (0, _controller.newday)();

        case 3:
          emptyDataNewDay = _context.sent;
          _context.next = 6;
          return (0, _controller.renew)();

        case 6:
          DataSynchronization = _context.sent;
          _context.next = 9;
          return (0, _controller.serverList)();

        case 9:
          servers = _context.sent;

          if (servers) {
            tickets_list.start();
            operator_list.start();
          } else {
            console.log('error get servers');
          }

          _context.next = 16;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, null, [[0, 13]]);
}))();
app.listen(port, function () {
  return console.log("Server is listinging on localhost: ".concat(port));
});