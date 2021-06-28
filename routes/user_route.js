const routes = require('express').Router();
const { 
    addUser , 
    loginUser,
    changePassword, 
    forgetPassword, 
    forgetPasswordVarify,
    signupVarify
} = require('../controller/user_controller');

routes.post('/addUser',addUser);
routes.post('/loginUser',loginUser);
routes.patch('/changePassword/:id',changePassword);
routes.patch('/forgetPassword',forgetPassword);
routes.patch('/forgetPasswordVarify/:token',forgetPasswordVarify);

// Api by Mail 
routes.patch('/signupVarify/:token',signupVarify);

module.exports = routes