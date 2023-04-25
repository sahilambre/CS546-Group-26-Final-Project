import {dbConnection, closeConnection} from './config/mongoConnection.js';
import jobData from './data/jobs.js';
import express from 'express';
const app = express();
import configRoutes from './routes/index.js';


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const rewriteUnsupportedBrowserMethods = (req, res, next) => {
   if(req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }
    next();
};

app.use(rewriteUnsupportedBrowserMethods);
import session from 'express-session';
import exphbs from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + '/public');

const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
      asJSON: (obj, spacing) => {
        if (typeof spacing === 'number')
          return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));
  
        return new Handlebars.SafeString(JSON.stringify(obj));
      }
    }
  });

app.use('/public', staticDir);
app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');
app.use(session({
    name: 'AuthCookie',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: false
  }));



//lets drop the database each time this is run
const db = await dbConnection();
await db.dropDatabase();

//defining these here so i cn use them later
let job1 = undefined;

//next to test the create function
// try {
//     job1 = await jobData.create('software dev', 'Nokia', 'https://www.nokia.com', ['computer science', 'cyber security']);
// } catch(e) {
//     console.error('Could not add job1:',e);
// }

// middleware added to all routes, at this point the routes aren't all coded in yet so not sure what to name all these redirects to yet lol
app.get('/', async (req, res, next) => {
    if(req.session.user){
        return res.redirect("/homepage");
    }else{
        return res.redirect("/login");
    }
    next();
  });

app.get('/login', async (req, res, next) => {
    if(req.session.user){
        return res.redirect("/homepage");
    }
    next();
}); 

app.get('/signup', async (req, res, next) => {
    if(req.session.user){
        return res.redirect("/homepage");
    }
    next();
});

app.get('/logout', async (req, res, next) => {
        if(req.session.user){

        }else{
            req.method = 'GET';
            return res.redirect("/login");
        }
    next();
});





//finally to close up shop,, get back to the terminal after doing what u need to do in the db
await closeConnection();
console.log('Done!');