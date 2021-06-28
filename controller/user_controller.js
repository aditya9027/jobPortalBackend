
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('../models/user_model');
const { sendLinkOnMail } = require('../helpers/sendMail');

// Sign up user
exports.addUser = async (req,res)=>{
    try{   
        let data = req.body;
    
        if(data.email == null) throw { 
            message : "Email not be null",
         };
    
        let isMobileExist = await users.findOne( { mobile:data.mobile } ).lean();
        if(isMobileExist) throw { 
            message : "Mobile already Exist" ,
        };  //check if given number is already exist 
    
        let isEmailExist = await users.findOne( { email:data.email } ).lean();
        if(isEmailExist) throw { 
            message : " Email Already Exist",
        };
    
        let pass = await bcrypt.hash(data.password,10);
        data.password = pass;

        // Generate Token 
        let token = jwt.sign({
            // id : findData._id,
            email : data.email
        },process.env.JWT_SECRET_KEY,{
            expiresIn:'1h'
        });

        let option = {
            sendTo : data.email,
            token : token,
            subject : "Varify Link After Signup",
            link : "/api/user/signupVarify"
        }

        let sendSuccess =await sendLinkOnMail(option);

        // console.log(sendSuccess);

        if(sendSuccess == null ) throw {
            message : "Email Not Send please signup again"
        }

        data.signupVarify.token = token;
    
    
        // let res = new users(data);
        // let result = await res.save();
        let result = await users.create(data);
        // console.log(result);
    
        res.status(201).json({
            status : true ,
            message : "User Register Success"
        })
    }catch(error){
        console.log(error);
        res.status(400).json({
            status : false,
            error : error
        })
    }
}

// SignUp Varify 
exports.signupVarify = async (req,res)=>{
    let token = req.params.token;
    let decode = null; 
    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,result)=>{
        if(err) throw {message : "Token Expire"}
        decode = result
    });

    if(decode == null) throw { message : "Token Expire" }
    let data = await users.findOne({email:email}).lean();
    if (data.signupInfo.token !== token ){
        throw {message : "Token Expired"}
    } 
    
    await users.updateOne(
        {email:decode.email},
        {
            signupInfo: { varify:true,token:null} 
        }
    );

    res.status(200).json({
        status:true,
        message : "Varification Success"
    });

}


// Login User
exports.loginUser = async (req,res)=>{
    try{
            let data = {
            email: req.body.email,
            password :req.body.password
        }
        
        let findData = await users.findOne( {email:data.email} ).lean();
        if(findData == null ) throw { message : "Email Not Exist" }

        if(!findData.forgetInfo.varify){
            throw {
                message : "First varify your email"
            }
        }
        
        let compair = await bcrypt.compare(data.password,findData.password)

        if(!compair) throw {message : "Password Not Match"};

        // generate Token 
        let token = jwt.sign({
            id : findData._id,
            email : findData.email
        },process.env.JWT_SECRET_KEY,{
            expiresIn : '24h'
        });
        await users.findByIdAndUpdate({_id:findData._id}, {token:token} );
        
        findData.token = token;
        
        res.status(200).json({ 
            response : findData,
            message : "Login Success",
            status : true
        })
    }catch(error){
        res.status(400).json({
            error : error,
            status : false
        })
    }

}

// change Password 
exports.changePassword = async (req,res)=>{
    try{
        let id = req.params.id;
        let {headers} = req;
        let token = headers.token;

        let data = {
            oldPassword : req.body.oldPassword,
            newPassword : req.body.newPassword,
            confirmNewPassword : req.body.confirmNewPassword
        }

        if(data.oldPassword == null || data.newPassword == null  )
            throw { message : "Password not null" }

        if(data.newPassword !== data.confirmNewPassword) throw { 
            message : "new Password and confirm new password should be same" 
        }

        let savedData = await users.findById(id);
        if(savedData == null) throw { 
            message : "User Not Exist" 
        }

        if(savedData.token !== token){
            throw {
                message : "Token Expire"
            }
        }

        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,result)=>{
            if(err) throw{message : "Token Expire"}
        });

        // compair password
        let compair = await bcrypt.compare(data.oldPassword,savedData.password);

        if(!compair) throw { message:"Password Not Match" };

        let pass = await bcrypt.hash(data.newPassword,10);

        saveData = await users.updateOne({_id:id},{$set:{password:pass}});

        res.status(200).json({
            status : true,
            message : "Password Updated Succcess",
        })
    }catch(error){
        console.error(error);
        res.status(400).json({
            status : false,
            error : error
        })
    }
}

// Forget Password 
exports.forgetPassword = async (req,res)=>{
    try{    
        let { email } = req.body;

        // find email and check that email exist or not 
        let findData = await users.findOne({email:email});
        if(findData == null) throw { message : "Email Not Exist" };

        // Generate Token 
        let token = jwt.sign({
            id : findData._id,
            email : email
        },process.env.JWT_SECRET_KEY,{
            expiresIn:'1h'
        });

        let option = {
            sendTo : email,
            token : token,
            subject : "Forget Password",
            link:"/api/user/forgetVarifyPassword"
        }

        let sendSuccess =await sendLinkOnMail(option);

        // console.log(sendSuccess);

        if(sendSuccess == null ) throw {
            message : "Email Not Send"
        }

        let updatedData = await users.findOneAndUpdate(
            {
                _id:findData._id
            }, 
            {
                $set :{forgetInfo:{token:token,expToken:Date.now()+3600000}}
            });

        res.status(200).json({
            status : true,
            message : "Mail Send Success",
        })
    }catch(error){
        console.log(error);
        res.status(400).json({
            status : false,
            error : error
        })
    }

}

// ForgetPasswordVarify
exports.forgetPasswordVarify = async (req,res)=>{
    try{    
        let token = req.params.token;
        let { newPassword , confirmNewPassword } = req.body;

        if(newPassword !== confirmNewPassword) throw{ message : "password Not Match" }

        let decode = null; 
        jwt.verify(token,env.JWT_SECRET_KEY,(err,result)=>{
            if(err) throw{message : "Token Expire"}
            decode = result
        });
    
        if(decode == null) throw { message : "Token Expire" }
        
        let findData = await users.findOne({email:decode.email});
        if(findData == null || findData.forgetInfo.token !== token) throw { message : "Token Expired" }

        let pass = await bcrypt.hash(newPassword,10);

        await users.findOneAndUpdate({email:decode.email},{$set:{password:pass,forgetInfo:{token:null}}})

        res.status(200).json({
            status : true,
            message : msg.passwordUpdated,
        })

        

    }catch(error){
        console.log(error);
        res.status(400).json({
            status : false,
            error : error
        })
    }
}

