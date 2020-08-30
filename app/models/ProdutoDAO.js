function ProdutoDAO(connection) {
    this._connection = connection;

    ProdutoDAO.prototype.getProdutos = function (callback) {
        this._connection.query("SELECT * FROM produto INNER JOIN laboratorio ON produto.pertence_laboratorio = laboratorio.id_laboratorio ORDER BY data_criacao_produto DESC", callback);
    }

    ProdutoDAO.prototype.searchProduto = function (nome_produto, callback) {
        this._connection.query("SELECT * FROM produto INNER JOIN laboratorio ON produto.pertence_laboratorio = laboratorio.id_laboratorio WHERE nome_produto LIKE ?", "%" + nome_produto + "%", callback);
    }

    ProdutoDAO.prototype.getProduto = function (id_produto, callback) {
        this._connection.query("SELECT * FROM produto WHERE id_produto = " + id_produto, callback);
    }

    ProdutoDAO.prototype.insertProduto = function (produto, callback) {
        this._connection.query("INSERT INTO produto SET ?", produto, callback);
    }
    
    ProdutoDAO.prototype.updateProduto = function (produto, callback) {
        this._connection.query("UPDATE produto SET nome_produto = '" + produto.nome_produto + "', status_produto = '" + produto.status_produto + "', imagem_produto = '" + produto.imagem_produto + "', formula_produto = '" + produto.formula_produto + "', quantidade_produto = '" + produto.quantidade_produto + "', pertence_laboratorio = '" + produto.pertence_laboratorio + "' WHERE id_produto = " + produto.id_produto, callback)
    }

    ProdutoDAO.prototype.deleteProduto = function (id_produto, callback) {
        this._connection.query("DELETE FROM produto WHERE id_produto =" + id_produto, callback);
    }
}

module.exports = function () {
    return ProdutoDAO;
}