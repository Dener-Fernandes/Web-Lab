const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "admsupremoweblab21512020@gmail.com",
        pass: "5843QA7DR4R6A8D@56*%ATYBXLO&12",
    }
});

module.exports = function () {
    console.log("O autoload carregou o módulo de e-mails!");
    return transporter;
}