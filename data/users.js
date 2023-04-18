import { users } from "../config/mongoCollections.js";
import { ObjectId } from 'mongodb';
import bcryptjs from 'bcryptjs';

export function validID(id) {
  if (!id) { throw "id is not defined"; }
  if (typeof id !== 'string') { throw "id must be a string"; }
  if (!ObjectId.isValid(id)) { throw "id is invalid"; }
}

export function validUsername(username) {
  if (!username) { throw "username is not defined"; }
  if (typeof username !== 'string') { throw "username must be a string"; }
  if (username.length < 6) { throw "username length must be at least 6 characters"; }
  if (!username.match(/^[0-9a-zA-Z]+$/)) { throw "username can only contain letters and numbers"; }
}

export function validPassword(password) {
  if (!password) { throw "password is not defined"; }
  if (typeof password !== String) { throw "password must be a string"; }
  if (password.length < 8) { throw "password length must be at least 8 characters"; }
  if (password.length > 31) { throw "password length must not exceed 31 characters"; }
}


export async function addUsers(newUsername, newPassword) {
  validUsername(newUsername);
  validPassword(newPassword);

  const usersCollections = await users();
  const doesExist = await usersCollections.findOne({ username: newUsername });

  if (doesExist) {
    throw "This username already exists!";
  }

  let hashedPassword;
  try {
    let salt = 12;
    hashedPassword = await bcryptjs.hash(newPassword, salt);
  } catch (e) {
    throw "Error hashing password!";
  }

  let user = {
    username: newUsername,
    password: hashedPassword,
  };

  const newInfo = await usersCollections.insertOne(user);

  if (newInfo.insertedCount === 0) {
    throw "New user was not created!";
  }

  return getUser(newInfo.insertedId.toString());
}

export async function getUser(id) {
  validID(id);

  const usersCollection = await users();
  const user = await usersCollection.findOne({ _id: ObjectId(id) });

  if (!user) {
    throw "User not found!";
  }

  return user;
}



