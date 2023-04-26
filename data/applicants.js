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
    firstName = validation.checkString(firstName, 'first name');
    lastName = validation.checkString(lastName, 'last name');
    /*in the name params, i want to add smth that keeps ppl from entering ANY numbers in the string
    no one has numbers in their name
    unless ur like John Doe the fourth, in which case you can use roman numerals
    */   
    email = validation.checkEmail(email);

    //age
    if (!age) throw 'You must enter your age';
    if (typeof age !== 'number' || age == NaN) throw 'Age must be a number';
    //we gotta restrict the age, users must be 12 and up
    //also if ur over 80 please retire or smth
    if (age < 12 || age > 80) throw 'Invalid age';

    state = validation.checkString(state, 'state');

    //gradYr
    if (!gradYr) throw 'You must enter your graduation year';
    if (typeof gradYr !== 'number' || gradYr == NaN) throw 'Graduation year must be a number';
    if (gradYr < 1950 || gradYr > 2030) throw 'Invalid graduation year';

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

const remove = async (applicantId) => {
    applicantId = validation.checkId(applicantId);
    const applicantCollection = await applicants();
    const deletionInfo = await applicantCollection.findOneAndDelete({
        _id: new ObjectId(id)
    });
    if (deletionInfo.lastErrorObject.n === 0)
        throw `Could not delete post with id of ${id}`;
    return {deleted: true};
};

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
        {$set: updatedApp},
        {returnDocument: 'after'}
    );
    if (updateInfo.lastErrorObject.n === 0) throw 'Error: Update failed';
    return updateInfo.value;
};

const applyJob = async (
    applicantId,
    jobId) => {
    //TODO
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