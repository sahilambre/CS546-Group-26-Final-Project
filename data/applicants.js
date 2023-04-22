import {applicants} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import validation from 'validation.js';

const create = async (
    firstName,
    lastName,
    email,
    age,
    state,
    gradYr
) => {
    //TODO: complete input validation
    //firstName
    if (!firstName) throw 'You must enter your name';
    if (typeof firstName !== 'string') throw 'Name must be a string';
    if (firstName.trim().length === 0)
        throw 'Name cannot be an empty string or string with just spaces';
    firstName = firstName.trim();
    //lastName
    if (!lastName) throw 'You must enter your Last name';
    if (typeof lastName !== 'string') throw 'Last name must be a string';
    if (lastName.trim().length === 0)
        throw 'Last name cannot be an empty string or string with just spaces';
    lastName = lastName.trim();

    //i want to use the helper functions to write this input validation

    /*in the name params, i want to add smth that keeps ppl from entering numbers in the string
    no one has numbers in their name
    unless ur like John Doe the fourth, in which case you can use roman numerals
    */   
    //email

    //age
    if (!age) throw 'You must enter your age';
    if (typeof age !== 'number' || age == NaN) throw 'Age must be a number';
    //also we gotta restrict the age, users must be 12 and up
    //also if ur over 80 please retire or smth
    if (age < 12 || age > 80) throw 'Invalid age';

    //state

    //gradYr

    let newApp = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        age: age,
        state: state,
        gradYr: gradYr
    };
    const applicantCollection = await applicants();
    const insertInfo = await applicantCollection.insertOne(newApp);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Unable to add user';

    const newId = insertInfo.insertedId.toString();
    const applicant = await get(newId);
    return applicant;
};

const getAll = async () => {
    const appsCollection = await applicants();
    let applicantList = await appsCollection.find({}).toArray();
    if (!applicantList) throw 'Could not get applicant(s)';
    applicantList = applicantList.map((element) => {
        element._id = element._id.toString();
        return element;
    });
    return applicantList;
};//we need to restrict the use of this function probably

const get = async (applicantId) => {
    applicantId = validation.checkId(applicantId);
    const applicantCollection = await applicants();
    const applicantW = await applicantCollection.findOne({_id: new ObjectId(id)});
    if (applicantW === null) throw 'No job listings with that id';
    applicantW._id = applicantW._id.toString();
    return applicantW;
};

const remove = async (applicantId) => {};  

const update = async (
    Id,
    firstName,
    lastName,
    email,
    age,
    state,
    gradYr
) => {
    Id = validation.checkId(Id);
    //TODO: more error handling
    let updatedApp = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        age: age,
        state: state,
        gradYr: gradYr
    };
    const appCollection = await applicants();
    const updateInfo = await appCollection.findOneAndUpdate(
        {_id: ObjectId(id)},
        {$set: updatedPost},
        {returnDocument: 'after'}
    );
    if (updateInfo.lastErrorObject.n === 0) throw 'Error: Update failed';
    return updateInfo.value;
};

const applyJob = async (
    applicantId,
    jobId) => {
    //ouch
};
/*when someone applies to a job, 2 things happen:
the applicant id gets added to the job object
and the job id gets added to the applicant object
*/

const favoriteJob = async (
    applicantId,
    jobId) => {
    //TODO
};
//users need to be able to filter jobs based on a favorites list

const exportedMethods = {
    create,
    getAll,
    get,
    remove,
    update,
    applyJob,
    favoriteJob
};
export default exportedMethods;