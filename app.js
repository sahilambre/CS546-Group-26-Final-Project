//yea
//lets drop the database each time this is run
const db = await dbConnection();
await db.dropDatabase();

//defining these here so i cn use them later
let job1 = undefined;

//next to test the create function