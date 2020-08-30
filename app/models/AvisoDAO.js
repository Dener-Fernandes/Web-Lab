function AvisoDAO(connection) {
    this._connection = connection;

    AvisoDAO.prototype.getAvisos = function (callback) {
        this._connection.query("SELECT * FROM aviso INNER JOIN usuario ON aviso.id_usuario = usuario.id_usuario ORDER BY data_criacao_aviso DESC", callback);
    }
    AvisoDAO.prototype.getAviso = function (id_aviso, callback) {
        this._connection.query("SELECT * FROM aviso INNER JOIN usuario ON aviso.id_usuario = usuario.id_usuario WHERE id_aviso =" + id_aviso, callback);
    }

    AvisoDAO.prototype.insertAviso = function (aviso, callback) {
        this._connection.query("INSERT INTO aviso SET ?", aviso, callback);
    }

    AvisoDAO.prototype.updateAviso = function (aviso, callback) {
        this._connection.query("UPDATE aviso SET descricao_aviso = '" + aviso.descricao_aviso + "' WHERE id_aviso =" + aviso.id_aviso, callback);
    }

    AvisoDAO.prototype.deleteAviso = function (id_aviso, callback) {
        this._connection.query("DELETE FROM aviso WHERE id_aviso =" + id_aviso, callback);
    }
}

module.exports = function () {
    return AvisoDAO;
}