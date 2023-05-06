// import auth_routes from './auth_routes.js';

// const constructorMethod = (app) => {

//   app.use('/', auth_routes);
//   app.use('*', (req, res) => {
//     return res.status(404).render('error');
//   });
// };

// export default constructorMethod;

import auth from "./auth_routes.js"

const constructorMethod = (app) => {
    app.use('/', auth)
    app.use('*', (req, res) => {
        return res.status(404).render("error", {title: "Error", message: "Resource not found!"})
    })
}

export default constructorMethod
