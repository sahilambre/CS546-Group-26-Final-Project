import {dbConnection} from './mongoConnection.js';



const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

// NOTE: YOU WILL NEED TO CHANGE THE CODE BELOW TO HAVE THe appropriate collection name or smth
export const jobs = getCollectionFn('jobs');
export const users = getCollectionFn("users");