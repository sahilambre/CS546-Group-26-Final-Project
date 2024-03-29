import { users } from "../config/mongoCollections.js";
import { ObjectId } from 'mongodb';
import bcryptjs from 'bcryptjs';

function validID(id) {
  if (!id) { throw "id is not defined"; }
  if (id.constructor !== String) { throw "id must be a string"; }
  if (!ObjectId.isValid(id)) { throw "id is invalid"; }
}

function validUsername(username) {
  if (!username) { throw "username is not defined"; }
  if (username.constructor !== String) { throw "username must be a string"; }
  if (username.length < 6) { throw "username length must be at least 6 characters"; }
}

export function validPassword(password) {
  if (!password) { throw "password is not defined"; }
  if (password.constructor !== String) { throw "password must be a string"; }
  if (password.length < 8) { throw "password length must be at least 8 characters"; }
  if (password.length > 31) { throw "password length must not exceed 31 characters"; }
}

let saltRounds = 12;
export async function createUser(newEmail, newPassword) {
  validUsername(newEmail);
  validPassword(newPassword);

  const usersCollections = await users();
  const doesExist = await usersCollections.findOne({ email: newEmail });

  if (doesExist) {
    throw "This email already exists!";
  }

  let hashedPassword;
  try {
    hashedPassword = await bcryptjs.hash(newPassword, saltRounds);
  } catch (e) {
    throw "Error hashing password!";
  }

  let user = {
    email: newEmail,
    password: hashedPassword,
  };

  const newInfo = await usersCollections.insertOne(user);

  if (newInfo.insertedCount === 0) {
    throw "New user was not created!";
  }

  //return getUser(newInfo.insertedId.toString());
   return { insertedUser: true };
}

export async function checkUser(emailAddress, password) {
  if(!emailAddress || !password){
    throw "Email Address and password must be supplied";
  }
  let nEmailAddress = emailAddress.toLowerCase();
  if( !(/\S+@\S+\.\S+/.test(nEmailAddress)) ){
    throw "Email address is not valid.";
  }
  const passwordPattern = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$";
  const passwordReg = new RegExp(passwordPattern);
  if( !(passwordReg.test(password))){
    throw "There needs to be at least one uppercase character, there has to be at least one number and there has to be at least one special character"
  }

  const userCollections = await users();
  const user = await userCollections.findOne({ email: nEmailAddress });
  if (user === null) {
    throw "Either the email address or password is invalid ";
  }
  let compareToSherlock = await bcryptjs.compare(password, user.password);
  if (!compareToSherlock){
    throw "Either the email address or password is invalid";
  }

  return {userFound:true ,emailAddress: nEmailAddress};
}

// const remove = async (applicantId) => {
//   applicantId = validation.checkId(applicantId);
//   const applicantCollection = await applicants();
//   const deletionInfo = await applicantCollection.findOneAndDelete({
//       _id: new ObjectId(id)
//   });
//   if (deletionInfo.lastErrorObject.n === 0)
//       throw `Could not delete post with id of ${id}`;
//   return {deleted: true};
// };

export const removeUser = async (emailAddy) => {
  validID(id);
  const userCollection = await users();
  const deletionInfo = await userCollection.deleteOne({
      email: emailAddy
  });
  if (deletionInfo.deletedCount === 0)
      throw `Could not delete user with email of ${emailAddy}`;
  return {deleted: true};
}