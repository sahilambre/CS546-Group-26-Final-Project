
const emailValidation = (email) => {
    if(!email){
        throw "Email Address must be supplied";
    }
    let nEmailAddress = email.toLowerCase();
    if( !(/\S+@\S+\.\S+/.test(nEmailAddress)) ){
        throw "Email address is not valid.";
    }
    return nEmailAddress;

};