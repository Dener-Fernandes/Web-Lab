function UsuarioDAO(connection) {
    this._connection = connection;

    UsuarioDAO.prototype.loginUsuario = function (email_usuario, senha_usuario, callback) {
        this._connection.query("SELECT * FROM usuario WHERE email_usuario = ? AND senha_usuario = ?", [email_usuario, senha_usuario], callback);
    }

    UsuarioDAO.prototype.getUsuarios = function (callback) {
        this._connection.query("SELECT * FROM usuario ORDER BY data_criacao_usuario DESC", callback);
    }
    UsuarioDAO.prototype.getTecnicos = function (callback) {
        this._connection.query("SELECT * FROM usuario WHERE nivel_usuario = 1 AND cpf_usuario != '66666666666'", callback);
    }

    UsuarioDAO.prototype.searchUsuario = function (nome_usuario, callback) {
        this._connection.query("SELECT * FROM usuario WHERE nome_usuario LIKE ?", "%" + nome_usuario + "%", callback);
    }

    UsuarioDAO.prototype.getUsuario = function (id_usuario, callback) {
        this._connection.query("SELECT * FROM usuario WHERE id_usuario =" + id_usuario, callback);
    }

    UsuarioDAO.prototype.insertUsuario = function (usuario, callback) {
        this._connection.query("INSERT INTO usuario SET ?", usuario, callback);
    }

    UsuarioDAO.prototype.updateUsuario = function (usuario, callback) {
        this._connection.query("UPDATE usuario SET nome_usuario = '" + usuario.nome_usuario + "', cpf_usuario = '" + usuario.cpf_usuario + "', email_usuario = '" + usuario.email_usuario + "', senha_usuario = '" + usuario.senha_usuario + "', imagem_usuario = '" + usuario.imagem_usuario + "' WHERE id_usuario =" + usuario.id_usuario, callback)
    }

    UsuarioDAO.prototype.deleteUsuario = function (id_usuario, callback) {
        this._connection.query("UPDATE usuario SET status_usuario = 'DESATIVADO' WHERE id_usuario =" + id_usuario);
        this._connection.query("SELECT nivel_usuario FROM usuario WHERE id_usuario =" + id_usuario, callback);
    }
}

module.exports = function () {
    return UsuarioDAO;
}