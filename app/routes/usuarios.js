module.exports = function (app){
    app.get("/usuario", function (req, res){
        app.app.controllers.usuarios.perfilUsuario(app, req, res);
    });

    app.get("/lista_usuarios", function (req, res){
        app.app.controllers.usuarios.getUsuarios(app, req, res);
    });

    app.post("/cadastro_usuario", function (req, res) {
        app.app.controllers.usuarios.insertUsuario(app, req, res);
    });

    app.get("/cadastro_usuario", function (req, res) {
        app.app.controllers.index.Index(app, req, res);
    });

    app.post("/efetuar_cadastro_usuario", function (req, res) {
        app.app.controllers.usuarios.insertCadastroUsuario(app, req, res);
    });

    app.get("/efetuar_cadastro_usuario", function (req, res) {
        app.app.controllers.usuarios.paginaCadastroUsuarios(app, req, res);
    });
    
    app.post("/efetuar_cadastro_adm", function (req, res) {
        app.app.controllers.usuarios.insertCadastroAdm(app, req, res);
    });

    app.get("/efetuar_cadastro_adm", function (req, res) {
        app.app.controllers.usuarios.paginaCadastroUsuarios(app, req, res);
    });

    app.get("/pagina_cadastro_usuarios", function (req, res) {
        app.app.controllers.usuarios.paginaCadastroUsuarios(app, req, res);
    });

    app.post("/search_usuario", function (req, res) {
        app.app.controllers.usuarios.searchUsuario(app, req, res);
    });

    app.get("/dados_perfil", function (req, res) {
        app.app.controllers.usuarios.getUsuario(app, req, res);
    });

    app.post("/atualizar_usuario", function (req, res) {
        app.app.controllers.usuarios.updateUsuario(app, req, res);
    });

    app.get("/atualizar_usuario", function (req, res) {
        app.app.controllers.usuarios.perfilUsuario(app, req, res)
    });

    app.post("/excluir_usuario", function (req, res) {
        app.app.controllers.usuarios.deleteUsuario(app, req, res);
    });
}

