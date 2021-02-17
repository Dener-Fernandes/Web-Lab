module.exports.getTecnicos = function (app, req, res) {
    if (req.session.loggedIn) {
        let connection = app.config.dbConnection();
        let usuarioModel = new app.app.models.UsuarioDAO(connection);
        let permanenciaModel = new app.app.models.PermanenciaDAO(connection);
        let laboratorioModel = new app.app.models.LaboratorioDAO(connection);

        try {
            usuarioModel.getTecnicos(function (error, result) {
                permanenciaModel.getPermanencias(function (error2, result2) {
                    laboratorioModel.getLaboratorios(function (error3, result3) {
                        res.render("tecnicos/tecnicos", {usuario: req.session.usuario ,nivelUsuario: req.session.nivelUsuario, tecnicos: result, permanencia: result2, laboratorios: result3});
                    });
                });
            });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
    }
    else {
        res.redirect("/");
    }
}

module.exports.getPermanencia = function (app, req, res) {
    if (req.session.loggedIn) {
        if (req.session.nivelUsuario == "1") {
            let id_usuario = req.session.usuario;
            let connection = app.config.dbConnection();
            let permanenciaModel = new app.app.models.PermanenciaDAO(connection);
            try {
                permanenciaModel.getPermanencia(id_usuario, function (error, result) {
                    res.render("tecnicos/atualizar_permanencia", {validacao: {}, permanencia: result});
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

module.exports.cadastroPermanencia = function (app, req, res) {
    if (req.session.loggedIn) {
        if (req.session.nivelUsuario == "1") {
            let id_usuario = req.session.usuario;
            let connection = app.config.dbConnection();
            let permanenciaModel = new app.app.models.PermanenciaDAO(connection);
            try {
                permanenciaModel.getPermanencia(id_usuario, function (error, result) {
                    res.render("tecnicos/cadastro_permanencia", {validacao: {}, permanencia: result});                });
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

module.exports.insertPermanencia = function (app, req, res) {
    let segunda_feira_manha = req.body.segunda_feira_manha;
    let terca_feira_manha = req.body.terca_feira_manha;
    let quarta_feira_manha = req.body.quarta_feira_manha;
    let quinta_feira_manha = req.body.quinta_feira_manha;
    let sexta_feira_manha = req.body.sexta_feira_manha;
    let segunda_feira_tarde = req.body.segunda_feira_tarde;
    let terca_feira_tarde = req.body.terca_feira_tarde;
    let quarta_feira_tarde = req.body.quarta_feira_tarde;
    let quinta_feira_tarde = req.body.quinta_feira_tarde;
    let sexta_feira_tarde = req.body.sexta_feira_tarde;
    let id_usuario = req.session.usuario;
    let connection = app.config.dbConnection();
    let permanenciaModel = new app.app.models.PermanenciaDAO(connection);

    req.assert("segunda_feira_manha", "0").notEmpty();
    req.assert("terca_feira_manha", "1").notEmpty();
    req.assert("quarta_feira_manha", "2").notEmpty();
    req.assert("quinta_feira_manha", "3").notEmpty();
    req.assert("sexta_feira_manha", "4").notEmpty();
    req.assert("segunda_feira_tarde", "5").notEmpty();
    req.assert("terca_feira_tarde", "6").notEmpty();
    req.assert("quarta_feira_tarde", "7").notEmpty();
    req.assert("quinta_feira_tarde", "8").notEmpty();
    req.assert("sexta_feira_tarde", "9").notEmpty();
    req.assert("segunda_feira_manha", "00").len(12, 14);
    req.assert("terca_feira_manha", "01").len(12, 14);
    req.assert("quarta_feira_manha", "02").len(12, 14);
    req.assert("quinta_feira_manha", "03").len(12, 14);
    req.assert("sexta_feira_manha", "04").len(12, 14);
    req.assert("segunda_feira_tarde", "05").len(12, 14);
    req.assert("terca_feira_tarde", "06").len(12, 14);
    req.assert("quarta_feira_tarde", "07").len(12, 14);
    req.assert("quinta_feira_tarde", "08").len(12, 14);
    req.assert("sexta_feira_tarde", "09").len(12, 14);

    let validacao = req.validationErrors();

    if (validacao) {
        permanenciaModel.getPermanencia(id_usuario, function (error, result) {
            res.render("tecnicos/cadastro_permanencia", {validacao, permanencia: result});
        });
        return;
    }

    let permanencia = {
        segunda_feira_manha,
        terca_feira_manha,
        quarta_feira_manha,
        quinta_feira_manha,
        sexta_feira_manha,
        segunda_feira_tarde,
        terca_feira_tarde,
        quarta_feira_tarde,
        quinta_feira_tarde,
        sexta_feira_tarde,
        id_usuario,
    }

    try {
        permanenciaModel.insertPermanencia(permanencia,  function (error, result) {
            res.redirect("/tecnicos");
        });
    } catch (error) {
        res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
    }
}

module.exports.updatePermanencia = function (app, req, res) {
    let segunda_feira_manha = req.body.segunda_feira_manha_atualizacao;
    let terca_feira_manha = req.body.terca_feira_manha_atualizacao;
    let quarta_feira_manha = req.body.quarta_feira_manha_atualizacao;
    let quinta_feira_manha = req.body.quinta_feira_manha_atualizacao;
    let sexta_feira_manha = req.body.sexta_feira_manha_atualizacao;
    let segunda_feira_tarde = req.body.segunda_feira_tarde_atualizacao;
    let terca_feira_tarde = req.body.terca_feira_tarde_atualizacao;
    let quarta_feira_tarde = req.body.quarta_feira_tarde_atualizacao;
    let quinta_feira_tarde = req.body.quinta_feira_tarde_atualizacao;
    let sexta_feira_tarde = req.body.sexta_feira_tarde_atualizacao;
    let id_usuario = req.session.usuario;
    let connection = app.config.dbConnection();
    let permanenciaModel = new app.app.models.PermanenciaDAO(connection);

    req.assert("segunda_feira_manha_atualizacao", "0").notEmpty();
    req.assert("terca_feira_manha_atualizacao", "1").notEmpty();
    req.assert("quarta_feira_manha_atualizacao", "2").notEmpty();
    req.assert("quinta_feira_manha_atualizacao", "3").notEmpty();
    req.assert("sexta_feira_manha_atualizacao", "4").notEmpty();
    req.assert("segunda_feira_tarde_atualizacao", "5").notEmpty();
    req.assert("terca_feira_tarde_atualizacao", "6").notEmpty();
    req.assert("quarta_feira_tarde_atualizacao", "7").notEmpty();
    req.assert("quinta_feira_tarde_atualizacao", "8").notEmpty();
    req.assert("sexta_feira_tarde_atualizacao", "9").notEmpty();
    req.assert("segunda_feira_manha_atualizacao", "00").len(12, 14);
    req.assert("terca_feira_manha_atualizacao", "01").len(12, 14);
    req.assert("quarta_feira_manha_atualizacao", "02").len(12, 14);
    req.assert("quinta_feira_manha_atualizacao", "03").len(12, 14);
    req.assert("sexta_feira_manha_atualizacao", "04").len(12, 14);
    req.assert("segunda_feira_tarde_atualizacao", "05").len(12, 14);
    req.assert("terca_feira_tarde_atualizacao", "06").len(12, 14);
    req.assert("quarta_feira_tarde_atualizacao", "07").len(12, 14);
    req.assert("quinta_feira_tarde_atualizacao", "08").len(12, 14);
    req.assert("sexta_feira_tarde_atualizacao", "09").len(12, 14);

    let validacao = req.validationErrors();

    if (validacao) {
        try {
            permanenciaModel.getPermanencia(id_usuario, function (error, result) {
                res.render("tecnicos/atualizar_permanencia", {validacao, permanencia: result});
            });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
        return;
    }

    let permanencia = {
        segunda_feira_manha,
        terca_feira_manha,
        quarta_feira_manha,
        quinta_feira_manha,
        sexta_feira_manha,
        segunda_feira_tarde,
        terca_feira_tarde,
        quarta_feira_tarde,
        quinta_feira_tarde,
        sexta_feira_tarde,
        id_usuario,
    }

    try {
        permanenciaModel.updatePermanencia(permanencia, function (error, result) {
            res.redirect("/tecnicos");
        });
    } catch (error) {
        res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
    }
}
