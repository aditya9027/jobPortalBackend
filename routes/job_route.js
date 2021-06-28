const routes = require('express').Router();
const {
    postJob,
    allJobsByAdmin, 
    viewJobByAdmin, 
    editJobByAdmin,
    viewAppliedJobsCondidate
} = require('../controller/job_controller');
const { headersCheck } = require('../auth/headersCheck');

routes.post('/postJob/:id',headersCheck,postJob);
routes.get('/allJobsByAdmin/:id',headersCheck,allJobsByAdmin);
routes.get('/viewJobByAdmin/:jobId',headersCheck,viewJobByAdmin);
routes.patch('/editJobByAdmin/:jobId',headersCheck,editJobByAdmin);

// view all condidate Who applied for a job 
routes.get('/viewAppliedJobsCondidate/:adminId',headersCheck,viewAppliedJobsCondidate);



module.exports = routes