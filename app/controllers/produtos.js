module.exports.getProdutos = function (app, req, res) {
    if (req.session.loggedIn) {
        let connection = app.config.dbConnection();
        let produtoModel = new app.app.models.ProdutoDAO(connection);

        try {
            produtoModel.getProdutos(function (error, result) {
                res.render("itens/produtos", {nivelUsuario: req.session.nivelUsuario, produtos: result});
            });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
    }
    else {
        res.redirect("/");
    }
}

module.exports.getProduto = function (app, req, res) {
    if (req.session.loggedIn) {
        if (req.session.nivelUsuario == "1") {
            let id_produto = req.query.id_produto;
            let connection = app.config.dbConnection();
            let laboratorioModel = new app.app.models.LaboratorioDAO(connection);
            let produtoModel = new app.app.models.ProdutoDAO(connection);

            try {
                laboratorioModel.getLaboratorios(function (error, result) {
                    produtoModel.getProduto(id_produto, function (error1, result1) {
                        res.render("itens/atualizar_itens", {validacaoEquipamento: {}, validacaoProduto: {}, equipamento: {}, laboratorios: result, produto: result1});
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

module.exports.searchProduto = function (app, req, res) {
    if (req.session.loggedIn) {
        let nome_produto = req.body.nome_produto;
        if (nome_produto) {
            let connection = app.config.dbConnection();
            let produtoModel = new app.app.models.ProdutoDAO(connection);

            try {
                produtoModel.searchProduto(nome_produto, function (error, result) {
                    res.render("itens/produtos", {nivelUsuario: req.session.nivelUsuario, produtos: result});
                });
            } catch (error) {
                res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
            }
        }
        else {
            res.redirect("/produtos");
        }    
    }
    else {
        res.redirect("/");
    }
}

module.exports.insertProduto = function (app, req, res) {
    let nome_produto = req.body.nome_produto;
    let status_produto = req.body.status_produto;
    let quantidade_produto = req.body.quantidade_produto;
    let formula_produto = req.body.formula_produto;
    let pertence_laboratorio = req.body.pertence_laboratorio;
    let connection = app.config.dbConnection();
    let produtoModel = new app.app.models.ProdutoDAO(connection);
    let laboratorioModel = new app.app.models.LaboratorioDAO(connection);

    req.assert("nome_produto", "0").notEmpty();
    req.assert("nome_produto", "1").len(4, 60);
    req.assert("quantidade_produto", "2").notEmpty();
    req.assert("quantidade_produto", "3").isNumeric();
    req.assert("quantidade_produto", "4").isInt();
    req.assert("formula_produto", "5").notEmpty();
    req.assert("status_produto", "6").isIn(["DISPONÍVEL", "INDISPONÍVEL"]);
    req.assert("pertence_laboratorio", "7").isIn(["1", "2"]);

    let erros = req.validationErrors();
    let validacaoImgProduto = "";
    if (!req.files) {
        validacaoImgProduto = "0";
    }

    if (erros) {
        try {
            laboratorioModel.getLaboratorios( function (error, result) {
                res.render("itens/cadastro_itens", {validacaoImgEquipamento: {},validacaoEquipamento: {}, validacaoImgProduto, validacaoProduto: erros, laboratorios: result});
            });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
        return;
    }

    if (validacaoImgProduto) {
        try {
            laboratorioModel.getLaboratorios( function (error, result) {
                res.render("itens/cadastro_itens", {validacaoImgEquipamento: {},validacaoEquipamento: {}, validacaoImgProduto, validacaoProduto: erros, laboratorios: result});
            });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
        return;     
    }

    let file = req.files.imagem_produto;
    let imagem_produto = file.name;

    let produto = {
        nome_produto,
        status_produto,
        imagem_produto,
        formula_produto,
        quantidade_produto,
        pertence_laboratorio,
    }

    file.mv("./app/public/img/imagens-produtos/" + imagem_produto, function (error0){
        try {
            produtoModel.insertProduto(produto, function (error, result) {
                res.redirect("/produtos");
            });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
    });
}

module.exports.updateProduto = function (app, req, res) {
    let id_produto = req.body.id_produto;
    let nome_produto = req.body.nome_produto_atualizacao;
    let status_produto = req.body.status_produto_atualizacao;
    let quantidade_produto = req.body.quantidade_produto_atualizacao;
    let formula_produto = req.body.formula_produto_atualizacao;
    let pertence_laboratorio = req.body.pertence_laboratorio_atualizacao;
    let connection = app.config.dbConnection();
    let produtoModel = new app.app.models.ProdutoDAO(connection);
    let laboratorioModel = new app.app.models.LaboratorioDAO(connection);

    req.assert("nome_produto_atualizacao", "0").notEmpty();
    req.assert("nome_produto_atualizacao", "1").len(4, 60);
    req.assert("quantidade_produto_atualizacao", "2").notEmpty();
    req.assert("quantidade_produto_atualizacao", "3").isNumeric();
    req.assert("quantidade_produto_atualizacao", "4").isInt();
    req.assert("formula_produto_atualizacao", "5").notEmpty();
    req.assert("status_produto_atualizacao", "6").isIn(["DISPONÍVEL", "INDISPONÍVEL"]);
    req.assert("pertence_laboratorio_atualizacao", "7").isIn(["1", "2"]);

    let validacaoProduto = req.validationErrors();

    if (validacaoProduto) {
        try {
            laboratorioModel.getLaboratorios( function (error, result) {
                produtoModel.getProduto(id_produto, function (error1, result1) {
                    res.render("itens/atualizar_itens", {validacaoEquipamento: {}, validacaoProduto, equipamento: {}, laboratorios: result, produto: result1});
                });
            });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
        return;
    }

    if (req.files) {
        let file = req.files.imagem_produto;
        let imagem_produto = file.name;

        let produto = {
            id_produto,
            nome_produto,
            status_produto,
            imagem_produto,
            formula_produto,
            quantidade_produto,
            pertence_laboratorio,
        }

        file.mv("./app/public/img/imagens-produtos/" + imagem_produto, function (error0){
            try {
                produtoModel.updateProduto(produto, function (error, result) {
                    res.redirect("/produtos");
                });
            } catch (error) {
                res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
            }
        });
        return;
    }

    let produto = {
        id_produto,
        nome_produto,
        status_produto,
        imagem_produto: req.body.imagem_padrao,
        formula_produto,
        quantidade_produto,
        pertence_laboratorio,
    }

    try {
        produtoModel.updateProduto(produto, function (error, result) {
            res.redirect("/produtos");
        });
    } catch (error) {
        res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
    }
}

module.exports.deleteProduto = function (app, req, res) {
    let id_produto = req.body.id_excluir_produto;
    let connection = app.config.dbConnection();
    let produtoModel = new app.app.models.ProdutoDAO(connection);

    try {
        produtoModel.deleteProduto(id_produto, function (error, result) {
            res.redirect("/produtos");
        });
    } catch (error) {
        res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
    }
}