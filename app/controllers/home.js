module.exports.Home = function (app, req, res) {
    if (req.session.loggedIn) {
        let connection = app.config.dbConnection();
        let laboratorioModel = new app.app.models.LaboratorioDAO(connection);
        
        try {
            laboratorioModel.getLaboratorios(function (error, result) {
                res.render("home/home", {nivelUsuario: req.session.nivelUsuario, laboratorios: result});
            });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
    }
    else {
        res.redirect("/");
    }
}

module.exports.getHomeInfo = function (app, req, res) {
    if (req.session.loggedIn) {
        if (req.session.nivelUsuario == "1") {
            let connection = app.config.dbConnection();
            let laboratorioModel = new app.app.models.LaboratorioDAO(connection);
            let usuarioModel = new app.app.models.UsuarioDAO(connection);

            try {
                laboratorioModel.getLaboratorios(function (error, result) {
                    usuarioModel.getTecnicos(function (error2, result2) {
                        res.render("home/ajustes_home", {nivelUsuario: req.session.nivelUsuario, validacaoLab0: {}, validacaoLab1: {}, laboratorios: result, tecnicos: result2});
                    });
                });
            } catch (error) {
                res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
            }
        }
    }
    else {
        res.redirect("/");
    }
}

module.exports.updateLaboratorio0 = function (app, req, res) {
    let id_laboratorio = req.body.id_laboratorio;
    let descricao_laboratorio = req.body.descricao_laboratorio_atualizacao;
    let id_usuario = req.body.id_tecnico_laboratorio;
    let connection = app.config.dbConnection();
    let laboratorioModel = new app.app.models.LaboratorioDAO(connection);
    let usuarioModel = new app.app.models.UsuarioDAO(connection);
    let validacaoLab0;
 
    req.assert("descricao_laboratorio_atualizacao", "0").notEmpty();
    validacaoLab0 = req.validationErrors();

    if (validacaoLab0) {
        try {
            laboratorioModel.getLaboratorios(function (error, result) {
                usuarioModel.getTecnicos(function (error2, result2) {
                    res.render("home/ajustes_home", {nivelUsuario: req.session.nivelUsuario, validacaoLab0, validacaoLab1: {}, laboratorios: result, tecnicos: result2});
                });
            });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
        return;
    }

    if (req.body.novo_tecnico_laboratorio) {
        id_usuario = req.body.novo_tecnico_laboratorio;
    }
    if (req.files) {
        let file = req.files.imagem_laboratorio;
        let imagem_laboratorio = file.name;

        let laboratorio = {
            id_laboratorio,
            imagem_laboratorio,
            descricao_laboratorio,
            id_usuario,
        }

        file.mv("./app/public/img/imagens-home/" + imagem_laboratorio, function (error0){
            try {
                laboratorioModel.updateLaboratorio(laboratorio, function (error, result) {
                    res.redirect("/home");
                });
            } catch (error) {
                res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
            }
        });
        return;
    }

    let laboratorio = {
        id_laboratorio,
        imagem_laboratorio: req.body.imagem_padrao,
        descricao_laboratorio,
        id_usuario,
    }

    try {
        laboratorioModel.updateLaboratorio(laboratorio, function (error, result) {
            res.redirect("/home");
        });
    } catch (error) {
        res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
    }
}
module.exports.updateLaboratorio1 = function (app, req, res) {
    let id_laboratorio = req.body.id_laboratorio;
    let descricao_laboratorio = req.body.descricao_laboratorio_atualizacao;
    let id_usuario = req.body.id_tecnico_laboratorio;
    let connection = app.config.dbConnection();
    let laboratorioModel = new app.app.models.LaboratorioDAO(connection);
    let usuarioModel = new app.app.models.UsuarioDAO(connection);
    let validacaoLab1;

    req.assert("descricao_laboratorio_atualizacao", "0").notEmpty();
    validacaoLab1 = req.validationErrors();

    if (validacaoLab1) {
        try {
            laboratorioModel.getLaboratorios(function (error, result) {
                usuarioModel.getTecnicos(function (error2, result2) {
                    res.render("home/ajustes_home", {nivelUsuario: req.session.nivelUsuario, validacaoLab1, validacaoLab0: {}, laboratorios: result, tecnicos: result2});
                });
            });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
        return;
    }

    if (req.body.novo_tecnico_laboratorio) {
        id_usuario = req.body.novo_tecnico_laboratorio;
    }
    if (req.files) {
        let file = req.files.imagem_laboratorio;
        let imagem_laboratorio = file.name;

        let laboratorio = {
            id_laboratorio,
            imagem_laboratorio,
            descricao_laboratorio,
            id_usuario,
        }

        file.mv("./app/public/img/imagens-home/" + imagem_laboratorio, function (error0){
            try {
                laboratorioModel.updateLaboratorio(laboratorio, function (error, result) {
                    res.redirect("/home");
                });
            } catch (error) {
                res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
            }
        });
        return;
    }

    let laboratorio = {
        id_laboratorio,
        imagem_laboratorio: req.body.imagem_padrao,
        descricao_laboratorio,
        id_usuario,
    }

    try {
        laboratorioModel.updateLaboratorio(laboratorio, function (error, result) {
            res.redirect("/home");
        });
    } catch (error) {
        res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
    }
}