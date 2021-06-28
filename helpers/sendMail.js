var nodemailer = require('nodemailer');
var sendGridTransport = require('nodemailer-sendgrid-transport');


let api_key = process.env.SENDGRID_APIKEY;
let email = process.env.SENDGRID_EMAIL

let transporter = nodemailer.createTransport(sendGridTransport({
  auth:{
      api_key:api_key
  }  
}));



 
exports.sendLinkOnMail = async (option)=>{

  let options = {
    from : email,
    to : option.sendTo,
    // subject : "Forget Password",
    subject : option.subject,
    html : `<strong>Please Click to this <a href="http//localhost:4040${option.link}/${option.token}">link<a> for change the password</strong>`
  }

  let sendMail = new Promise((resolve,reject)=>{
    transporter.sendMail(options,(err,info)=>{
      if(err) return reject(false);
      // console.log("Send Success");
      return resolve(true);
    })
  });

  let isSend = await sendMail;

  return isSend

}