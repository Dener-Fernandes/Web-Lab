module.exports.getEquipamentos = function (app, req, res) {
    if (req.session.loggedIn) {
        let connection = app.config.dbConnection();
        let equipamentoModel = new app.app.models.EquipamentoDAO(connection);

        try {
            equipamentoModel.getEquipamentos(function (error, result) {
                res.render("itens/equipamentos", {nivelUsuario: req.session.nivelUsuario, equipamentos: result});
            });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
    }
    else {
        res.redirect("/");
    }
}

module.exports.getEquipamento = function (app, req, res) {
    if (req.session.loggedIn) {
        if (req.session.nivelUsuario == "1") {
            let id_equipamento = req.query.id_equipamento;
            let connection = app.config.dbConnection();
            let equipamentoModel = new app.app.models.EquipamentoDAO(connection);
            let laboratorioModel = new app.app.models.LaboratorioDAO(connection);

            try {
                equipamentoModel.getEquipamento(id_equipamento, function (error, result) {
                    laboratorioModel.getLaboratorios(function (error1, result1) {
                        res.render("itens/atualizar_itens", {validacaoEquipamento: {}, validacaoProduto: {}, produto: {}, equipamento: result, laboratorios: result1});
                    });
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

module.exports.searchEquipamento = function (app, req, res) {
    if (req.session.loggedIn) {
        let nome_equipamento = req.body.nome_equipamento;
        if (nome_equipamento) {
            let connection = app.config.dbConnection();
            let equipamentoModel = new app.app.models.EquipamentoDAO(connection);

            try {
                equipamentoModel.searchEquipamento(nome_equipamento, function (error, result) {
                    res.render("itens/equipamentos", {nivelUsuario: req.session.nivelUsuario, equipamentos: result});
                });
            } catch (error) {
                res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
            }
            
        }
        else {
            res.redirect("/equipamentos");
        }    
    }
    else {
        res.redirect("/");
    }
}

module.exports.insertEquipamento = function (app, req, res) {
    let nome_equipamento = req.body.nome_equipamento;
    let status_equipamento = req.body.status_equipamento;
    let quantidade_equipamento = req.body.quantidade_equipamento;
    let numero_patrimonio = req.body.numero_patrimonio;
    let pertence_laboratorio = req.body.pertence_laboratorio;
    let connection = app.config.dbConnection();
    let equipamentoModel = new app.app.models.EquipamentoDAO(connection);
    let laboratorioModel = new app.app.models.LaboratorioDAO(connection);

    req.assert("nome_equipamento", "0").notEmpty();
    req.assert("nome_equipamento", "1").len(4, 60);
    req.assert("quantidade_equipamento", "2").isNumeric();
    req.assert("quantidade_equipamento", "3").isInt();
    req.assert("numero_patrimonio", "4").notEmpty();
    req.assert("numero_patrimonio", "5").isNumeric();
    req.assert("numero_patrimonio", "6").isInt();
    req.assert("status_equipamento", "7").isIn(["DISPONÍVEL", "INDISPONÍVEL"]);
    req.assert("pertence_laboratorio", "8").isIn(["1", "2"]);

    let erros = req.validationErrors();
    let validacaoImgEquipamento = "";
    if (!req.files) {
        validacaoImgEquipamento = "0";
    }

    if (erros) {
        try {
            laboratorioModel.getLaboratorios( function (error, result) {
                res.render("itens/cadastro_itens", {validacaoImgEquipamento, validacaoEquipamento: erros, validacaoImgProduto: {}, validacaoProduto: {}, laboratorios: result});
            });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
        return;
    }

    if (validacaoImgEquipamento) {
        try {
            laboratorioModel.getLaboratorios( function (error, result) {
                res.render("itens/cadastro_itens", {validacaoImgEquipamento, validacaoEquipamento: erros, validacaoImgProduto: {}, validacaoProduto: {}, laboratorios: result});
            });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
        return;
    }

    let file = req.files.imagem_equipamento;
    let imagem_equipamento = file.name;

    let equipamento = {
        nome_equipamento,
        status_equipamento,
        imagem_equipamento,
        numero_patrimonio,
        quantidade_equipamento,
        pertence_laboratorio,
    }

    file.mv("./app/public/img/imagens-equipamentos/" + imagem_equipamento, function (error0){
        try {
            equipamentoModel.insertEquipamento(equipamento, function (error, result) {
                res.redirect("/equipamentos");
            });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
    });
}

module.exports.updateEquipamento = function (app, req, res) {
    let id_equipamento = req.body.id_equipamento;
    let nome_equipamento = req.body.nome_equipamento_atualizacao;
    let status_equipamento = req.body.status_equipamento_atualizacao;
    let quantidade_equipamento = req.body.quantidade_equipamento_atualizacao;
    let numero_patrimonio = req.body.numero_patrimonio_atualizacao;
    let pertence_laboratorio = req.body.pertence_laboratorio_atualizacao;
    let connection = app.config.dbConnection();
    let equipamentoModel = new app.app.models.EquipamentoDAO(connection);
    let laboratorioModel = new app.app.models.LaboratorioDAO(connection);

    req.assert("nome_equipamento_atualizacao", "0").notEmpty();
    req.assert("nome_equipamento_atualizacao", "1").len(4, 60);
    req.assert("quantidade_equipamento_atualizacao", "2").isNumeric();
    req.assert("quantidade_equipamento_atualizacao", "3").isInt();
    req.assert("numero_patrimonio_atualizacao", "4").notEmpty();
    req.assert("numero_patrimonio_atualizacao", "5").isNumeric();
    req.assert("numero_patrimonio_atualizacao", "6").isInt();
    req.assert("status_equipamento_atualizacao", "7").isIn(["DISPONÍVEL", "INDISPONÍVEL"]);
    req.assert("pertence_laboratorio_atualizacao", "8").isIn(["1", "2"]);

    let validacaoEquipamento = req.validationErrors();

    if (validacaoEquipamento) {
        try {
            laboratorioModel.getLaboratorios( function (error, result) {
                equipamentoModel.getEquipamento(id_equipamento, function (error1, result1) {
                    res.render("itens/atualizar_itens", {validacaoEquipamento, validacaoProduto: {}, produto: {}, laboratorios: result, equipamento: result1});
                });
            });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
        return;
    }

    if (req.files) {
        let file = req.files.imagem_equipamento;
        let imagem_equipamento = file.name;

        let equipamento = {
            id_equipamento,
            nome_equipamento,
            status_equipamento,
            imagem_equipamento,
            numero_patrimonio,
            quantidade_equipamento,
            pertence_laboratorio,
        }

        file.mv("./app/public/img/imagens-equipamentos/" + imagem_equipamento, function (error0){
            try {
                equipamentoModel.updateEquipamento(equipamento, function (error, result) {
                    res.redirect("/equipamentos");
                });
            } catch (error) {
                res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
            }
        });
        return;
    }

    let equipamento = {
        id_equipamento,
        nome_equipamento,
        status_equipamento,
        imagem_equipamento: req.body.imagem_padrao,
        numero_patrimonio,
        quantidade_equipamento,
        pertence_laboratorio,
    }
    
    try {
        equipamentoModel.updateEquipamento(equipamento, function (error, result) {
            res.redirect("/equipamentos");
        });
    } catch (error) {
        res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
    }
}

module.exports.deleteEquipamento = function (app, req, res) {
    let id_equipamento = req.body.id_excluir_equipamento;
    let connection = app.config.dbConnection();
    let equipamentoModel = new app.app.models.EquipamentoDAO(connection);

    try {
        equipamentoModel.deleteEquipamento(id_equipamento, function (error, result) {
            res.redirect("/equipamentos");
        });
    } catch (error) {
        res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
    }
}