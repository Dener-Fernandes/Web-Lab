const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "",
        pass: "",
    }
});

module.exports = function () {
    console.log("O autoload carregou o módulo de e-mails!");
    return transporter;
}