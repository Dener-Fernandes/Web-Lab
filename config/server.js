// Requerindo todos os frameworks e middlewares do software.
const express = require("express");
const app = express();
const consign = require("consign");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const session = require ("express-session");
const fileUpload = require("express-fileupload");

// Definindo o ejs como a engine que irá renderizar as views do software.
app.set("view engine", "ejs");
// Indicando o caminho das views;
app.set("views", "./app/views");
// Informando o local dos arquivos estáticos.
app.use(express.static("./app/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
}));
app.use(fileUpload());

// Incluindo os arquivos na constante app.
consign()
.include("./app/routes")
.then("./app/controllers")
.then("./config/dbConnection.js")
.then("./config/emailSend.js")
.then("./app/models")
.into(app);

module.exports = app;