module.exports.cadastroItens = function (app, req, res) {
    if (req.session.loggedIn) {
        if (req.session.nivelUsuario == "1") {
            let connection = app.config.dbConnection();
            let laboratorioModel = new app.app.models.LaboratorioDAO(connection);

            try {
                laboratorioModel.getLaboratorios( function (error, result) {
                    res.render("itens/cadastro_itens", {validacaoImgEquipamento: {},validacaoEquipamento: {}, validacaoImgProduto: {}, validacaoProduto: {}, laboratorios: result});
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