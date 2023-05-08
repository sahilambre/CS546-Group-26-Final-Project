import {applicants} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import validation from './validation.js';
import jobData from '../data/jobs.js';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path'


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
  });
  
const upload = multer({ storage });

export const createApplicant = async (
    firstName,
    lastName,
    email,
    birthDate,
    gradYr,
    resume
) => {
    firstName = validation.checkString(firstName, 'first name');
    lastName = validation.checkString(lastName, 'last name');
    resume = validation.checkString(resume, 'resume name')
    /*in the name params, i want to add smth that keeps ppl from entering ANY numbers in the string
    no one has numbers in their name
    unless ur like John Doe the fourth, in which case you can use roman numerals
    */   
    email = validation.checkEmail(email);

    //age
    if (!birthDate) throw 'You must enter your birth date';
    if (typeof birthDate !== 'string') throw 'Birth date is not a string';
    //we gotta restrict the age, users must be 14 and up
    //also if ur over 80 please retire or smth
    //if (age < 12 || age > 80) throw 'Invalid age';
    if(birthDate.length != 10) throw 'Invalid birth date format';
    if ( Math.floor((new Date() - Date.parse(birthDate))/(1000*60*60*24*365.25)) < 14) throw 'Must be at least 14 years old!'

    // state = validation.checkString(state, 'state');

    //gradYr
    if (!gradYr) throw 'You must enter your graduation year';
    if (typeof gradYr !== 'number' || gradYr == NaN) throw 'Graduation year must be a number';
    if (gradYr < 1950 || gradYr > new Date().getFullYear()+30) throw 'Invalid graduation year';



    let newApp = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        birthDate: birthDate,
        // state: state,
        gradYr: gradYr,
        jobsApplied: [],
        jobsFavorited: [],
        resume: resume
    };
    const applicantCollection = await applicants();
    const insertInfo = await applicantCollection.insertOne(newApp);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Unable to add user';

    const newId = insertInfo.insertedId.toString();
    const applicant = await get(newId);
    return {
        applicant: applicant,
        insertedApplicant: true
    };
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
    const applicantW = await applicantCollection.findOne({_id: new ObjectId(applicantId)});
    if (applicantW === null) throw 'No applicant listings with that id';
    applicantW._id = applicantW._id.toString();
    return applicantW;
};

// export const getApplicantResume = async (applicantId) => {
//     const applicant = await get(applicantId);
//     const resumePath = path.join('./uploads', applicant.resume);
//     try {
//       return await fs.readFile(resumePath, 'utf8');
//     } catch (err) {
//       console.log(err);
//       throw 'Error reading file';
//     }
//   };

export const getByEmailApplicant = async (applicantEmail) => {
   // applicantId = validation.checkId(applicantId);
    const applicantCollection = await applicants();
    const applicantW = await applicantCollection.findOne({email: applicantEmail});
    if (applicantW === null) throw 'No applicant listings with that id';
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
    id,
    firstName,
    lastName,
    email,
    birthDate,
    // state,
    gradYr,
    jobsApplied,
    jobsFavorited,
    resume
) => {
    id = validation.checkId(id);
    //TODO: more error handling
    let updatedApp = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        birthDate: birthDate,
        // state: state,
        gradYr: gradYr,
        jobsApplied: jobsApplied,
        jobsFavorited: jobsFavorited,
        resume: resume
    };
    const appCollection = await applicants();
    const updateInfo = await appCollection.findOneAndUpdate(
        {_id: new ObjectId(id)},
        {$set: updatedApp},
        {returnDocument: 'after'}
    );
    if (updateInfo.lastErrorObject.n === 0) throw 'Error: Update failed';
    return updateInfo.value;
};

const applyJob = async (
    applicantId,
    jobId) => {
    /*when someone applies to a job, 2 things happen:
    the applicant id gets added to the job object
    and the job id gets added to the applicant object
    */
    applicantId = validation.checkId(applicantId);
    let applicant = await get(applicantId); // will throw if not found
    let jobIdArray = applicant.jobsApplied;
    // should probably check that jobId is not already in the array
    if (jobIdArray.includes(jobId)) throw 'Error: applicant has already applied for this job';
    await jobData.addJobApplicant(jobId,applicantId);
    jobIdArray.push(jobId);
    return update(applicant._id.toString(), applicant.firstName, applicant.lastName, applicant.email, applicant.birthDate, applicant.gradYr, jobIdArray, applicant.jobsFavorited, applicant.resume);
};

const favoriteJob = async (
    applicantId,
    jobId) => {
    applicantId = validation.checkId(applicantId);
    let applicant = await get(applicantId); // will throw if not found
    let jobIdArray = applicant.jobsFavorited;
    let job = await jobData.getJob(jobId);
    //should probably check that jobId is not already in the array
    if (jobIdArray.includes(jobId)) throw 'Error: applicant has already favorited for this job';
    jobIdArray.push(jobId);
    update(applicant._id.toString(), applicant.firstName, applicant.lastName, applicant.email, applicant.birthDate, applicant.gradYr, applicant.jobsApplied, jobIdArray);
};
//users need to be able to filter jobs based on a favorites list

const unfavoriteJob = async (
    applicantId,
    jobId) => {
    applicantId = validation.checkId(applicantId);
    let applicant = await get(applicantId); // will throw if not found
    let jobIdArray = applicant.jobsFavorited;
    let job = await jobData.getJob(jobId);
    //gotta check that job id is already in the favorite jobs array
    let j_index = jobIdArray.indexOf(jobId);
    if (j_index<0) throw 'Error: applicant has not favorited this job';
    jobIdArray.splice(j_index, 1);
    update(applicant._id.toString(), applicant.firstName, applicant.lastName, applicant.email,
    applicant.birthDate, applicant.gradYr, applicant.jobsApplied, jobIdArray, applicant.resume);
};

const getJobsApplied = async(applicantId) => {
    //allows applicants to view jobs that they have applied to
    /*
    validate the applicant id
    await the jobs collection
    then, traverse the jobsApplied array in the applicant object,
    and get jobs by those ids
    */
    applicantId = validation.checkId(applicantId);
    let applicant = await get(applicantId); // will throw if not found
    let jobIdArray = applicant.jobsApplied;
    let jobsArray = [];
    //const jobsCollection = await jobs();
    for (let jobId of jobIdArray)
    {
        let job = await jobData.getJob(jobId);
        let index = job.applicants.indexOf(applicantId);
        if (index >= 0) // should always be true
            job.applicant_status = job.appl_status[index];
        jobsArray.push(job);
    }
    return jobsArray;   
};

const getJobsFavorited = async(applicantId) => {
    //allows applicants to view jobs that they have favorited
    /*
    validate the applicant id
    await the jobs collection
    then, traverse the jobsApplied array in the applicant object,
    and get jobs by those ids
    */
    applicantId = validation.checkId(applicantId);
    let applicant = await get(applicantId); // will throw if not found
    let jobIdArray = applicant.jobsFavorited;
    let jobsArray = [];
    //const jobsCollection = await jobData();
    for (let jobId of jobIdArray)
    {
        let job = await jobData.getJob(jobId);
        jobsArray.push(job);
    }
   return jobsArray;
};

const exportedMethods = {
    createApplicant,
    getAll,
    get,
    remove,
    update,
    getByEmailApplicant,
    applyJob,
    favoriteJob,
    unfavoriteJob,
    getJobsApplied,
    getJobsFavorited
};
export default exportedMethods;