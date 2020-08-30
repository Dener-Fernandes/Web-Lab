function HorarioDAO(connection) {
    this._connection = connection;

    HorarioDAO.prototype.getHorarios = function (id_laboratorio, data ,callback) {
        this._connection.query("SELECT * FROM agendamento INNER JOIN horario ON agendamento.id_horario = horario.id_horario WHERE data_horario = '" + data + "'  AND agendamento.id_laboratorio =" + id_laboratorio,  callback);
    }

    HorarioDAO.prototype.getOnlyHorarios = function (callback) {
        this._connection.query("SELECT * FROM horario", callback);
    }

    HorarioDAO.prototype.getHorario = function (id_horario, callback) {
        this._connection.query("SELECT * FROM horario WHERE id_horario = ?", id_horario, callback);
    }

    HorarioDAO.prototype.insertHorario = function (horarioDados, callback) {
        this._connection.query("INSERT INTO horario SET ?", horarioDados);
        this._connection.query("SELECT id_horario FROM horario WHERE data_horario = '" + horarioDados.data_horario + "' AND horario = '" + horarioDados.horario + "'", callback);
    }

    HorarioDAO.prototype.updateStatusHorario = function (id_horario, status_horario, callback) {
        this._connection.query("UPDATE horario SET status_horario = '" + status_horario + "' WHERE id_horario =" + id_horario, callback);
    }

    HorarioDAO.prototype.deleteHorario = function (id_horario, callback) {
        this._connection.query("DELETE FROM horario WHERE id_horario =" + id_horario, callback);
    }
}

module.exports = function () {
    return HorarioDAO;
}