const { findById, findOne, mapReduce } = require("../models/user_model");
const Jobs = require('../models/job_model');
const User = require('../models/user_model');


// Post Job 
exports.postJob = async (req,res)=>{
    try {
        let id = req.params.id;
        let data = req.body; 
        let findData = await User.findOne({_id:id});
        if(findData == null || findData.roleId !== 0){
            throw {
                message : "User Not Exist"
            }
        }
        data.adminId = id;
        await Jobs.create(data);
        res.status(201).json({
            message : "Job Created Success",
            status : true
        })

    } catch (error) {
        console.error(error);
        res.status(400).json({
            error : error,
            status : false
        })
    }
}

// Find All Jobs by Admin
exports.allJobsByAdmin = async (req,res)=>{
    try {
        let id = req.params.id;
        let findUser = await User.findOne({_id:id});

        if(findUser.roleId !== 0){
            throw {
                message : "Admin Not Exist",
            }
        }
        let data = await Jobs.find({adminId : id});
        res.status(200).json({
            status : true,
            response : data
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error : error,
            success : false
        })
        
    }
}

// View Job By Admin
exports.viewJobByAdmin = async (req,res)=>{
    try {
        
        let id = req.params.jobId;
        let data = await Jobs.findOne({_id:id});
        if(data == null){
            throw {
                message : "Not Job Find"
            }
        }

        res.status(200).json({
            response : data ,
            status : true
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            status : false,
            error : error
        })        
    }
}

// Edit Job By Admin
exports.editJobByAdmin = async(req,res)=>{
    try {
        let jobId = req.params.jobId;
        let data = req.body;

        await Jobs.updateOne({_id : jobId},data);
        res.status(200).json({
            status : true,
            message : "Updated Success"
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error : error,
            status : false
        })        
    }
}

// view all condidates who applied for jobs
exports.viewAppliedJobsCondidate = async (req,res)=>{
    try {
        let adminId = req.params.adminId;
        let findData = await User.findOne({_id:adminId});
        if(findData == null){
            throw {
                message : "User not Exist "
            }
        }
        if(findData.roleId !== 0){
            throw {
                message : "User not Admin"
            }
        }

        findData = await Jobs.findOne({adminId:adminId});
        if(findData == null){
            throw {
                message : "Not Job Yet"
            }
        }

        let jobId = findData._id;
        findData = await User.find({
            appliedJob : jobId
        });

        console.log(findData);

    } catch (error) {
        console.log(error);
        res.status(400).json({
            error : error
        })
        
    }

}
