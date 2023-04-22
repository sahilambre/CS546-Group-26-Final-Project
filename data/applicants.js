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

const getAll = async () => {};

const get = async (applicantId) => {};

const remove = async (applicantId) => {};  

const update = async (
    applicantId,
    name,
    otherFields) => {};

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