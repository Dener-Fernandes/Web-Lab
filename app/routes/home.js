module.exports = function (app){
    app.get("/home", function (req, res){
        app.app.controllers.home.Home(app, req, res);
    });

    app.get("/area_administrador", function (req, res) {
        app.app.controllers.home.getHomeInfo(app, req, res);
    });

    app.post("/atualizar_laboratorio0", function (req, res) {
        app.app.controllers.home.updateLaboratorio0(app, req, res);
    });
    app.get("/atualizar_laboratorio0", function (req, res) {
        app.app.controllers.home.getHomeInfo(app, req, res);
    });
    app.post("/atualizar_laboratorio1", function (req, res) {
        app.app.controllers.home.updateLaboratorio1(app, req, res);
    });
    app.get("/atualizar_laboratorio1", function (req, res) {
        app.app.controllers.home.getHomeInfo(app, req, res);
    });
}