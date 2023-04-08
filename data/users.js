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
  let letterNumber = /^[0-9a-zA-Z]+$/;
  if (!username.match(letterNumber)) { throw "username can only contain letters and numbers"; }
}

function validPassword(password) {
  if (!password) { throw "password is not defined"; }
  if (password.constructor !== String) { throw "password must be a string"; }
  if (password.length < 8) { throw "password length must be at least 8 characters"; }
  if (password.length > 31) { throw "password length must not exceed 31 characters"; }
}


async function addUsers(newUsername, newPassword) {
  validUsername(newUsername);
  validPassword(newPassword);

  const usersCollections = await users();
  const doesExist = await usersCollections.findOne({ username: newUsername });

  if (doesExist) {
    throw "This username already exists!";
  }

  let hashedPassword;
  try {
    hashedPassword = await bcryptjs.hash(newPassword, 12);
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

  return newInfo.insertedId;
}
