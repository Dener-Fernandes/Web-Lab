const mysql = require("mysql");
// Criando a conexão do banco de dados e empacotando a mesma.
const connMysql = function (){
    console.log("Conexão com o DB estabelecida.");
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "web_lab"
    });
}

module.exports = function (){
    console.log("O autoload carregou o módulo de conexão com DB.");
    return connMysql;
}