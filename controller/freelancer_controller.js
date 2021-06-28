const Jobs = require('../models/job_model');

// get all jobs 
exports.getAllJobs = async(req,res)=>{
    try {
        let allJobs = await Jobs.find();

        res.status(200).json({
            status : true,
            response : allJobs
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            error : error,
            status : false
        });
        
    }
}


// Filter jobs 
exports.filteredJobs = async (req,res)=>{
    try{
        let data = req.body;
        // 2. Filter job based on skills, location and Keyword
        let filteredJob = null;
        if(data.jobSkills != undefined && data.location){
            filteredJob = await Jobs.find(
                { $or: [ { jobSkills : {$all: data.jobSkills}}, { location : data.location } ] } 
            )
        }else if (data.jobSkills != undefined){
            filteredJob = await Jobs.find(
                { jobSkills : {$all: data.jobSkills}}
            )
        }else if (data.location != undefined){
            filteredJob = await Jobs.find(
                { location : data.location }
            )
        }

        res.status(200).json({
            message : "success",
            status:true,
            response : filteredJob
        });
    }catch(error){
        console.log(error);
        res.status(400).json({error});
    }
}





