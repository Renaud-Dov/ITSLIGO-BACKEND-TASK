const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

const auth = require("../config.json")

const transporter = nodemailer.createTransport(mailGun(auth));

const sendMail = (name, email, text, cb) => {
    const mailOptions = {
        sender: name,
        from: email,
        to: 'contact@bugbear.fr',
        subject: `[Contact] - ${name}`,
        html: `<h1>Email Confirmation</h1>
        <h2 style="bg">Hello ${name}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <p>${text}</p>
        </div>`,
    };

    transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
            cb(err, null);
        } else {
            cb(null, data);
        }
    });
}

module.exports = sendMail;