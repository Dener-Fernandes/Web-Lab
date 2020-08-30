function MotivoDAO(connection) {
    this._connection = connection;

    MotivoDAO.prototype.getMotivos = function (callback) {
        this._connection.query("SELECT * FROM motivo_agendamento", callback);
    }
}

module.exports = function () {
    return MotivoDAO;
}