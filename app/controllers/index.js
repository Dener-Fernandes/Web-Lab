module.exports.Index = function (app, req, res) {
    res.render("home/index", {resultado: {}, validacao: {}, validacaoCpf: {}, validacaoEmail: {}, validacaoSenha: {}});
}

module.exports.Login = function (app, req, res) {
    let resultado = "Usuário ou senha incorretos!";
    let email_usuario = req.body.email_usuario_login;
    let senha_usuario = req.body.senha_usuario_login;

    if (email_usuario && senha_usuario) {
        let connection = app.config.dbConnection();
        let usuarioModel = new app.app.models.UsuarioDAO(connection);

        try {
            usuarioModel.loginUsuario(email_usuario, senha_usuario, function (error, result) {
                if (result.length > 0) {
                    if (result[0].status_usuario == "ATIVADO") {
                        req.session.loggedIn = true;
                        req.session.usuario = result[0].id_usuario;
                        req.session.nivelUsuario = result[0].nivel_usuario;
                        res.redirect("/home");
                    }
                    else {
                        res.render("home/index", {resultado, validacao: {}, validacaoCpf: {}, validacaoEmail: {}, validacaoSenha: {}});    
                    }
                }
                else {
                    res.render("home/index", {resultado, validacao: {}, validacaoCpf: {}, validacaoEmail: {}, validacaoSenha: {}});
                }
            });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
    }
    else {
        res.redirect("/");
    }
}

module.exports.Logout = function (app, req, res) {
        req.session.destroy();
        res.redirect("/");
}