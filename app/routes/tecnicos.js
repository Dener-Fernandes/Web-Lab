module.exports = function (app){
    app.get("/tecnicos", function (req, res){
        app.app.controllers.tecnicos.getTecnicos(app, req, res);
    });

    app.get("/cadastro_permanencia", function (req, res) {
        app.app.controllers.tecnicos.cadastroPermanencia(app, req, res);
    });

    app.post("/cadastrar_permanencia", function (req, res) {
        app.app.controllers.tecnicos.insertPermanencia(app, req, res);
    });

    app.get("/cadastrar_permanencia", function (req, res) {
        app.app.controllers.tecnicos.cadastroPermanencia(app, req, res);
    });

    app.get("/atualizacao_permanencia", function (req, res) {
        app.app.controllers.tecnicos.getPermanencia(app, req, res);
    });

    app.post("/atualizar_permanencia", function (req, res) {
        app.app.controllers.tecnicos.updatePermanencia(app, req, res);
    });

    app.get("/atualizar_permanencia", function (req, res) {
        app.app.controllers.tecnicos.getPermanencia(app, req, res);
    });
}