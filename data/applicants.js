import {applicants} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

const create = async (
    firstName,
    lastName,
    email,
    age,
    state,
    gradYr
) => {
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
    /*in the name params, i want to add smth that keeps ppl from entering numbers in the string
    no one has numbers in their name
    unless ur like John Doe the fourth, in which case you can use roman numerals
    */
    //email

    //age
    if (!age) throw 'You must enter your age';
    if (typeof age !== 'number') throw 'Age must be a number';
    //also handle the NAN case
    //also probably restrict the age?? like if ur over 80 please retire

    //state

    //gradYr
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

const exportedMethods = {
    create,
    getAll,
    get,
    remove,
    update,
    applyJob
};
export default exportedMethods;