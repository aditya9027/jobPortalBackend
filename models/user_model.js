const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    roleId : {
        type : Number,  //  0 for Company and 1 for Freelancer 
        require : true
    },
    name : {
        type:String,
        require : true
    },
    email : {
        type : String,
        require : true
    },
    password : { 
        type : String,
        require : true
    },
    mobile : {
        type : String,
        require : true
    },
    state : {
        type : String
    }, 
    city : {
        type : String
    }, 
    country : {
        type : String
    },
    address : {
        type : String
    },
    dob : {
        type : String
    },
    token : {
        type : String
    },
    forgetInfo : { 
        token : String
    },
    signupInfo : {
        token : String ,
        varify : {
            type : Boolean,
            default : false
        }
    },
    appliedJob : []

});

let users = mongoose.model('Users',userSchema);

module.exports = users

