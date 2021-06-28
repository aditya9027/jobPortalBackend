const jwt = require('jsonwebtoken') 

exports.headersCheck = (req,res,next)=>{
    
    let {headers} = req;
    let token = headers.Authorization;

    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,result)=>{
        if(err) res.status(400).json({
            message : "Authentication error",
            status : false
        });
    });

    next();

}