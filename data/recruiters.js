const create = async (
    firstName,
    lastName,
    email,
    company,
    jobListings) => {
        //TODO
        //note, might need to change params, recruiters may need different properties
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

const get = async (recruiterId) => {};

const remove = async (recruiterId) => {};  

const update = async (
    recruiterId,
    name,
    otherFields) => {};

const exportedMethods = {
    create,
    getAll,
    get,
    remove,
    update,
};
export default exportedMethods;