module.exports.getAvisos = function (app, req, res) {
    if (req.session.loggedIn) {
        let connection = app.config.dbConnection();
        let avisosModel = new app.app.models.AvisoDAO(connection);

        try {
            avisosModel.getAvisos(function (error, result) {
                res.render("avisos/mural_avisos", {usuario: req.session.usuario, nivelUsuario: req.session.nivelUsuario, avisos: result});
            });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
    }
    else {
        res.redirect("/");
    }
}

module.exports.cadastroAvisos = function (app, req, res) {
    if (req.session.loggedIn) {
        if (req.session.nivelUsuario == "1") {
            res.render("avisos/cadastro_avisos" , {validacao: {}});
        }
        else {
            res.redirect("/home");
        }
    }
    else {
        res.redirect("/");
    }
}

module.exports.atualizacaoAvisos = function (app, req, res) {
    if (req.session.loggedIn) {
        if (req.session.nivelUsuario == "1") {
            let id_aviso = req.query.id_aviso;
            let connection = app.config.dbConnection();
            let avisoModel = new app.app.models.AvisoDAO(connection);

            try {
                avisoModel.getAviso(id_aviso, function (error, result) {
                    res.render("avisos/atualizar_avisos", {validacao: {}, aviso: result});
                });
            } catch (error) {
                res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
            }
        }
        else {
            res.redirect("/home");
        }
    }
    else {
        res.redirect("/");
    }
}


module.exports.insertAviso = function (app, req, res) {
    let descricao_aviso = req.body.descricao_aviso;
    let id_usuario = req.session.usuario;
    let connection = app.config.dbConnection();
    let avisoModel = new app.app.models.AvisoDAO(connection);

    req.assert("descricao_aviso", "0").notEmpty();

    let erros = req.validationErrors();

    if (erros) {
        res.render("avisos/cadastro_avisos", {validacao: erros});
        return;
    }

    let dt = new Date();
    let dia = dt.getDate();
    let mes = dt.getMonth() + 1;
    let ano = dt.getFullYear();
    if (dia < 10) {
        dia = `0${dia}`;
    }
    if (mes < 10) {
        mes = `0${mes}`;
    }
    let data_publicacao = `${dia}/${mes}/${ano}`;
    let aviso = {
        descricao_aviso,
        data_publicacao,
        id_usuario,
    }

    try {
        avisoModel.insertAviso(aviso, function (error, result) {
            res.redirect("/mural_avisos");
        });
    } catch (error) {
        res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
    }

}

module.exports.updateAviso = function (app, req, res) {
    let id_aviso = req.body.id_aviso;
    let descricao_aviso = req.body.descricao_aviso_atualizacao;
    let connection = app.config.dbConnection();
    let avisoModel = new app.app.models.AvisoDAO(connection);

    req.assert("descricao_aviso_atualizacao", "0").notEmpty();

    let validacao = req.validationErrors();

    if (validacao) {
        try {
            avisoModel.getAviso(id_aviso, function (error, result) {
                res.render("avisos/atualizar_avisos", {validacao, aviso: result});
            });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
        return;
    }

    let aviso = {
        id_aviso,
        descricao_aviso,
    }

    try {
        avisoModel.updateAviso(aviso, function (error, result) {
            res.redirect("/mural_avisos");
        });
    } catch (error) {
        res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
    }

}

module.exports.deleteAviso = function (app, req, res) {
    let id_aviso = req.body.id_excluir_aviso;
    let connection = app.config.dbConnection();
    let avisoModel = new app.app.models.AvisoDAO(connection);

    try {
        avisoModel.deleteAviso(id_aviso, function (error, result) {
            res.redirect("/mural_avisos");
        });
    } catch (error) {
        res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
    }
}