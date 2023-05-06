import {Router} from 'express';
import {validEmail} from '../helpers.js';
import {createUser, checkUser} from '../data/users.js';
import recruiterData from '../data/recruiters.js';
import applicantData from '../data/applicants.js';
import jobData from '../data/jobs.js';
import xss from 'xss';

const router = Router();


router.route('/').get(async (req, res) => {
    //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
    // try {
    //   if (!req.session.user) return res.render('login',{})
    //   if (req.session.user.role === 'admin') return res.redirect('/admin')
    //   return res.redirect('/protected')
    // } catch (error) {
    //   return res.render('error',{title: "Error", message: error.message || error})
    // }
    // return res.status(201).render("homepage", {title: "Home Page"});
    return res.status(201).render("landingpage", {title: "Landing Page"});
  }); 

router
  .route('/registerStudents')
  .get(async (req, res) => {
    //code here for GET
    return res.render("studentregister", { title : "Student Register"});
  })
  .post(async (req, res) => {
    //code here for POST
    //const {firstNameInput, lastNameInput, emailAddressInput, ageInput, stateInput, gradYearInput ,passwordInput, confirmPasswordInput} = req.body;
    const firstNameInput = xss(req.body.firstNameInput)
    const lastNameInput = xss(req.body.lastNameInput) 
    const emailAddressInput = xss(req.body.emailAddressInput)
    let ageInput = xss(req.body.ageInput)
    const stateInput = xss(req.body.stateInput)
    const gradYearInput = xss(req.body.gradYearInput)
    const passwordInput = xss(req.body.passwordInput)
    const confirmPasswordInput = xss(req.body.confirmPasswordInput)
    
    
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
      return res.status(400).render("studentregister", {title: "Student Reigstration" ,error: missingInputs});
    }

    const wrongParams = [];
    if(typeof firstNameInput !== 'string' ||  /\d/.test(firstNameInput) || (firstNameInput.length < 2) || firstNameInput.length > 25){
      wrongParams.push("First Name wrong");
    }

    if(typeof lastNameInput !== 'string' ||  /\d/.test(lastNameInput) || (lastNameInput.length < 2) || lastNameInput.length > 25){
      wrongParams.push("Last Name wrong");
    }
    let nEmailAddress;
    if(!validEmail(emailAddressInput)){
      wrongParams.push("Email wrong");
    }else{
       nEmailAddress = emailAddressInput.toLowerCase();
    }

    if(isNaN(ageInput) ||  ageInput < 0){  //Don't forget to convert into Number from String
      wrongParams.push("Age wrong");
    }
    
    if(typeof stateInput !== 'string' ||  /\d/.test(stateInput) || (stateInput.length < 2) || stateInput.length > 25){
      wrongParams.push("State wrong");
    }

    if (isNaN(gradYearInput)) wrongParams.push("Graduation Year wrong")
    let gradYearInputNum = parseInt(gradYearInput);
    if(typeof gradYearInputNum !== 'number' ||  gradYearInputNum < 0 || /^\d{4}$/.test(gradYearInput) === false){  
      wrongParams.push("Graduation Year wrong");
    }

    if(typeof passwordInput !== 'string' ||  passwordInput.length < 8 || passwordInput.length > 25){
      wrongParams.push("Password wrong");
    }
    const passwordPattern = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$";
    const passwordReg = new RegExp(passwordPattern);
    if( !passwordReg.test(passwordInput)){
      //throw return res.status(400).send({error: 'This is an error!'});
      wrongParams.push("Password wrong");
    }

    if(typeof confirmPasswordInput !== 'string' ||  confirmPasswordInput.length < 8 || confirmPasswordInput.length > 25){
      wrongParams.push("Confirm Password wrong");
    }

    if(passwordInput !== confirmPasswordInput){
      wrongParams.push("Password and Confirm Password do not match");
    }

    if(wrongParams.length > 0){
      return res.status(400).render("studentregister", {title: "Student Reigstration" ,error: wrongParams});
    }

    try{
      const newUser = await createUser(nEmailAddress, passwordInput);//Update to take more params
      if(newUser.insertedUser === true ){
        const newApplicant = await createApplicant(firstNameInput, lastNameInput, nEmailAddress, ageInput, stateInput, gradYearInputNum);
        if(newApplicant.insertedApplicant === true) {
          return res.status(201).render("login", {title: "Student Login"});
        }else{
          return res.status(400).render("studentregister", {title: "Student Reigstration" ,error: "Registration Failed"});
        }
      }
    }catch(e){
      return res.status(400).render("studentregister", {title: "Student Reigstration" ,error: e});
    }
    

  });

  router
  .route('/registerRecruiters')
  .get(async (req, res) => {
    //code here for GET
    return res.render("recruiterregister", { title : "Employer Registration"});
  })
  .post(async (req, res) => {
    // const {firstNameInput,lastNameInput, emailAddressInput, companyInput, passwordInput, confirmPasswordInput  } = req.body;
    const firstNameInput = xss(req.body.recruiterFirstName)// Make these id's unique -> recruiterFirstName, Don't forget to change id and name in the respective handlebars too
    const lastNameInput = xss(req.body.recruiterLastName)
    const emailAddressInput = xss(req.body.recruiterEmail)
    const companyInput = xss(req.body.recruiterCompany)
    const passwordInput = xss(req.body.recruiterPassword)
    const confirmPasswordInput = xss(req.body.recruiterConfirmPassword)
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
      if (missingInputs.length > 0)
      {
        return res.status(400).render("recruiterregister", {title: "Employer Registration" ,error: missingInputs});
      }
    }

    const wrongParams = [];
    if(typeof firstNameInput !== 'string' ||  /\d/.test(firstNameInput) || (firstNameInput.length < 2) || firstNameInput.length > 25){
      wrongParams.push("First Name wrong");
    }

    if(typeof lastNameInput !== 'string' ||  /\d/.test(lastNameInput) || (lastNameInput.length < 2) || lastNameInput.length > 25){
      wrongParams.push("Last Name wrong");
    }
    let nEmailAddress;
//    if(!emailValidation(emailAddressInput)){ // >>>  EmialValidation wasn't imported!!!!!
    if(!validEmail(emailAddressInput)){
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
      return res.status(400).render("recruiterregister", {title: "Employer Registration" ,error: wrongParams});
    }

    try{
      const newUser = await createUser(nEmailAddress, passwordInput);
      if(newUser.insertedUser === true ){
        const newRecruiter = await recruiterData.createRecruiter(firstNameInput, lastNameInput, nEmailAddress, companyInput, []);
        if(newRecruiter.insertedRecruiter === true) {
          return res.status(201).render("regsuccess", {title: "Recruiter Registration Successful"});
        }else{
          return res.status(400).render("error", {title: "Recruiter Registration Error" ,error: "Registration Failed"});
        }
      }
      else
      {
        return res.status(400).render("error", {title: "Recruiter Registration Error" ,error: "User Creation Failed"});

      }
    }catch(e){
      return res.status(400).render("error", {title: "Recruiter Registration Error" ,error: e});
    }
    
  });

  router
  .route('/login')
  .get(async (req, res) => {
    //code here for GET
    if (req.session.user) { return res.redirect('/protected')}
    return res.render("login", { title : "Login"});
  })
  .post(async (req, res) => { 
    const emailAddressInput = xss(req.body.username)
    const passwordInput = xss(req.body.password)
    // const {emailAddressInput, passwordInput} = req.body
    let missingInputs = []
    if(!emailAddressInput || !passwordInput){
      let missingInputs = [];
      if (!emailAddressInput) {
        missingInputs.push("Email Address");
      }
      if (!passwordInput) {
        missingInputs.push("Password");
      }
      return res.status(400).render("login", {title: "Login" ,error: missingInputs});
    }
    let nEmailAddress;
    if(!validEmail(emailAddressInput)){//if(!emailValidation(emailAddressInput)){
      return res.status(400).render("login", {title: "Login" ,error: "Either email or password is wrong"});
    }else{
        nEmailAddress = emailAddressInput.toLowerCase();
    }
    const passwordPattern = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$";
    const passwordReg = new RegExp(passwordPattern);
    if( !(passwordReg.test(passwordInput))){
      missingInputs.push("Either email or password is wrong");
    }

    try{
      const user = await checkUser(nEmailAddress, passwordInput);
      if(user.userFound === true ){
          let correctEmail = user.emailAddress;
          // let isRecruiter = false;
          // try { isRecruiter =await recruiterData.getByEmailRecruiter(correctEmail); } catch(e) {};
          // let isApplicant = false;
          // try { isApplicant = await applicantData.getByEmailApplicant(correctEmail); } catch(e) {};
          let isRecruiter = await recruiterData.getByEmailRecruiter(correctEmail);
          let isApplicant = await applicantData.getByEmailApplicant(correctEmail);
          if(isRecruiter){
            return res.status(201).render("landingPage", {title: "Recruiter Home"});
          }else if(isApplicant){
            return res.status(201).render("landingPage", {title: "Student Home"});
          }
      }else{
        // return alert("Either email or password is wrong");
        return res.status(400).render("login", {title: "Login" ,error: "Either email or password is wrong"});
      }
    }catch(e){
      // return alert(e.message || e);
      return res.status(400).render("login", {title: "Login" ,error: e.message || e});
    }

  });

  router.route('/homepage').get(async (req, res) => {
    let jobsapplied = [];
    let jobsfavorited = [];
    let jobslisted = [];
    if (req.session.user.applicant)
    {
      try { jobsapplied = await applicantData.getJobsApplied(req.session.user.applicant._id); } catch(e) {};
      try { jobsfavorited = await applicantData.getJobsFavorited(req.session.user.applicant._id); } catch(e) {};

    }
    if (req.session.user.recruiter)
    {
      try { jobslisted = await jobData.getJobsByRecruiterId(req.session.user.recruiter._id); } catch(e) {};
    }
    res.render('homepage', {title: 'Home Page', emailAddress: req.session.user.emailAddress, 
      recruiter:req.session.user.recruiter, applicant:req.session.user.applicant,
      jobsApplied: jobsapplied, jobsFavorited: jobsfavorited, jobsListed: jobslisted 
    });

  });
  
  router.route('/jobdetails/:id').get(async (req, res) => {
    //code here for GET
   
    let applicants = [];
  
    try {
      let job = await jobData.getJob(req.params.id);
     
      if (req.session.user.recruiter && job.recruiterId == req.session.user.recruiter._id)
      {
        try { applicants = await jobData.getJobApplicants(req.params.id); 
        } catch(e) {};
        res.render('jobdetails', {title:"Job Details", job:job, applicants:applicants, emailAddress: req.session.user.emailAddress, 
        recruiter:req.session.user.recruiter, applicant:req.session.user.applicant});
      }
      else{
        res.render('jobdetails', {title:"Job Details", job:job, emailAddress: req.session.user.emailAddress, 
        recruiter:req.session.user.recruiter, applicant:req.session.user.applicant});
      }
      
      
    } catch (e) {
      res.status(400).render('error', {title:'Error In Job Details', error:e});
    }
  });

  router.route('/jobSearch').get(async (req, res) => {
    let jobsreturned = [];
    try
    {
      jobsreturned = await jobData.getAllJobs();
      
         
      res.render('jobsearch', {title: 'Job Search', emailAddress: req.session.user.emailAddress, 
        recruiter:req.session.user.recruiter, applicant:req.session.user.applicant,
        jobs: jobsreturned});

  } catch (e) {
    res.status(400).render('error', {title:'Error In Job Search', error:e});
  }

  });
  

  router
  .route('/jobCreate')
  .get(async (req, res) => {
    //code here for GET
    res.render("jobcreate", { title : "Create Job"});
  })
  .post(async (req, res) => {
    const {titleInput, companyInput, websiteInput, tagsInput} = req.body;
    if(!titleInput || !companyInput || !websiteInput || !tagsInput ){
      let missingInputs = [];
      if (!titleInput) {
        missingInputs.push("Title");
      }
      if (!companyInput) {
        missingInputs.push("Company");
      }
      if (!websiteInput) {
        missingInputs.push("Website");
      }
      if (!tagsInput) {
        missingInputs.push("Tags");
      }
      
      if (missingInputs.length > 0)
      {
        res.status(400).render("jobcreate", {title: "Job Create" ,error: missingInputs});
        return;
      }
    }

    // maybe add more data checking
    try{
      if (!req.session.user.recruiter) throw 'Non-recruiter cannot create a job';
      //isRecruiter = await recruiterData.get(req.session.user.recruiter.recruiterId);
      let convertedTags = eval('(' + tagsInput + ')');
      const newJob = await jobData.create(titleInput, companyInput, websiteInput, convertedTags, req.session.user.recruiter._id);
      if(newJob)
      {
        res.redirect('/jobdetails/'+newJob._id);
      }
      else
      {
        res.status(400).render("error", {title: "Create Job Error" ,error: "Job Creation Failed"});

      }
    }catch(e){
      res.status(400).render("error", {title: "Job Creation Error" ,error: e});
    }
    
  });

  router.route('/apply/:id').get(async (req, res) => {
    //code here for GET
   
  
    try {
      if (!req.session.user.applicant) throw 'Must be applicant to apply for job';
      let job = await jobData.getJob(req.params.id);
     
      if (job && job.applicants.includes(req.session.user.applicant._id)) throw 'User has already applied for this job';
      
      await applicantData.applyJob(req.session.user.applicant._id, req.params.id);
      
      res.redirect('/homepage');
      
      
    } catch (e) {
      res.status(400).render('error', {title:'Error In Apply Job Operation', error:e});
    }
  });

  router.route('/favorite/:id').get(async (req, res) => {
    //code here for GET
   
    try {
      if (!req.session.user.applicant) throw 'Must be applicant to apply for job';
      let job = await jobData.getJob(req.params.id);
      let updated_applicant = await applicantData.get(req.session.user.applicant._id);

      if (updated_applicant.jobsFavorited.includes(job._id)) throw 'User has already favorited this job';
      
      await applicantData.favoriteJob(req.session.user.applicant._id, req.params.id);
      
      res.redirect('/homepage');      
      
    } catch (e) {
      res.status(400).render('error', {title:'Error In Favorite Job Operation', error:e});
    }
  });
 
  export default router;