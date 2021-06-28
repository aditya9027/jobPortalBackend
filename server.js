const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app');

const port = process.env.PORT; 

const server = http.createServer(app);

// connect to db
mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log('DB connected'))
    .catch(err => console.log('DB CONNECTION ERROR: ', err));


server.listen(port,(error)=>{
    if (error){
        console.log(error);
    }else {
        console.log("Server Listen at "+port);
    }
});