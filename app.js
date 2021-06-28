const express = require('express');
const cors = require('cors');

// import routes
// const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user_route');
const jobRoutes = require('./routes/job_route');
const freelancerRoute = require('./routes/freelancer_route');

const app = express();

// app middlewares
// app.use(morgan('dev'));
app.use(express.json());
app.use(cors()); // allows all origins
// if ((process.env.NODE_ENV = 'development')) {
//     app.use(cors({ origin: `http://localhost:3000` }));
// }

// middleware
// app.use('/api', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/job', jobRoutes);
app.use('/api/freelancer', freelancerRoute);


module.exports = app