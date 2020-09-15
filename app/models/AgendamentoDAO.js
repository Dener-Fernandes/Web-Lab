function AgendamentoDAO(connection) {
    this._connection = connection;

    AgendamentoDAO.prototype.getAgendamentos = function (callback) {
        this._connection.query("SELECT * FROM agendamento INNER JOIN usuario ON agendamento.id_usuario = usuario.id_usuario INNER JOIN horario ON agendamento.id_horario = horario.id_horario INNER JOIN laboratorio ON agendamento.id_laboratorio = laboratorio.id_laboratorio INNER JOIN motivo_agendamento ON agendamento.id_motivo_agendamento = motivo_agendamento.id_motivo_agendamento ORDER BY data_criacao_agendamento DESC", callback);
    }

    AgendamentoDAO.prototype.getAgendamento = function(id_agendamento, callback) {
        this._connection.query("SELECT * FROM agendamento WHERE id_agendamento =" + id_agendamento, callback);
    }

    AgendamentoDAO.prototype.searchAgendamento = function(data_agendamento, callback) {
        this._connection.query("SELECT * FROM agendamento INNER JOIN usuario ON agendamento.id_usuario = usuario.id_usuario INNER JOIN horario ON agendamento.id_horario = horario.id_horario INNER JOIN laboratorio ON agendamento.id_laboratorio = laboratorio.id_laboratorio WHERE horario.data_horario =?", data_agendamento, callback);
    }

    AgendamentoDAO.prototype.insertAgendamento = function (agendamentoDados, callback) {
        this._connection.query("INSERT INTO agendamento SET ?", agendamentoDados, callback);
    }

    AgendamentoDAO.prototype.updateAgendamento = function (agendamentoDados, callback) {
        this._connection.query("UPDATE agendamento SET descricao_agendamento = '" + agendamentoDados.descricao_agendamento + "', nome_produto = '" + agendamentoDados.nome_produto + "', nome_equipamento = '" + agendamentoDados.nome_equipamento + "', id_motivo_agendamento = '" + agendamentoDados.id_motivo_agendamento + "' WHERE id_agendamento =" + agendamentoDados.id_agendamento, callback);
    }

    AgendamentoDAO.prototype.deleteAgendamento = function (id_agendamento, callback) {
        this._connection.query("DELETE FROM agendamento WHERE id_agendamento =" + id_agendamento, callback);
    }

}
module.exports = function () {
    return AgendamentoDAO;
}
