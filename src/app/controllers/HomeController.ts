const HomeController = {
  index(request: any, response: any) {
    return response.render('home/index');
  },
};

export default HomeController;
