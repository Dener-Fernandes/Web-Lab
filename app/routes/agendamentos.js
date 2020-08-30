module.exports = function (app) {
    app.get("/agendamentos", function (req, res) {
        app.app.controllers.agendamentos.agendamentos(app, req, res);
    });

    app.post("/escolher_horario", function (req, res) {
        app.app.controllers.agendamentos.getHorarios(app, req, res);
    });

    app.get("/escolher_horario", function (req, res) {
        app.app.controllers.agendamentos.agendamentos(app, req, res);
    });
    
    app.post("/salvar_agendamento", function (req, res) {
        app.app.controllers.agendamentos.insertAgendamento(app, req, res);
    });

    app.get("/lista_agendamentos", function (req, res) {
        app.app.controllers.agendamentos.getAgendamentos(app, req, res);
    });

    app.post("/search_agendamento", function (req, res) {
        app.app.controllers.agendamentos.searchAgendamento(app, req, res);
    });

    app.post("/confirmar_agendamento", function (req, res) {
        app.app.controllers.agendamentos.confirmarAgendamento(app, req, res);
    });

    app.post("/cancelar_agendamento", function (req, res) {
        app.app.controllers.agendamentos.deleteAgendamento(app, req, res);
    });

    app.post("/atualizacao_agendamento", function (req, res) {
        app.app.controllers.agendamentos.getAgendamento(app, req, res);
    });

    app.get("/atualizacao_agendamento", function (req, res) {
        app.app.controllers.agendamentos.agendamentos(app, req, res);
    });

    app.post("/atualizar_agendamento", function (req, res) {
        app.app.controllers.agendamentos.updateAgendamento(app, req, res);
    });

    app.get("/atualizar_agendamento", function (req, res) {
        app.app.controllers.agendamentos.agendamentos(app, req, res);
    });
}