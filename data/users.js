import { users } from "../config/mongoCollections.js";
import {ObjectId} from 'mongodb';

//Valid Portion 
function validID(id){
    if (!id) throw "id is not defined";
    if (id.constructor !== String) throw "id has to be a string";
    if (!ObjectId.isValid(id)) throw "id is not valid";
  }
  
  function validUsername(username){
    if (!username) throw "username is undefinded";
    if (username.constructor !== String) throw "username is not of the proper type";
    if (username.length < 6 ) throw "length of username is less than 6";
    let letterNumber = /^[0-9a-zA-Z]+$/;
    if (!username.match(letterNumber)) throw "username should contain only letter and number";
  }
  
  function validPassword(password){
    if (!password) throw "password is undefinded";
    if (password.constructor !== String) throw "password is not of the proper type";
    if (password.length < 8 ) throw "length of password is less than 8";
    if (password.length > 31 ) throw "length of password is greater than 31";
  }

  async function addUsers(username,newPassword){
    validUsername(username);
    validPassword(password);
    
  }


