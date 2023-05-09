import auth_routes from './auth_routes.js';

const constructorMethod = (app) => {

  app.use('/', auth_routes);
  app.use('*', (req, res) => {
    return res.status(404).render('error', {error: "Resource does not exist!"});
  });
};

export default constructorMethod;