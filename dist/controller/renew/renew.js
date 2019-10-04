"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _bluebird = require("bluebird");

var _branch_list = require("./branch_list");

var _service_list = require("./service_list");

var _role_list = require("./role_list");

exports.renew =
/*#__PURE__*/
(0, _bluebird.coroutine)(
/*#__PURE__*/
_regenerator.default.mark(function _callee() {
  var branchSynchronization, servicesSynchronization, rolesSynchronization, branchs, i, syncBranch, services, syncServices, roles, syncRoles;
  return _regenerator.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          branchSynchronization = [], servicesSynchronization = [], rolesSynchronization = [];
          _context.next = 3;
          return (0, _branch_list.branchList)();

        case 3:
          branchs = _context.sent;

          if (!branchs) {
            _context.next = 16;
            break;
          }

          i = 0;

        case 6:
          if (!(i < branchs.length)) {
            _context.next = 14;
            break;
          }

          _context.next = 9;
          return (0, _branch_list.branchSave)(branchs[i]);

        case 9:
          syncBranch = _context.sent;
          branchSynchronization.push({
            branch: branchs[i].F_NAME,
            statusSynchronization: syncBranch
          });

        case 11:
          i++;
          _context.next = 6;
          break;

        case 14:
          _context.next = 18;
          break;

        case 16:
          console.log('error get branch list;');
          return _context.abrupt("return", false);

        case 18:
          _context.next = 20;
          return (0, _service_list.servicesList)();

        case 20:
          services = _context.sent;

          if (!services) {
            _context.next = 33;
            break;
          }

          i = 0;

        case 23:
          if (!(i < services.length)) {
            _context.next = 31;
            break;
          }

          _context.next = 26;
          return (0, _service_list.serviceSave)(services[i]);

        case 26:
          syncServices = _context.sent;
          servicesSynchronization.push({
            services: services[i].F_WORK_NAME,
            statusSynchronization: syncServices
          });

        case 28:
          i++;
          _context.next = 23;
          break;

        case 31:
          _context.next = 35;
          break;

        case 33:
          console.log('error get services list;');
          return _context.abrupt("return", false);

        case 35:
          _context.next = 37;
          return (0, _role_list.roleList)();

        case 37:
          roles = _context.sent;

          if (!roles) {
            _context.next = 50;
            break;
          }

          i = 0;

        case 40:
          if (!(i < roles.length)) {
            _context.next = 48;
            break;
          }

          _context.next = 43;
          return (0, _role_list.roleSave)(roles[i]);

        case 43:
          syncRoles = _context.sent;
          rolesSynchronization.push({
            role: roles[i].F_NAME,
            statusSynchronization: syncRoles
          });

        case 45:
          i++;
          _context.next = 40;
          break;

        case 48:
          _context.next = 52;
          break;

        case 50:
          console.log('error get roles list;');
          return _context.abrupt("return", false);

        case 52:
          return _context.abrupt("return", true);

        case 53:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}));