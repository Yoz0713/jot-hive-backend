const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'jothive2023@gmail.com',
      pass: 'yneupdapigzjdnhf',
    },
  });


  const sendMail = async (options)=>{
    const info = await transporter.sendMail(options);
    return info.accepted
  }
 module.exports = sendMail
 