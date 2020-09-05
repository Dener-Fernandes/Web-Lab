module.exports = function (app){
    app.get("/", function (req, res){
        app.app.controllers.index.Index(app, req, res);
    });

    app.post("/login", function (req, res) {
        app.app.controllers.index.Login(app, req, res);
    });
    
    app.get("/login", function (req, res) {
        app.app.controllers.index.Index(app, req, res);
    });

    app.post("/logout", function (req, res) {
        app.app.controllers.index.Logout(app, req, res);
    });
}