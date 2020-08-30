function LaboratorioDAO(connection) {
    this._connection = connection;

    LaboratorioDAO.prototype.getLaboratorios = function (callback) {
        this._connection.query("SELECT * FROM laboratorio", callback);
    }

    LaboratorioDAO.prototype.updateLaboratorio = function (laboratorio, callback){
        this._connection.query("UPDATE laboratorio SET imagem_laboratorio = '" + laboratorio.imagem_laboratorio + "', descricao_laboratorio = '" + laboratorio.descricao_laboratorio + "', id_usuario = '" + laboratorio.id_usuario + "' WHERE id_laboratorio = " + laboratorio.id_laboratorio, callback);
    }
}

module.exports = function () {
    return LaboratorioDAO;
}