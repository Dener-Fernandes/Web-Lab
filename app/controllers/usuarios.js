module.exports.getUsuarios = function (app, req, res) {
    if (req.session.loggedIn) {
        if (req.session.nivelUsuario == "1") {
            let connection = app.config.dbConnection();
            let usuarioModel = new app.app.models.UsuarioDAO(connection);

            try {
                usuarioModel.getUsuarios(function (error, result) {
                    res.render("usuarios/lista_usuarios", {usuarios: result });
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

module.exports.getUsuario = function (app, req, res) {
    if (req.session.loggedIn) {
        let id_usuario = req.query.id_usuario;
        if (req.session.usuario == id_usuario || req.session.nivelUsuario == "1") {
            let connection = app.config.dbConnection();
            let usuarioModel = new app.app.models.UsuarioDAO(connection);

            try {
                usuarioModel.getUsuario(id_usuario, function (errro, result) {
                    res.render("usuarios/atualizar_usuario", {nivelUsuario: req.session.nivelUsuario, usuario: result, validacaoUsuario: {}, validacaoCpf: {}});
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
        res.redirect()
    }
}

module.exports.perfilUsuario = function (app, req, res) {
    if (req.session.loggedIn) {
        let connection = app.config.dbConnection();
        let usuarioModel = new app.app.models.UsuarioDAO(connection);
        let id_usuario = req.session.usuario;

        try {
            usuarioModel.getUsuario(id_usuario, function (error, result) {
                res.render("usuarios/usuario", {nivelUsuario: req.session.nivelUsuario, usuario: result});
            });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
    }
    else {
        res.redirect("/");
    }
}

module.exports.searchUsuario = function (app, req, res) {
    if (req.session.loggedIn) {
        if (req.session.nivelUsuario == "1") {
            let nome_usuario = req.body.nome_usuario;
            if (nome_usuario) {
                let connection = app.config.dbConnection();
                let usuarioModel = new app.app.models.UsuarioDAO(connection);
                try {
                    usuarioModel.searchUsuario(nome_usuario, function (error, result) {
                        res.render("usuarios/lista_usuarios", {nivelUsuario: req.session.nivelUsuario, usuarios: result});
                    });
                } catch (error) {
                    res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
                }
            }
            else {
                res.redirect("/lista_usuarios");
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

module.exports.insertUsuario = function (app, req, res) {
    let nome_usuario = req.body.nome_usuario_cadastro;
    let cpf_usuario = req.body.cpf_usuario_cadastro;
    let email_usuario = req.body.email_usuario_cadastro;
    let confirmar_email_usuario = req.body.confirmar_email_usuario_cadastro;
    let senha_usuario = req.body.senha_usuario_cadastro;
    let confirmar_senha_usuario = req.body.confirmar_senha_usuario_cadastro;
    let status_usuario = "ATIVADO";
    let connection = app.config.dbConnection();
    let usuarioModel = new app.app.models.UsuarioDAO(connection);

    req.assert("nome_usuario_cadastro", "0").notEmpty();
    req.assert("nome_usuario_cadastro", "1").len(5, 60);
    req.assert("cpf_usuario_cadastro", "2").notEmpty();
    req.assert("email_usuario_cadastro", "3").notEmpty();
    req.assert("email_usuario_cadastro", "4").len(5, 60);
    req.assert("email_usuario_cadastro", "5").isEmail();
    req.assert("confirmar_email_usuario_cadastro", "6").notEmpty();
    req.assert("confirmar_email_usuario_cadastro", "7").len(5, 60);
    req.assert("confirmar_email_usuario_cadastro", "8").isEmail();
    req.assert("senha_usuario_cadastro", "9").notEmpty();
    req.assert("senha_usuario_cadastro", "10").len(8, 60);
    req.assert("confirmar_senha_usuario_cadastro", "11").notEmpty();
    req.assert("confirmar_senha_usuario_cadastro", "12").len(8, 60);

    let validacao;
    validacao = req.validationErrors();
    let cpfs = ["00000000000", "11111111111", "22222222222", "33333333333", "44444444444",
        "55555555555", "66666666666", "77777777777", "88888888888", "99999999999"];
    let soma = 0;
    let resto = 0;
    let validacaoCpf = "";
    let validacaoEmail = "";
    let validacaoSenha = "";
    let resultado = "";


    let x = cpfs.indexOf(cpf_usuario);

    if (x != -1) {
        validacaoCpf = "0";
    }
    else {
        for (i = 1; i <= 9; i++) {
            soma += parseInt(cpf_usuario.substring(i - 1, i)) * (11 - i);
            resto = (soma * 10) % 11;
        }
        if (resto == 10 || resto == 11) {
            resto = 0;
        }
        if (resto != parseInt(cpf_usuario.substring(9, 10))) {
            validacaoCpf = "0";
        }

        soma = 0;
        for (i = 1; i <= 10; i++) {
            soma += parseInt(cpf_usuario.substring(i - 1, i)) * (12 - i);
            resto = (soma * 10) % 11;
        }
        if (resto == 10 || resto == 11) {
            resto = 0;
        }
        if (resto != parseInt(cpf_usuario.substring(10, 11))) {
            validacaoCpf = "0";
        }
    }

    if (email_usuario.length > 5 && confirmar_email_usuario.length > 5) {
        if (email_usuario != confirmar_email_usuario) {
            validacaoEmail = "1";
        }
    }

    if (senha_usuario.length > 8 && confirmar_senha_usuario.length > 8) {
        if (senha_usuario != confirmar_senha_usuario) {
            validacaoSenha = "2";
        }
    }

    if (validacao) {
        res.render("home/index", {resultado, validacao, validacaoCpf, validacaoEmail, validacaoSenha, cadastrado: false, cpfCadastrado: {}});
        return;
    }
    if (validacaoCpf || validacaoEmail || validacaoSenha) {
        res.render("home/index", {resultado, validacao, validacaoCpf, validacaoEmail, validacaoSenha, cadastrado: false, cpfCadastrado: {}});
        return;
    }

    let usuario = {
        status_usuario,
        nome_usuario,
        cpf_usuario,
        email_usuario,
        senha_usuario,
        imagem_usuario: "usuario-padrao.png",
        nivel_usuario: 2,
    }

    try {
        usuarioModel.getUsuarios(function (error, result) {
            for (let i = 0; i < result1.length; i++) {
                if (result[i].cpf_usuario == usuario.cpf_usuario) {
                    res.render("home/index", {resultado: {}, validacao: {}, validacaoCpf: {}, validacaoEmail: {}, validacaoSenha: {}, cadastrado: false, cpfCadastrado: "1"});
                    return;
                }
            }
            usuarioModel.insertUsuario(usuario, function (error2, result2) {
                res.render("home/index", {resultado: {}, validacao: {}, validacaoCpf: {}, validacaoEmail: {}, validacaoSenha: {}, cadastrado: true, cpfCadastrado: {}});
            });
        });
        
    } catch (error) {
        res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
    }
}

module.exports.paginaCadastroUsuarios = function (app, req, res) {
    if (req.session.loggedIn) {
        if (req.session.nivelUsuario == "1") {

            res.render("usuarios/cadastro_usuarios", {validacaoImgUsuario: {}, validacaoUsuario: {}, validacaoCpfUsuario: {}, validacaoEmailUsuario: {}, validacaoSenhaUsuario: {}, validacaoImgAdm: {}, validacaoAdm: {}, validacaoCpfAdm: {}, validacaoEmailAdm: {}, validacaoSenhaAdm: {}, cpfCadastradoUsuarioComum: {}, cpfCadastradoAdm: {}});
        }
        else {
            res.redirect("/home");
        }
    }
    else {
        res.redirect("/");
    }
}

module.exports.insertCadastroUsuario = function (app, req, res) {
    let nome_usuario = req.body.nome_usuario_cadastro;
    let cpf_usuario = req.body.cpf_usuario_cadastro;
    let email_usuario = req.body.email_usuario_cadastro;
    let confirmar_email_usuario = req.body.confirmar_email_usuario_cadastro;
    let senha_usuario = req.body.senha_usuario_cadastro;
    let confirmar_senha_usuario = req.body.confirmar_senha_usuario_cadastro;
    let nivel_usuario = req.body.nivel_usuario;
    let status_usuario = "ATIVADO";
    let connection = app.config.dbConnection();
    let usuarioModel = new app.app.models.UsuarioDAO(connection);

    req.assert("nome_usuario_cadastro", "0").notEmpty();
    req.assert("nome_usuario_cadastro", "1").len(5, 60);
    req.assert("cpf_usuario_cadastro", "2").notEmpty();
    req.assert("email_usuario_cadastro", "3").notEmpty();
    req.assert("email_usuario_cadastro", "4").len(5, 60);
    req.assert("email_usuario_cadastro", "5").isEmail();
    req.assert("confirmar_email_usuario_cadastro", "6").notEmpty();
    req.assert("confirmar_email_usuario_cadastro", "7").len(5, 60);
    req.assert("confirmar_email_usuario_cadastro", "8").isEmail();
    req.assert("senha_usuario_cadastro", "9").notEmpty();
    req.assert("senha_usuario_cadastro", "10").len(8, 60);
    req.assert("confirmar_senha_usuario_cadastro", "11").notEmpty();
    req.assert("confirmar_senha_usuario_cadastro", "12").len(8, 60);
    req.assert("nivel_usuario", "13").isIn(["2"]);

    let validacaoUsuario;
    validacaoUsuario = req.validationErrors();
    let cpfs = ["00000000000", "11111111111", "22222222222", "33333333333", "44444444444",
        "55555555555", "66666666666", "77777777777", "88888888888", "99999999999"];
    let soma = 0;
    let resto = 0;
    let validacaoCpfUsuario = "";
    let validacaoEmailUsuario = "";
    let validacaoSenhaUsuario = "";
    
    let validacaoImgUsuario = "";
    if (!req.files) {
        validacaoImgUsuario = "0";
    }

    let x = cpfs.indexOf(cpf_usuario);

    if (x != -1) {
        validacaoCpfUsuario = "0";
    }
    else {
        for (i = 1; i <= 9; i++) {
            soma += parseInt(cpf_usuario.substring(i - 1, i)) * (11 - i);
            resto = (soma * 10) % 11;
        }
        if (resto == 10 || resto == 11) {
            resto = 0;
        }
        if (resto != parseInt(cpf_usuario.substring(9, 10))) {
            validacaoCpfUsuario = "0";
        }

        soma = 0;
        for (i = 1; i <= 10; i++) {
            soma += parseInt(cpf_usuario.substring(i - 1, i)) * (12 - i);
            resto = (soma * 10) % 11;
        }
        if (resto == 10 || resto == 11) {
            resto = 0;
        }
        if (resto != parseInt(cpf_usuario.substring(10, 11))) {
            validacaoCpfUsuario = "0";
        }
    }

    if (email_usuario.length > 5 && confirmar_email_usuario.length > 5) {
       
        if (email_usuario != confirmar_email_usuario) {
            validacaoEmailUsuario = "1";
        }
    }

    if (senha_usuario.length > 8 && confirmar_senha_usuario.length > 8) {
        if (senha_usuario != confirmar_senha_usuario) {
            validacaoSenhaUsuario = "2";
        }
    }

    if (validacaoUsuario) {
        res.render("usuarios/cadastro_usuarios", {validacaoImgUsuario, validacaoUsuario, validacaoCpfUsuario, validacaoEmailUsuario, validacaoSenhaUsuario, validacaoImgAdm: {}, validacaoAdm: {}, validacaoCpfAdm: {}, validacaoEmailAdm: {}, validacaoSenhaAdm: {}, cpfCadastradoUsuarioComum: {}, cpfCadastradoAdm: {}});
        return;
    }
    if (validacaoCpfUsuario || validacaoEmailUsuario || validacaoSenhaUsuario) {
        res.render("usuarios/cadastro_usuarios", {validacaoImgUsuario, validacaoUsuario, validacaoCpfUsuario, validacaoEmailUsuario, validacaoSenhaUsuario, validacaoImgAdm: {}, validacaoAdm: {}, validacaoCpfAdm: {}, validacaoEmailAdm: {}, validacaoSenhaAdm: {}, cpfCadastradoUsuarioComum: {}, cpfCadastradoAdm: {}});
        return;
    }
    if (validacaoImgUsuario) {
        res.render("usuarios/cadastro_usuarios", {validacaoImgUsuario, validacaoUsuario, validacaoCpfUsuario, validacaoEmailUsuario, validacaoSenhaUsuario, validacaoImgAdm: {}, validacaoAdm: {}, validacaoCpfAdm: {}, validacaoEmailAdm: {}, validacaoSenhaAdm: {}, cpfCadastradoUsuarioComum: {}, cpfCadastradoAdm: {}});
        return
    }

    let file = req.files.imagem_usuario;
    let imagem_usuario = file.name;

    let usuario = {
        status_usuario,
        nome_usuario,
        cpf_usuario,
        email_usuario,
        senha_usuario,
        imagem_usuario,
        nivel_usuario,
    }

    try {
        usuarioModel.getUsuarios(function (error, result) {
            for (let i = 0; i < result.length; i++) {
                if (result[i].cpf_usuario == usuario.cpf_usuario) { 
                    res.render("usuarios/cadastro_usuarios", {validacaoImgUsuario: {}, validacaoUsuario: {}, validacaoCpfUsuario: {}, validacaoEmailUsuario: {}, validacaoSenhaUsuario: {}, validacaoImgAdm: {}, validacaoAdm: {}, validacaoCpfAdm: {}, validacaoEmailAdm: {}, validacaoSenhaAdm: {}, cpfCadastradoUsuarioComum: "1", cpfCadastradoAdm: {}});
                    return;
                }
            }
            file.mv("./app/public/img/imagens-usuarios/" + imagem_usuario, function (error0) {
                usuarioModel.insertUsuario(usuario, function (error2, result2) {
                    res.redirect("/lista_usuarios");
                });
            });
        });
    } catch (error) {
        res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
    }
}

module.exports.insertCadastroAdm = function (app, req, res) {
    let nome_usuario = req.body.nome_adm_cadastro;
    let cpf_usuario = req.body.cpf_adm_cadastro;
    let email_usuario = req.body.email_adm_cadastro;
    let confirmar_email_usuario = req.body.confirmar_email_adm_cadastro;
    let senha_usuario = req.body.senha_adm_cadastro;
    let confirmar_senha_usuario = req.body.confirmar_senha_adm_cadastro;
    let nivel_usuario = req.body.nivel_adm;
    let status_usuario = "ATIVADO";
    let connection = app.config.dbConnection();
    let usuarioModel = new app.app.models.UsuarioDAO(connection);

    req.assert("nome_adm_cadastro", "0").notEmpty();
    req.assert("nome_adm_cadastro", "1").len(5, 60);
    req.assert("cpf_adm_cadastro", "2").notEmpty();
    req.assert("email_adm_cadastro", "3").notEmpty();
    req.assert("email_adm_cadastro", "4").len(5, 60);
    req.assert("email_adm_cadastro", "5").isEmail();
    req.assert("confirmar_email_adm_cadastro", "6").notEmpty();
    req.assert("confirmar_email_adm_cadastro", "7").len(5, 60);
    req.assert("confirmar_email_adm_cadastro", "8").isEmail();
    req.assert("senha_adm_cadastro", "9").notEmpty();
    req.assert("senha_adm_cadastro", "10").len(8, 60);
    req.assert("confirmar_senha_adm_cadastro", "11").notEmpty();
    req.assert("confirmar_senha_adm_cadastro", "12").len(8, 60);
    req.assert("nivel_adm", "13").isIn(["1"]);

    let validacaoAdm;
    validacaoAdm = req.validationErrors();
    let cpfs = ["00000000000", "11111111111", "22222222222", "33333333333", "44444444444",
        "55555555555", "66666666666", "77777777777", "88888888888", "99999999999"];
    let soma = 0;
    let resto = 0;
    let validacaoCpfAdm = "";
    let validacaoEmailAdm = "";
    let validacaoSenhaAdm = "";
    
    let validacaoImgAdm = "";
    if (!req.files) {
        validacaoImgAdm = "0";
    }

    let x = cpfs.indexOf(cpf_usuario);

    if (x != -1) {
        validacaoCpfAdm = "0";
    }
    else {
        for (i = 1; i <= 9; i++) {
            soma += parseInt(cpf_usuario.substring(i - 1, i)) * (11 - i);
            resto = (soma * 10) % 11;
        }
        if (resto == 10 || resto == 11) {
            resto = 0;
        }
        if (resto != parseInt(cpf_usuario.substring(9, 10))) {
            validacaoCpfAdm = "0";
        }

        soma = 0;
        for (i = 1; i <= 10; i++) {
            soma += parseInt(cpf_usuario.substring(i - 1, i)) * (12 - i);
            resto = (soma * 10) % 11;
        }
        if (resto == 10 || resto == 11) {
            resto = 0;
        }
        if (resto != parseInt(cpf_usuario.substring(10, 11))) {
            validacaoCpfAdm = "0";
        }
    }

    if (email_usuario.length > 5 && confirmar_email_usuario.length > 5) { 
        if (email_usuario != confirmar_email_usuario) {
            validacaoEmailAdm = "1";
        }
    }

    if (senha_usuario.length > 8 && confirmar_senha_usuario.length > 8) {
        if (senha_usuario != confirmar_senha_usuario) {
            validacaoSenhaAdm = "2";
        }
    }

    if (validacaoAdm) {
        res.render("usuarios/cadastro_usuarios", {validacaoImgUsuario: {}, validacaoUsuario: {}, validacaoCpfUsuario: {}, validacaoEmailUsuario: {}, validacaoSenhaUsuario: {}, validacaoImgAdm, validacaoAdm, validacaoCpfAdm, validacaoEmailAdm, validacaoSenhaAdm, cpfCadastradoUsuarioComum: {}, cpfCadastradoAdm: {}});
        return;
    }
    if (validacaoCpfAdm || validacaoEmailAdm || validacaoSenhaAdm) {
        res.render("usuarios/cadastro_usuarios", {validacaoImgUsuario: {}, validacaoUsuario: {}, validacaoCpfUsuario: {}, validacaoEmailUsuario: {}, validacaoSenhaUsuario: {}, validacaoImgAdm, validacaoAdm, validacaoCpfAdm, validacaoEmailAdm, validacaoSenhaAdm, cpfCadastradoUsuarioComum: {}, cpfCadastradoAdm: {}});
        return;
    }
    if (validacaoImgAdm) {
        res.render("usuarios/cadastro_usuarios", {validacaoImgUsuario, validacaoUsuario, validacaoCpfUsuario, validacaoEmailUsuario, validacaoSenhaUsuario, validacaoImgAdm, validacaoAdm, validacaoCpfAdm, validacaoEmailAdm, validacaoSenhaAdm, cpfCadastradoUsuarioComum: {}, cpfCadastradoAdm: {}});
        return;
    }

    let file = req.files.imagem_adm;
    let imagem_usuario = file.name;

    let usuario = {
        status_usuario,
        nome_usuario,
        cpf_usuario,
        email_usuario,
        senha_usuario,
        imagem_usuario,
        nivel_usuario,
    }

    try {
        usuarioModel.getUsuarios(function (error, result) {
            for (let i = 0; i < result.length; i++) {
                if (result[i].cpf_usuario == usuario.cpf_usuario) {
                    res.render("usuarios/cadastro_usuarios", {validacaoImgUsuario: {}, validacaoUsuario: {}, validacaoCpfUsuario: {}, validacaoEmailUsuario: {}, validacaoSenhaUsuario: {}, validacaoImgAdm: {}, validacaoAdm: {}, validacaoCpfAdm: {}, validacaoEmailAdm: {}, validacaoSenhaAdm: {}, cpfCadastradoUsuarioComum: {}, cpfCadastradoAdm: "1"});
                    return;
                }
            }
            file.mv("./app/public/img/imagens-usuarios/" + imagem_usuario, function (error0) {
                usuarioModel.insertUsuario(usuario, function (error2, result2) {
                    res.redirect("/lista_usuarios");
                });
            });
        });
    } catch (error) {
        res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
    }
}

module.exports.updateUsuario = function (app, req, res) {
    let id_usuario;
    if (req.session.nivelUsuario == "1") {
        id_usuario = req.body.id_usuario;
    }
    else {
        id_usuario = req.session.usuario;
    }
    let nome_usuario = req.body.nome_usuario_atualizacao;
    let email_usuario = req.body.email_usuario_atualizacao;
    let senha_usuario = req.body.senha_usuario_atualizacao;
    let cpf_usuario = req.body.cpf_usuario_atualizacao;
    let connection = app.config.dbConnection();
    let usuarioModel = new app.app.models.UsuarioDAO(connection);

    req.assert("nome_usuario_atualizacao", "0").notEmpty();
    req.assert("nome_usuario_atualizacao", "1").len(5, 60);
    req.assert("email_usuario_atualizacao", "2").notEmpty();
    req.assert("email_usuario_atualizacao", "3").len(5, 60);
    req.assert("email_usuario_atualizacao", "4").isEmail();
    req.assert("senha_usuario_atualizacao", "5").notEmpty();
    req.assert("senha_usuario_atualizacao", "6").len(8, 60);
    req.assert("cpf_usuario_atualizacao", "7").notEmpty();

    let validacaoUsuario;
    validacaoUsuario = req.validationErrors();

    let cpfs = ["00000000000", "11111111111", "22222222222", "33333333333", "44444444444",
        "55555555555", "66666666666", "77777777777", "88888888888", "99999999999"];
    let soma = 0;
    let resto = 0;
    let validacaoCpf = "";

    let x = cpfs.indexOf(cpf_usuario);

    if (x != -1) {
        validacaoCpf = "0";
    }
    else {
        for (i = 1; i <= 9; i++) {
            soma += parseInt(cpf_usuario.substring(i - 1, i)) * (11 - i);
            resto = (soma * 10) % 11;
        }
        if (resto == 10 || resto == 11) {
            resto = 0;
        }
        if (resto != parseInt(cpf_usuario.substring(9, 10))) {
            validacaoCpf = "0";
        }

        soma = 0;
        for (i = 1; i <= 10; i++) {
            soma += parseInt(cpf_usuario.substring(i - 1, i)) * (12 - i);
            resto = (soma * 10) % 11;
        }
        if (resto == 10 || resto == 11) {
            resto = 0;
        }
        if (resto != parseInt(cpf_usuario.substring(10, 11))) {
            validacaoCpf = "0";
        }
    }

    if (validacaoUsuario) {
        try {
            usuarioModel.getUsuario(id_usuario, function (error, result) {
                res.render("usuarios/atualizar_usuario", {nivelUsuario: req.session.nivelUsuario, usuario: result, validacaoUsuario, validacaoCpf});
            });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
        return;
    }

    if (validacaoCpf) {
        try {
            usuarioModel.getUsuario(id_usuario, function (error, result) {
                res.render("usuarios/atualizar_usuario", {nivelUsuario: req.session.nivelUsuario, usuario: result, validacaoUsuario, validacaoCpf});
            });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
        return;
    }

   if (req.files) {
        let file = req.files.imagem_usuario;
        let imagem_usuario = file.name;

        let usuario = {
            id_usuario,
            nome_usuario,
            cpf_usuario,
            email_usuario,
            senha_usuario,
            imagem_usuario,
        }

        file.mv("./app/public/img/imagens-usuarios/" + imagem_usuario, function (error0) {
            try {
                usuarioModel.updateUsuario(usuario, function (error, result) {
                    if (req.session.nivelUsuario == "1") {
                        res.redirect("/lista_usuarios");
                    }
                    else {
                        res.redirect("/usuario");
                    }
                });
            } catch (error) {
                res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
            }
        });
        return;
   }

    let usuario = {
        id_usuario,
        nome_usuario,
        cpf_usuario,
        email_usuario,
        senha_usuario,
        imagem_usuario: req.body.imagem_padrao,
    }

    try {
        usuarioModel.updateUsuario(usuario, function (error, result) {
            if (req.session.nivelUsuario == "1") {
                res.redirect("/lista_usuarios");
            }
            else {
                res.redirect("/usuario");
            }
        });
    } catch (error) {
        res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
    }
}

module.exports.deleteUsuario = function (app, req, res) {
    let id_usuario_atual = req.session.usuario;
    let id_usuario = req.body.id_excluir_usuario;
    let nivelUser = req.body.nivel_usuario;
    if (req.body.id_excluir_usuario) {
        id_usuario = req.body.id_excluir_usuario;
    }
    else {
        res.redirect("/lista_usuarios");
        return;
    }
    let connection = app.config.dbConnection();
    let usuarioModel = new app.app.models.UsuarioDAO(connection);
    let permanenciaModel = new app.app.models.PermanenciaDAO(connection);

    if (nivelUser == "1") {
        try {
            usuarioModel.deleteUsuario(id_usuario, function (error, result) {
                permanenciaModel.deletePermanencia(id_usuario, function (error2, result2) {
                    if (id_usuario_atual == id_usuario) {
                        req.session.destroy();
                        res.redirect("/");
                    }
                    else {
                        res.redirect("/lista_usuarios");
                    }
                });
            });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
    }
    else {
        try {
            usuarioModel.deleteUsuario(id_usuario, function (error, result) {
                res.redirect("/lista_usuarios");
             });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
    }
}