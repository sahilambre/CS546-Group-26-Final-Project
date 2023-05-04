//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.

export const validName = (name) => {
    if(!name) throw `400No name was provided!`
    name = name.trim()
    if(name.length < 2 || name.length > 25) throw `400Given name '${name}' is invalid! Length of name must be greater than 2 and less than 25 characters`
    if(! /^[a-z0-9]{4,}$/i.test(name)) throw `400Given name '${name}' is invalid! Only alpha numeric characters are allowed`
    return name    
}

export const validEmail = (email) => {
    if(!email) throw `400No email was provided!`
    email = email.trim().toLowerCase()
    if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) throw `400Given email id is invalid!`
    return email
}

export const validPassword = (password) => {
    if(!password) throw `400No password was provided!`;
    if(password.includes(" ")) throw `400passwords can't have spaces!`;
    if(password.length < 8) throw `400passwords must be at least 8 characters long!`;
    if(! /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) throw `400passwords must have at least one special character!`;
    if(! /[A-Z]/.test(password)) throw `400passwords must have at least one capital alphabet!`;
    if(! /[0-9]/.test(password)) throw `400passwords must have at least one number!`;
    return password;
}

