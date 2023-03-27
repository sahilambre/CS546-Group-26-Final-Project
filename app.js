import {dbConnection, closeConnection} from './config/mongoConnection.js';
import jobData from './data/jobs.js';

//lets drop the database each time this is run
const db = await dbConnection();
await db.dropDatabase();

//defining these here so i cn use them later
let job1 = undefined;

//next to test the create function
try {
    job1 = await jobData.create('software dev', 'Nokia', 'https://www.nokia.com', ['computer science', 'cyber security']);
} catch(e) {
    console.error('Could not add job1:',e);
}

//finally to close up shop,, get back to the terminal after doing what u need to do in the db
await closeConnection();
console.log('Done!');