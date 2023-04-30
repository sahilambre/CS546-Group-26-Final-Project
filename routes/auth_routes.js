import {Router} from 'express';
import {emailValidation} from '../helper.js';
import {createApplicant} from '../data/applicants.js';
import {createRecruiter} from '../data/recruiters.js';
import {createUser, checkUser} from '../data/users.js';
const router = Router();


router.route('/').get(async (req, res) => {
    //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
    return res.json({error: 'YOU SHOULD NOT BE HERE!'});
  }); 

  router
  .route('/registerStudents')
  .get(async (req, res) => {
    //code here for GET
    res.render("studentregister", { title : "Student Register"});
  })
  .post(async (req, res) => {
    //code here for POST
    const {firstNameInput, lastNameInput, emailAddressInput, ageInput, stateInput,gradYearInput ,passwordInput, confirmPasswordInput} = req.body;
    if(!firstNameInput || !lastNameInput || !emailAddressInput || !ageInput || !stateInput || !gradYearInput || !passwordInput || !confirmPasswordInput){
      let missingInputs = [];
      if (!firstNameInput) {
        missingInputs.push("First Name");
      }
      if (!lastNameInput) {
        missingInputs.push("Last Name");
      }
      if (!emailAddressInput) {
        missingInputs.push("Email Address");
      }
      if (!ageInput) {
        missingInputs.push("Age");
      }
      if (!stateInput) {
        missingInputs.push("State");
      }
      if (!gradYearInput) {
        missingInputs.push("Graduation Year");
      }
      if (!passwordInput) {
        missingInputs.push("Password");
      }
      if (!confirmPasswordInput) {
        missingInputs.push("Confirm Password");
      }
      res.status(400).render("studentregister", {title: "Student Reigstration" ,error: missingInputs});
    }

    const wrongParams = [];
    if(typeof firstNameInput !== 'string' ||  /\d/.test(firstNameInput) || (firstNameInput.length < 2) || firstNameInput.length > 25){
      wrongParams.push("First Name wrong");
    }

    if(typeof lastNameInput !== 'string' ||  /\d/.test(lastNameInput) || (lastNameInput.length < 2) || lastNameInput.length > 25){
      wrongParams.push("Last Name wrong");
    }
    let nEmailAddress;
    if(!emailValidation(emailAddressInput)){
      wrongParams.push("Email wrong");
    }else{
       nEmailAddress = emailAddressInput.toLowerCase();
    }

    if(typeof ageInput !== 'number' ||  ageInput < 0){
      wrongParams.push("Age wrong");
    }
    
    if(typeof stateInput !== 'string' ||  /\d/.test(stateInput) || (stateInput.length < 2) || stateInput.length > 25){
      wrongParams.push("State wrong");
    }

    if(typeof gradYearInput !== 'number' ||  gradYearInput < 0 || /^\d{4}$/.test(gradYearInput) === false){  
      wrongParams.push("Graduation Year wrong");
    }

    if(typeof passwordInput !== 'string' ||  passwordInput.length < 8 || passwordInput.length > 25){
      wrongParams.push("Password wrong");
    }
    const passwordPattern = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$";
    const passwordReg = new RegExp(passwordPattern);
    if( !passwordReg.test(passwordInput)){
      //throw res.status(400).send({error: 'This is an error!'});
      wrongParams.push("Password wrong");
    }

    if(typeof confirmPasswordInput !== 'string' ||  confirmPasswordInput.length < 8 || confirmPasswordInput.length > 25){
      wrongParams.push("Confirm Password wrong");
    }

    if(passwordInput !== confirmPasswordInput){
      wrongParams.push("Password and Confirm Password do not match");
    }

    if(wrongParams.length > 0){
      res.status(400).render("studentregister", {title: "Student Reigstration" ,error: wrongParams});
    }

    try{
      const newUser = await createUser(nEmailAddress, passwordInput);
      if(newUser.insertedUser === true ){
        const newApplicant = await createApplicant(firstNameInput, lastNameInput, nEmailAddress, ageInput, stateInput, gradYearInput);
        if(newApplicant.insertedApplicant === true) {
          res.status(201).render("login", {title: "Student Login"});
        }else{
          res.status(400).render("studentregister", {title: "Student Reigstration" ,error: "Registration Failed"});
        }
      }
    }catch(e){
      res.status(400).render("studentregister", {title: "Student Reigstration" ,error: e});
    }
    

  });

  router
  .route('/registerRecruiters')
  .get(async (req, res) => {
    //code here for GET
    res.render("recruiterregister", { title : "Employer Registration"});
  })
  .post(async (req, res) => {
    const {firstNameInput,lastNameInput, emailAddressInput, companyInput, passwordInput, confirmPasswordInput  } = req.body;
    if(!firstNameInput || !lastNameInput || !emailAddressInput || !companyInput || !passwordInput || !confirmPasswordInput){
      let missingInputs = [];
      if (!firstNameInput) {
        missingInputs.push("First Name");
      }
      if (!lastNameInput) {
        missingInputs.push("Last Name");
      }
      if (!emailAddressInput) {
        missingInputs.push("Email Address");
      }
      if (!companyInput) {
        missingInputs.push("Company");
      }
      if (!passwordInput) {
        missingInputs.push("Password");
      }
      if (!confirmPasswordInput) {
        missingInputs.push("Confirm Password");
      }
      res.status(400).render("recruiterregister", {title: "Employer Registration" ,error: missingInputs});
    }

    const wrongParams = [];
    if(typeof firstNameInput !== 'string' ||  /\d/.test(firstNameInput) || (firstNameInput.length < 2) || firstNameInput.length > 25){
      wrongParams.push("First Name wrong");
    }

    if(typeof lastNameInput !== 'string' ||  /\d/.test(lastNameInput) || (lastNameInput.length < 2) || lastNameInput.length > 25){
      wrongParams.push("Last Name wrong");
    }
    let nEmailAddress;
    if(!emailValidation(emailAddressInput)){
      wrongParams.push("Email wrong");
    }else{
        nEmailAddress = emailAddressInput.toLowerCase();
    }

    if(typeof companyInput !== 'string' ||  /\d/.test(companyInput) || (companyInput.length < 2)){
      wrongParams.push("Company wrong");
    }

    if(typeof passwordInput !== 'string' ||  passwordInput.length < 8 || passwordInput.length > 25){
      wrongParams.push("Password wrong");
    }

    const passwordPattern = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$";
    const passwordReg = new RegExp(passwordPattern);
    if( !passwordReg.test(passwordInput)){
      wrongParams.push("Password wrong");
    }

    if(typeof confirmPasswordInput !== 'string' ||  confirmPasswordInput.length < 8 || confirmPasswordInput.length > 25){
      wrongParams.push("Confirm Password wrong");
    }

    if(passwordInput !== confirmPasswordInput){
      wrongParams.push("Password and Confirm Password do not match");
    }

    if(wrongParams.length > 0){
      res.status(400).render("recruiterregister", {title: "Employer Registration" ,error: wrongParams});
    }

    try{
      const newUser = await createUser(nEmailAddress, passwordInput);
      if(newUser.insertedUser === true ){
        const newApplicant = await createRecruiter(firstNameInput, lastNameInput, nEmailAddress, companyInput, []);
        if(newApplicant.insertedApplicant === true) {
          res.status(201).render("login", {title: "Recruiter Login"});
        }else{
          res.status(400).render("recruiterregister", {title: "Recruiter Reigstration" ,error: "Registration Failed"});
        }
      }
    }catch(e){
      res.status(400).render("recruiterregister", {title: "Recruiter Reigstration" ,error: e});
    }

  });