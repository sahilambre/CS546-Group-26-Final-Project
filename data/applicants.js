import {applicants} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

const create = async (
    name,
    otherFields) => {};

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