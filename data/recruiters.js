<<<<<<< HEAD
import {validation} from 'validation.js';
import {recruiters} from '../config/mongoCollections.js';

=======
import {emailValidation} from '../helper.js';
import { recruiters } from '../config/mongoCollections.js';
>>>>>>> main
const create = async (
    firstName,
    lastName,
    email,
    company,
    jobListings) => {
<<<<<<< HEAD
=======
        //TODO
>>>>>>> main
        //note, might need to change params, recruiters may need different properties
        if(!firstName || !lastName || !email || !company || !jobListings){
            throw 'All fields are required';
        }
        if(typeof firstName !== 'string' || firstName.trim().length === 0){
            throw 'First name must be a non-empty string';
        }
        if(typeof lastName !== 'string' || lastName.trim().length === 0){
            throw 'Last name must be a non-empty string';
        }
        if(typeof email !== 'string' || email.trim().length === 0){
            throw 'Email must be a non-empty string';
        }
        if(typeof company !== 'string' || company.trim().length === 0){
            throw 'Company must be a non-empty string';
        }
<<<<<<< HEAD
        email = validation.checkEmail(email);
=======
        emailValidation(email);
>>>>>>> main
        const newRecruiter = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            company: company.trim(),
            jobListings: []
        };
        const recsCollection = await recruiters();
        const insertInfo = await recsCollection.insertOne(newRecruiter);
        if(insertInfo.insertedCount === 0) throw 'Could not add recruiter';
        const newId = insertInfo.insertedId.toString();
        const rec = await this.get(newId);
        return rec;

    };

const getAll = async () => {
    const recsCollection = await recruiters();
    let recList = await recsCollection.find({}).toArray();
    if (!recList) throw 'Could not get recruiters';
    recList = recList.map((element) => {
        element._id = element._id.toString();
        return element;
    });
    return recList;
};

const get = async (recruiterId) => {
    if (!recruiterId) throw 'You must provide an id to search for';
    if (typeof recruiterId !== 'string') throw 'Id must be a string';
    if (recruiterId.trim().length === 0) throw 'Id must be a non-empty string';
    const recsCollection = await recruiters();
    const rec = await recsCollection.findOne({ _id: ObjectId(recruiterId) });
    if (rec === null) throw 'No recruiter with that id';
    rec._id = rec._id.toString();
    return rec;
};

const remove = async (recruiterId) => {
    if(!recruiterId){
        throw 'You must provide an id to search for';
    }
    if(typeof recruiterId !== 'string'){
        throw 'Id must be a string';
    }
    if(recruiterId.trim().length === 0){
        throw 'Id must be a non-empty string';
    }
    recruiterId = recruiterId.trim();
    const recsCollection = await recruiters();
    const deletionInfo = await recsCollection.findOneAndDelete({_id: ObjectId(recruiterId)});
    if(deletionInfo.lastErrorObject.n === 0){
        throw `Could not delete recruiter with id of ${recruiterId}`;
    }
    return `The ${deletionInfo.value.name} has been successfully deleted!`;
};  

const update = async (
    recruiterId,
    firstName,
    lastName,
    email,
    company) => {
<<<<<<< HEAD
=======
        //TODO
>>>>>>> main
        if(!recruitersId || !firstName || !lastName || !email || !company){
            throw 'All fields are required';
        }
        if(typeof firstName !== 'string' || firstName.trim().length === 0){
            throw 'First name must be a non-empty string';
        }
        if(typeof lastName !== 'string' || lastName.trim().length === 0){
            throw 'Last name must be a non-empty string';
        }
        if(typeof email !== 'string' || email.trim().length === 0){
            throw 'Email must be a non-empty string';
        }
<<<<<<< HEAD
        email = validation.checkEmail(email);
=======
        emailValidation(email);
>>>>>>> main
        if(typeof company !== 'string' || company.trim().length === 0){
            throw 'Company must be a non-empty string';
        }
        const recsCollection = await recruiters();
        const updatedRec = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            company: company.trim()
        };
        const updatedInfo = await recsCollection.updateOne({_id: ObjectId(recruiterId)}, {$set: updatedRec});
        if(updatedInfo.modifiedCount === 0){
            throw 'Could not update recruiter';
        }
        return await this.get(recruiterId);
    };

const exportedMethods = {
    create,
    getAll,
    get,
    remove,
    update,
};
export default exportedMethods;