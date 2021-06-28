const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    adminId : {
        type : String
    },
    userId : {
        type : []
    },
    jobTitle : {
        type:String
    },
    jobDescription : {
        type : String
    },
    jobBudget : {
        type : String
    },
    jobSkills : {
        type : []
    },
    location : {
        type : String
    },
    milestone : {
        type : String
    },
    companyName : {
        type : String
    }

});

const jobs = mongoose.model('Jobs',jobSchema);

module.exports = jobs;

/*

1. Post Job
    - Job Title
    - Job Description
    - Job Budget
    - Job Skills
    - Location
    - Fixed or milestone

*/