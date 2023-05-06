import {applicants, jobs} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import validation from './validation.js';
import applicantData from '../data/applicants.js';

const create = async (
    title,
    company,
    website,
    tags,
    recruiterId
) => {
    //title
    if (!title) throw 'You must provide a title for your job listing';
    if (typeof title !== 'string') throw 'Job title must be a string';
    if (title.trim().length === 0)
        throw 'Job title cannot be an empty string or string with just spaces';
    title = title.trim();
    //company
    if (!company) throw 'You must provide a company name';
    if (typeof company !== 'string') throw 'Company name must be a string';
    if (company.trim().length === 0)
        throw 'Company name cannot be an empty string or string with just spaces';
    company = company.trim();
    //website***
    if (!website) throw 'You must provide a company website';
    if (typeof website !== 'string') throw 'Company website must be a string';
    if (website.trim().length === 0)
        throw 'Company website cannot be an empty string or string with just spaces';
    website = website.trim();
    //If website does not contain https://www. and end in a .com,
    //and have at least 5 characters in-between the https://www. and .com this method will throw.
    let index1 = website.indexOf('https://www.');
    let index2 = website.lastIndexOf('.com');
    if (!website.endsWith('.com') || index1 < 0 || index2 <= index1+16)
        throw 'Website must have https://www. and must end in .com with at least 5 characters in between';
    //tags
    if (!tags || !Array.isArray(tags)) throw 'You must provide an array of tags';
    if (tags.length === 0) throw 'You must supply at least one tag';
    for (let i in tags) {
        if (typeof tags[i] !== 'string' || tags[i].trim().length === 0) {
            throw 'One or more tags is not a string or is an empty string';
        }
        tags[i] = tags[i].trim();
    }
    //job listings also need to contain an array of applicant ids
    //should we include any other job properties?
    //maybe location, on-site vs remote, job type like full-time or internship, etc
    //some of those could be tags, so lets stick with the properties we have for now

    let newJob = {
        title: title,
        company: company,
        website: website,
        tags: tags,
        recruiterId: recruiterId,
        applicants: []
    };
    const jobCollection = await jobs();
    const insertInfo = await jobCollection.insertOne(newJob);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Unable to add job listing';
    
    const newId = insertInfo.insertedId.toString();
    const job = await getJob(newId);
    return job;
};

const getJob = async (id) => {
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'Id must be a string';
    if (id.trim().length === 0)
        throw 'Id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    //can be replaced with validation.checkId
    const jobCollection = await jobs();
    const jobW = await jobCollection.findOne({_id: new ObjectId(id)});
    if (jobW === null) throw 'No job listings with that id';
    jobW._id = jobW._id.toString();
    return jobW;
};

const getAllJobs = async() => {
    const jobsCollection = await jobs();
    let jobList = await jobsCollection.find({}).toArray();
    if (!jobList) throw 'Could not get all jobs';
    jobList = jobList.map((element) => {
        element._id = element._id.toString();
        return element;
    });
    return jobList;
};

const remove = async(id) => {
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'Id must be a string';
    if (id.trim().length === 0)
        throw 'id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    const jobCollection = await jobs();
    const deletionInfo = await jobCollection.findOneAndDelete({
        _id: new ObjectId(id)
    });
    if (deletionInfo.lastErrorObject.n === 0)
        throw `Could not delete post with id of ${id}`;
    return {deleted: true};
};

const getJobsByRecruiterId = async(recruiterId) => {
    recruiterId = validation.checkId(recruiterId);
    const jobsCollection = await jobs();
    return await jobsCollection.find({recruiterId: recruiterId}).toArray();
    /*^^this line
    reminded me that the job object needs to include
    the id of the recruiter who posted it
    */
};//allows recruiters to see all jobs that they have posted

const getJobsByTag = async(tag) => {
    //allows applicants to search jobs by tag
    tag = validation.checkString(tag, 'Tag');
    const jobCollection = await jobs();
    return await jobCollection.find({tags: tag}).toArray();
    //search will work on a single tag that is contained in jobs' tags
};

const getJobApplicants = async(jobId) => {
    //returns applicants that have applied for this job
    /*
    get the job
    then, traverse the applicants array in the job object,
    and get applicants by those ids
    */
    let job = await getJob(jobId);
    const jobsCollection = await jobs();
    let applicantIdArray = job.applicants;
    let applicantsArray = [];

    for (let applicantId of applicantIdArray)
    {
        let applicant = await applicantData.get(applicantId);
        applicantsArray.push(applicant);
    }
    return applicantsArray;
};

const addJobApplicant = async(jobId, applicantId) => {
    //returns applicants that have applied for this job
    /*
    get the job
    add applicant id to applicants list
    update job
    */
    let job = await getJob(jobId);
    const jobsCollection = await jobs();
    let applicantIdArray = job.applicants;
    if (applicantIdArray.includes(applicantId)) throw 'Applicant already applied for job';
    applicantIdArray.push(applicantId);

    let updatedInfo = await jobsCollection.findOneAndUpdate(
        {_id: new ObjectId(jobId)},
        {$set: {applicants: applicantIdArray}},
        {returnDocument: 'after'}
    );
    if (updatedInfo.lastErrorObject.n === 0) {
        throw 'could not update job with new applicant successfully';
    }
    job = await getJob(jobId);
    return job;
};

const exportedMethods = {
    create,
    getJob,
    getAllJobs,
    remove,
    getJobsByRecruiterId,
    getJobsByTag,
    getJobApplicants,
    addJobApplicant
}
export default exportedMethods;