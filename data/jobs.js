import {jobs} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

const create = async (
    name,
    company,
    website,
    tags
) => {
    //name
    if (!name) throw 'You must provide a name for your job listing';
    if (typeof name !== 'string') throw 'Job name must be a string';
    if (name.trim().length === 0)
        throw 'Job name cannot be an empty string or string with just spaces';
    name = name.trim();
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
        throw 'Website must have http://www. and must end in .com with at least 5 characters in between';
    //tags
    if (!tags || !Array.isArray(tags)) throw 'You must provide an array of tags';
    if (tags.length === 0) throw 'You must supply at least one tag';
    for (let i in tags) {
        if (typeof tags[i] !== 'string' || tags[i].trim().length === 0) {
            throw 'One or more tags is not a string or is an empty string';
        }
        tags[i] = tags[i].trim();
    }

    let newJob = {
        name: name,
        company: company,
        website: website,
        tags: tags
    };
    const jobCollection = await jobs();
    const insertInfo = await jobCollection.insertOne(newJob);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Unable to add job listing';
    
    const newId = insertInfo.insertedId.toString();
    const job = await get(newId);
    return job;
};

const get = async (id) => {
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'Id must be a string';
    if (id.trim().length === 0)
        throw 'Id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
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

const getJobsByRecruiterId = async(recruiterId) => {
    const jobsCollection = await jobs();
    return await jobsCollection.find({recuiterId:recruiterId}).toArray();
};//allows recruiters to see all jobs that they have posted

//yet to implement getJobsApplied and getJobsByTag

const exportedMethods = {
    create,
    get,
    getAllJobs,
    getJobsByRecruiterId
}
export default exportedMethods;