"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const Session = {
  // eslint-disable-next-line consistent-return
  onlyUsers: (request, response, next) => {
    if (!request.session.userId) return response.redirect('/users/login');
    next();
  },
  // eslint-disable-next-line consistent-return
  isLoggedRedirectToUsers: (request, response, next) => {
    if (request.session.userId) return response.redirect('/');
    next();
  }
};
var _default = Session;
exports.default = _default;