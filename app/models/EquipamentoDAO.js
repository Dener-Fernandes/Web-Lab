function EquipamentoDAO(connection) {
    this._connection = connection;

    EquipamentoDAO.prototype.getEquipamentos = function (callback) {
        this._connection.query("SELECT * FROM equipamento INNER JOIN laboratorio ON equipamento.pertence_laboratorio = laboratorio.id_laboratorio ORDER BY data_criacao_equipamento DESC", callback);
    }

    EquipamentoDAO.prototype.searchEquipamento = function (nome_equipamento, callback) {
        this._connection.query("SELECT * FROM equipamento INNER JOIN laboratorio ON equipamento.pertence_laboratorio = laboratorio.id_laboratorio WHERE nome_equipamento LIKE ?", "%" + nome_equipamento + "%", callback);
    }

    EquipamentoDAO.prototype.getEquipamento = function (id_equipamento, callback) {
        this._connection.query("SELECT * FROM equipamento WHERE id_equipamento =" + id_equipamento, callback);
    }

    EquipamentoDAO.prototype.insertEquipamento = function (equipamento, callback) {
        this._connection.query("INSERT INTO equipamento SET ?", equipamento, callback);
    }

    EquipamentoDAO.prototype.updateEquipamento = function (equipamento, callback) {
        this._connection.query("UPDATE equipamento SET nome_equipamento = '" + equipamento.nome_equipamento + "', status_equipamento = '" + equipamento.status_equipamento + "', imagem_equipamento = '" + equipamento.imagem_equipamento + "', numero_patrimonio = '" + equipamento.numero_patrimonio + "', quantidade_equipamento = '" + equipamento.quantidade_equipamento + "', pertence_laboratorio = '" + equipamento.pertence_laboratorio + "' WHERE id_equipamento = " + equipamento.id_equipamento, callback);
    }

    EquipamentoDAO.prototype.deleteEquipamento = function (id_equipamento, callback) {
        this._connection.query("DELETE FROM equipamento WHERE id_equipamento =" + id_equipamento, callback);
    }
}

module.exports = function () {
    return EquipamentoDAO;
}