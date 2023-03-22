import {dbConnection, closeConnection} from './config/mongoConnection.js';

//lets drop the database each time this is run
const db = await dbConnection();
await db.dropDatabase();

//defining these here so i cn use them later
let job1 = undefined;

//next to test the create function


//finally to close up shop,, get back to the terminal after doing what u need to do
await closeConnection();
console.log('Done!');