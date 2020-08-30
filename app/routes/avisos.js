module.exports = function (app){
    app.get("/mural_avisos", function (req, res){
        app.app.controllers.avisos.getAvisos(app, req, res);
    });
    
    app.get("/cadastro_avisos", function (req, res) {
        app.app.controllers.avisos.cadastroAvisos(app, req, res);
    });

    app.post("/cadastrar_aviso", function (req, res) {
        app.app.controllers.avisos.insertAviso(app, req, res);
    });

    app.get("/cadastrar_aviso", function (req, res) {
        app.app.controllers.avisos.cadastroAvisos(app, req, res);
    });

    app.get("/atualizacao_avisos", function (req, res) {
        app.app.controllers.avisos.atualizacaoAvisos(app, req, res);
    });

    app.post("/atualizar_aviso", function (req, res) {
        app.app.controllers.avisos.updateAviso(app, req, res);
    });
    
    app.get("/atualizar_aviso", function (req, res) {
        app.app.controllers.avisos.getAvisos(app, req, res);
    });

    app.post("/excluir_aviso", function (req, res) {
        app.app.controllers.avisos.deleteAviso(app, req, res);
    });
}