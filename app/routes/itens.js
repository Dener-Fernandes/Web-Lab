module.exports = function (app) {
    app.get("/equipamentos", function (req, res) {
        app.app.controllers.equipamentos.getEquipamentos(app, req, res);
    });

    app.post("/search_equipamento", function (req, res) {
        app.app.controllers.equipamentos.searchEquipamento(app, req, res);
    });

    app.post("/cadastrar_equipamento", function (req, res) {
        app.app.controllers.equipamentos.insertEquipamento(app, req, res);
    });

    app.get("/cadastrar_equipamento", function (req, res) {
        app.app.controllers.itens.cadastroItens(app, req, res);
    });

    app.get("/dados_equipamento", function (req, res) {
        app.app.controllers.equipamentos.getEquipamento(app, req, res);
    });

    app.post("/atualizar_equipamento", function (req, res) {
        app.app.controllers.equipamentos.updateEquipamento(app, req, res);
    });

    app.get("/atualizar_equipamento", function (req, res) {
        app.app.controllers.equipamentos.getEquipamentos(app, req, res);
    });

    app.post("/excluir_equipamento", function (req, res) {
        app.app.controllers.equipamentos.deleteEquipamento(app, req, res);
    });

    app.get("/produtos", function (req, res) {
        app.app.controllers.produtos.getProdutos(app, req, res);
    });

    app.post("/search_produto", function (req, res) {
        app.app.controllers.produtos.searchProduto(app, req, res);
    });

    app.get("/cadastro_itens", function (req, res) {
        app.app.controllers.itens.cadastroItens(app, req, res);
    });

    app.post("/cadastrar_produto", function (req, res) {
        app.app.controllers.produtos.insertProduto(app, req, res);
    });

    app.get("/cadastrar_produto", function (req, res) {
        app.app.controllers.itens.cadastroItens(app, req, res);
    });

    app.get("/dados_produto", function (req, res) {
        app.app.controllers.produtos.getProduto(app, req, res);
    });

    app.post("/atualizar_produto", function (req, res) {
        app.app.controllers.produtos.updateProduto(app, req, res);
    });

    app.get("/atualizar_produto", function (req, res) {
        app.app.controllers.produtos.getProdutos(app, req, res);
    });

    app.post("/excluir_produto", function (req, res) {
        app.app.controllers.produtos.deleteProduto(app, req, res);
    });    
}