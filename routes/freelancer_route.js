const { headersCheck } = require('../auth/headersCheck');
const { getAllJobs , filteredJobs} = require('../controller/freelancer_controller');


const router = require('express').Router();

router.get('/allJobs',headersCheck,getAllJobs);
router.get('/filteredJob',headersCheck,filteredJobs);

module.exports = router