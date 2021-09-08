const Session = {
  // eslint-disable-next-line consistent-return
  onlyUsers: (request: any, response: any, next: any) => {
    if (!request.session.userId) return response.redirect('/users/login');

    next();
  },
  // eslint-disable-next-line consistent-return
  isLoggedRedirectToUsers: (request: any, response: any, next: any) => {
    if (request.session.userId) return response.redirect('/');

    next();
  },
};

export default Session;
