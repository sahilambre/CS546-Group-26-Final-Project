import {dbConnection, closeConnection} from './config/mongoConnection.js';
import jobData from './data/jobs.js';
import recruiterData from './data/recruiters.js';
import applicantData from './data/applicants.js';
import {createUser} from './data/users.js';
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
let rec1 = undefined;
let rec2 = undefined;
let rec3 = undefined;
//next to test the create recruiter function
try {
  console.log('Testing Recruiter Creation');
  let user1 = await createUser('jsmith@google.com', 'JSmith123!');
  if(user1.insertedUser === true ){
    let recOut = await recruiterData.createRecruiter('John', 'Smith', 'jsmith@google.com', 'Google', []);
    rec1 = recOut.rec; 
    console.log('added rec1:'+JSON.stringify(rec1));
  }
  let user2 = await createUser('mjones@nokia.com', 'MJones123!');
  if(user2.insertedUser === true ){
    let recOut = await recruiterData.createRecruiter('Mary', 'Jones', 'mjones@nokia.com', 'Nokia', []); 
    rec2 = recOut.rec;
    console.log('added rec2:'+JSON.stringify(rec2));
  }
  let user3 = await createUser('badams@amazon.com', 'BAdams123!');
  if (user3.insertedUser === true) {
    let recOut = await recruiterData.createRecruiter('Bruce', 'Adams', 'badams@amazon.com', 'Amazon', []); 
    rec3 = recOut.rec;
    console.log('added rec3:'+JSON.stringify(rec3));
  }
} catch(e) {
  console.error('Could not add recruiters:',e);
}

//defining these here so i cn use them later
let job1 = undefined;
let job2 = undefined;
let job3 = undefined;
let job4 = undefined;

//next to test the create job function
try {
  console.log('Testing Job Creation');
  job1 = await jobData.create('software dev job 1', 'Nokia', 'https://www.nokia.com', ['computer science', 'cyber security'], rec2._id);
  console.log('added job1:'+JSON.stringify(job1));
  job2 = await jobData.create('software dev job 2', 'Google', 'https://www.google.com', ['computer science', 'artificial intelligence'], rec1._id);
  console.log('added job2:'+JSON.stringify(job2));
  job3 = await jobData.create('software dev job 3', 'Google', 'https://www.google.com', ['computer science', 'software development'], rec1._id);
  console.log('added job3:'+JSON.stringify(job3));
  job4 = await jobData.create('software dev job 4', 'Amazon', 'https://www.amazon.com', ['data science', 'software development'], rec3._id);
  console.log('added job3:'+JSON.stringify(job3));
} catch(e) {
  console.error('Could not add jobs:',e);
}

//defining these here so i cn use them later
let appl1 = undefined;
let appl2 = undefined;
//next to test the create applicant function
try {
  console.log('Testing Applicant Creation');
  let user1 = await createUser('rmartin@gmail.com', 'RMartin123!');
  if(user1.insertedUser === true ){
    let applicantOut = await applicantData.createApplicant('Robert', 'Martin', 'rmartin@gmail.com', 21, 'NJ', 2023);
    appl1 = applicantOut.applicant; 
    console.log('added appl1:'+JSON.stringify(appl1));
  }
  let user2 = await createUser('jwilliams@gmail.com', 'JWilliams123!1!');
  if(user2.insertedUser === true ){
    let applicantOut = await applicantData.createApplicant('Jane', 'Williams', 'jwilliams@gmail.com', 25, 'NY', 2019); 
    appl2 = applicantOut.applicant;
    console.log('added appl2:'+JSON.stringify(appl2));
  }
} catch(e) {
  console.error('Could not add applicants:',e);
}

let jobsApplied1 = undefined;
let jobsFavorited1 = undefined;
let findCSJobs = undefined;
let findRec1Jobs = undefined;
try {
  await applicantData.applyJob(appl1._id, job1._id);
  await applicantData.applyJob(appl1._id, job2._id);
  await applicantData.applyJob(appl2._id, job2._id);
  await applicantData.favoriteJob(appl1._id, job2._id);
  await applicantData.favoriteJob(appl2._id, job1._id);
  jobsApplied1 = await applicantData.getJobsApplied(appl1._id);
  console.log('appl1 jobsApplied1:'+JSON.stringify(jobsApplied1));
  jobsFavorited1 = await applicantData.getJobsFavorited(appl1._id);
  console.log('appl1 jobsFavorited1:'+JSON.stringify(jobsFavorited1));
  job1 = await jobData.getJob(job1._id);
  job2 = await jobData.getJob(job2._id);
  appl1 = await applicantData.get(appl1._id);
  appl2 = await applicantData.get(appl2._id);
  console.log('job1:'+JSON.stringify(job1));  
  console.log('job2:'+JSON.stringify(job2));  
  console.log('appl1:'+JSON.stringify(appl1));
  console.log('appl2:'+JSON.stringify(appl2));

  findCSJobs = await jobData.getJobsByTag('computer science');
  console.log('findCSJobs:'+JSON.stringify(findCSJobs));
  findRec1Jobs = await jobData.getJobsByRecruiterId(rec1._id);
  console.log('findRec1Jobs:'+JSON.stringify(findRec1Jobs));


} catch (e) {
  console.error('Could not apply jobs:',e);
}


// middleware added to all routes, at this point the routes aren't all coded in yet so not sure what to name all these redirects to yet lol
app.get('/', async (req, res, next) => {
    if(req.session.user){
        // needs to be redirected to job feed
        return res.redirect("/homepage");

     }
     else{
       return res.redirect("/login");
     }
    next();
  });

app.get('/login', async (req, res, next) => {
  /*
    if(req.session.user){
        return res.redirect("/homepage");
    }
    next();
    */

    console.log('at login:'+req.path);

    if (req.method == 'GET') {
        if (req.session.user) { // user is authenticated
          return res.redirect("/homepage");
        } else { // user is not authenticated so let it go through to the route
            next();
        }
    } else {
        next();
    }
    
}); 

app.get('/homepage', async (req, res, next) => {
  if (req.method == 'GET') {
    if (!req.session.user) { // user is not logged in
       return res.redirect('/login');
    } else { // user is logged in 
        next();
    }
  } else {
    next();
  }
});

app.get('/signup', async (req, res, next) => {
    if(req.session.user){
        return res.redirect("/homepage");
    }
    next();
});

app.get('/logout', async (req, res, next) => {
  
  if(req.method === "GET"){
        if(req.session.user){
            req.session.destroy();
            return res.redirect("/login");

        }else{
            req.method = 'GET';
            return res.redirect("/login");
        }
    }
    next();

});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});


//finally to close up shop,, get back to the terminal after doing what u need to do in the db
//await closeConnection();
console.log('Done!');