const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "admsupremoweblab21512020@gmail.com",
        pass: "",
    }
});

module.exports = function () {
    console.log("O autoload carregou o módulo de e-mails!");
    return transporter;
}