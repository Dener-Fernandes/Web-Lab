function PermanenciaDAO(connection) {
    this._connection = connection;
    
    PermanenciaDAO.prototype.getPermanencias = function (callback) {
        this._connection.query("SELECT * FROM permanencia", callback);
    }

    PermanenciaDAO.prototype.getPermanencia = function (id_usuario, callback) {
        this._connection.query("SELECT * FROM permanencia WHERE id_usuario =" + id_usuario, callback);
    }

    PermanenciaDAO.prototype.insertPermanencia = function (permanencia, callback) {
        this._connection.query("INSERT INTO permanencia SET ?", permanencia, callback);
    }

    PermanenciaDAO.prototype.updatePermanencia = function (permanencia, callback) {
        this._connection.query("UPDATE permanencia SET segunda_feira_manha = '" + permanencia.segunda_feira_manha + "', terca_feira_manha = '" + permanencia.terca_feira_manha + "', quarta_feira_manha = '" + permanencia.quarta_feira_manha + "', quinta_feira_manha = '" + permanencia.quinta_feira_manha + "', sexta_feira_manha = '" + permanencia.sexta_feira_manha + "', segunda_feira_tarde = '" + permanencia.segunda_feira_tarde + "', terca_feira_tarde = '" + permanencia.terca_feira_tarde + "', quarta_feira_tarde = '" + permanencia.quarta_feira_tarde + "', quinta_feira_tarde = '" + permanencia.quinta_feira_tarde + "', sexta_feira_tarde = '" + permanencia.sexta_feira_tarde + "' WHERE id_usuario =" + permanencia.id_usuario, callback);
    }

    PermanenciaDAO.prototype.deletePermanencia = function (id_usuario, callback) {
        this._connection.query("DELETE FROM permanencia WHERE id_usuario =" + id_usuario, callback);
    }
}

module.exports = function () {

    return PermanenciaDAO;
}
