import routes from './routes/index.js';

const constructorMethod = (app) => {

    app.use('/', routes);
    app.use('*', (req, res) => {
      res.status(404).render('error');
    });
  };
  
  export default constructorMethod;
  
