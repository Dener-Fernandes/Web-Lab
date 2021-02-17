module.exports.agendamentos = function (app, req, res) {
    if (req.session.loggedIn) {
        let connection = app.config.dbConnection();
        let laboratorioModel = new app.app.models.LaboratorioDAO(connection);

        try {
            laboratorioModel.getLaboratorios(function (error, result) {
                res.render("agendamentos/agendamentos", { nivelUsuario: req.session.nivelUsuario, laboratorios: result, validacao: {} });
            });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
    }
    else {
        res.redirect("/");
    }
}

module.exports.searchAgendamento = function (app, req, res) {
    if (req.session.loggedIn) {
        if (req.session.nivelUsuario == "1") {
            let data_agendamento = req.body.data_agendamento;
            if (data_agendamento) {
                let connection = app.config.dbConnection();
                let agendamentoModel = new app.app.models.AgendamentoDAO(connection);

                try {
                    agendamentoModel.searchAgendamento(data_agendamento, function (error, result) {
                        result = converter(result);
                        res.render("agendamentos/lista_agendamentos", { nivelUsuario: req.session.nivelUsuario, agendamentos: result});
                    });
                } catch (error) {
                    res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
                }

                function converter(result) {
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].nome_produto != "Estes recursos não foram utilizados") {
                            result[i].nome_produto = JSON.parse(result[i].nome_produto);
                        }
                        if (result[i].nome_equipamento != "Estes recursos não foram utilizados") {
                            result[i].nome_equipamento = JSON.parse(result[i].nome_equipamento);
                        }

                    }
                    return result;
                }
            }
            else {
                res.redirect("/lista_agendamentos");
            }
        }
        else {
            res.redirect("/home");
        }
    }
    else {
        res.redirect("/");
    }
}

module.exports.getHorarios = function (app, req, res) {
    if (req.session.loggedIn) {
        let data;
        if (req.body.data) {
            data = req.body.data;
            if (data.length < 10) {
                data = `0${data}`;
            }
        }
        else {
            res.redirect("/agendamentos");
            return;
        }

        let id_laboratorio = req.body.laboratorio_agendamento;
        let connection = app.config.dbConnection();
        let horarioModel = new app.app.models.HorarioDAO(connection);
        let produtoModel = new app.app.models.ProdutoDAO(connection);
        let equipamentoModel = new app.app.models.EquipamentoDAO(connection);
        let motivoModel = new app.app.models.MotivoDAO(connection);
        let laboratorioModel = new app.app.models.LaboratorioDAO(connection);

        req.assert("laboratorio_agendamento", "0").isIn(["1", "2"]);

        let validacao = req.validationErrors();

        if (validacao) {
            try {
                laboratorioModel.getLaboratorios(function (error, result) {
                    res.render("agendamentos/agendamentos", { nivelUsuario: req.session.nivelUsuario, laboratorios: result, validacao });
                });
            } catch (error) {
                res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
            }
            return;
        }

        try {
            horarioModel.getHorarios(id_laboratorio, data, function (error, result) {
                produtoModel.getProdutos(function (error2, result2) {
                    equipamentoModel.getEquipamentos(function (error3, result3) {
                        motivoModel.getMotivos(function (error4, result4) {
                            res.render("agendamentos/horarios", {usuario: req.session.usuario, nivelUsuario: req.session.nivelUsuario, horarios: result, produtos: result2, equipamentos: result3, motivos: result4, data, laboratorio_agendamento: id_laboratorio, agendamento: {}, validacao: {}, validacaoCancelamento: {}});
                        });
                    });
                });
            });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
    }
    else {
        res.redirect("/");
    }
}

module.exports.insertAgendamento = function (app, req, res) {
    let data_horario;
    let horario = req.body.horario;
    let id_laboratorio;
    if (req.body.data && req.body.horario && req.body.laboratorio_agendamento) {
        data_horario = req.body.data;
        horario = req.body.horario;
        id_laboratorio = req.body.laboratorio_agendamento;
    }
    else {
        res.redirect("/agendamentos");
        return;
    }
    let id_motivo_agendamento = req.body.motivo_agendamento;
    let descricao_agendamento = req.body.descricao_agendamento;
    let nome_produto;
    let nome_equipamento;
    let id_usuario = req.session.usuario;
    let nivelUser = req.session.nivelUsuario;
    let status_horario = "EM ANÁLISE";
    let id_horario;
    let transporter = app.config.emailSend;
    let email = {
        from: "Administrador Web-Lab <>",
        to: "",
        subject: "Solicitação de agendamento",
        text: "",
    }
    let connection = app.config.dbConnection();
    let agendamentoModel = new app.app.models.AgendamentoDAO(connection);
    let horarioModel = new app.app.models.HorarioDAO(connection);
    let produtoModel = new app.app.models.ProdutoDAO(connection);
    let equipamentoModel = new app.app.models.EquipamentoDAO(connection);
    let motivoModel = new app.app.models.MotivoDAO(connection);
    let usuarioModel = new app.app.models.UsuarioDAO(connection);

    // Validação
    req.assert("motivo_agendamento", "2").isIn(["1", "2"]);
    req.assert("descricao_agendamento", "3").notEmpty();
    req.assert("descricao_agendamento", "4").len(10, 100);
    req.assert("utilizar_produto", "5").isIn(["true", "false"]);
    req.assert("utilizar_equipamento", "6").isIn(["true", "false"]);
    if (req.body.utilizar_produto == "true") {
        nome_produto = remover(req.body.nome_produto);
    }
    if (req.body.utilizar_produto == "false") {
        nome_produto = "Estes recursos não foram utilizados";
    }
    if (req.body.utilizar_equipamento == "true") {
        nome_equipamento = remover(req.body.nome_equipamento);
    }
    if (req.body.utilizar_equipamento == "false") {
        nome_equipamento = "Estes recursos não foram utilizados";
    }

    let erros = req.validationErrors();
    if (erros) {
        let agendamento = req.body;  
        try {
            horarioModel.getHorarios(id_laboratorio, data_horario, function (error, result) {
                produtoModel.getProdutos(function (error2, result2) {
                    equipamentoModel.getEquipamentos(function (error3, result3) {
                        motivoModel.getMotivos(function (error4, result4) {
                            res.render("agendamentos/horarios", { usuario: id_usuario, nivelUsuario: req.session.nivelUsuario, horarios: result, produtos: result2, equipamentos: result3, motivos: result4, data: data_horario, agendamento: agendamento, validacao: erros, laboratorio_agendamento: id_laboratorio, validacaoCancelamento: {} });
                        });
                    });
                });
            });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
        return; // Impedindo que o resto do código seja executado.
    }
    // Validação
    let agendamentoDados = {
        descricao_agendamento,
        nome_produto,
        nome_equipamento,
        id_motivo_agendamento,
        id_usuario,
        id_laboratorio,
        id_horario,
    }
    let horarioDados = {
        data_horario,
        horario,
        status_horario,
    }

    if (nivelUser == "1") {
        try {
            horarioDados.status_horario = "CONFIRMADO";
            horarioModel.insertHorario(horarioDados, function (error, result) {
                agendamentoDados.id_horario = result[0].id_horario;
                agendamentoModel.insertAgendamento(agendamentoDados, function (error2, result2) {
                    res.redirect("/agendamentos");
                });
            });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
    }
    else {
        try {
            horarioModel.insertHorario(horarioDados, function (error, result) {
                agendamentoDados.id_horario = result[0].id_horario;
                agendamentoModel.insertAgendamento(agendamentoDados, function (error2, result2) {
                    usuarioModel.getUsuario(id_usuario, function (error3, result3) {
                        let usuario_nome = result3[0].nome_usuario;
                        let mensagem = `O usuário ${usuario_nome} solicitou agendamento para o dia: ${data_horario}, horario: ${horario}.`;
                        email.text = mensagem;
                        transporter.sendMail(email, function (error4, info) {
                            if (error4) {
                                console.log(error4);
                            }
                            else {
                                res.redirect("/agendamentos");
                            }
                        });
                    });
                });
            });
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
    }

    function remover(vetor) {
        for (let i = 0; i < vetor.length; i++) {
            if (vetor[0] == "F" && vetor[1] == "F" && vetor[2] == "F" && vetor[3] == "F" && vetor[4] == "F") {
                vetor = "Estes recursos não foram utilizados";
                return vetor;
            }
        }
        
        vetor = vetor.filter((item) => {return item != "F"});
        vetor = JSON.stringify(vetor);
        return vetor;
    }
}

module.exports.getAgendamento = function (app, req, res) {
    let id_agendamento;

    if (req.body.id_agendamento_atualizacao) {
        id_agendamento = req.body.id_agendamento_atualizacao;
    }
    else {
        res.redirect("/agendamentos");
        return;
    }
    let connection = app.config.dbConnection();
    let agendamentoModel = new app.app.models.AgendamentoDAO(connection);
    let produtoModel = new app.app.models.ProdutoDAO(connection);
    let equipamentoModel = new app.app.models.EquipamentoDAO(connection);
    let motivoModel = new app.app.models.MotivoDAO(connection);

    try {
        agendamentoModel.getAgendamento(id_agendamento, function (error, result) {
            produtoModel.getProdutos(function (error2, result2) {
                equipamentoModel.getEquipamentos(function (error3, result3) {
                    motivoModel.getMotivos(function (error4, result4) {
                        res.render("agendamentos/atualizacao_agendamentos", {nivelUsuario: req.session.nivelUsuario, agendamento: result, produtos: result2, equipamentos: result3, motivos: result4, validacao: {}});
                    });
                });
            });
        });
    } catch (error) {
        res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
    }
}

module.exports.getAgendamentos = function (app, req, res) {
    if (req.session.loggedIn) {
        if (req.session.nivelUsuario == "1") {
            let connection = app.config.dbConnection();
            let agendamentoModel = new app.app.models.AgendamentoDAO(connection);

            try {
                agendamentoModel.getAgendamentos(function (error, result) {
                    result = converter(result);
                    res.render("agendamentos/lista_agendamentos", { nivelUsuario: req.session.nivelUsuario, agendamentos: result });
                });
            } catch (error) {
                res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
            }

            function converter(result) {
                for (let i = 0; i < result.length; i++) {
                    if (result[i].nome_produto != "Estes recursos não foram utilizados") {
                        result[i].nome_produto = JSON.parse(result[i].nome_produto);
                    }
                    if (result[i].nome_equipamento != "Estes recursos não foram utilizados") {
                        result[i].nome_equipamento = JSON.parse(result[i].nome_equipamento);
                    }

                }
                return result;
            }
        }
        else {
            res.redirect("/home");
        }
    }
    else {
        res.redirect("/");
    }
}

module.exports.updateAgendamento = function (app, req, res) {
    let id_agendamento
    if (req.body.id_agendamento) {
        id_agendamento = req.body.id_agendamento;
    }
    else {
        res.redirect("/agendamentos");
        return;
    }
    let id_motivo_agendamento = req.body.motivo_agendamento_atualizacao;
    let descricao_agendamento = req.body.descricao_agendamento_atualizacao;
    let nome_produto;
    let nome_equipamento;
    let usuario = req.session.usuario;
    let usuarioNivel = req.session.nivelUsuario;
    let connection = app.config.dbConnection();
    let agendamentoModel = new app.app.models.AgendamentoDAO(connection);
    let produtoModel = new app.app.models.ProdutoDAO(connection);
    let equipamentoModel = new app.app.models.EquipamentoDAO(connection);
    let motivoModel = new app.app.models.MotivoDAO(connection);

    // Validação
    req.assert("motivo_agendamento_atualizacao", "2").isIn(["1", "2"]);
    req.assert("descricao_agendamento_atualizacao", "3").notEmpty();
    req.assert("descricao_agendamento_atualizacao", "4").len(10, 100);
    req.assert("utilizar_produto_atualizacao", "5").isIn(["true", "false"]);
    req.assert("utilizar_equipamento_atualizacao", "6").isIn(["true", "false"]);

    if (req.body.utilizar_produto_atualizacao == "true") {
        nome_produto = remover(req.body.nome_produto_atualizacao);
    }
    if (req.body.utilizar_produto_atualizacao == "false") {
        nome_produto = "Estes recursos não foram utilizados";
    }
    if (req.body.utilizar_equipamento_atualizacao == "true") {
        nome_equipamento = remover(req.body.nome_equipamento_atualizacao);
    }
    if (req.body.utilizar_equipamento_atualizacao == "false") {
        nome_equipamento = "Estes recursos não foram utilizados";
    }

    let validacao = req.validationErrors();
    if (validacao) {
        try {
            produtoModel.getProdutos(function (error, result) {
                equipamentoModel.getEquipamentos(function (error2, result2) {
                    motivoModel.getMotivos(function (error3, result3) {
                        agendamentoModel.getAgendamento(id_agendamento, function (error5, result5) {
                            res.render("agendamentos/atualizacao_agendamentos", { nivelUsuario: req.session.nivelUsuario, produtos: result, equipamentos: result2, motivos: result3, agendamento: result5, validacao});
                        });
                    });
                });
            });
            return; // Impedindo que o resto do código seja executado.
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
    }
    // Validação
    let agendamentoDados = {
        id_agendamento,
        descricao_agendamento,
        nome_produto,
        nome_equipamento,
        id_motivo_agendamento,
    }
    
    try {
        agendamentoModel.getAgendamento(id_agendamento, function (error, result) {
            let agendamento = result;
            if (agendamento[0].id_usuario == usuario || usuarioNivel == "1") {
                agendamentoModel.updateAgendamento(agendamentoDados, function (error, result) {
                    res.redirect("/agendamentos");
                });
            }
            else {
                res.redirect("/home");
            }
        });
    } catch (error) {
        res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
    }

    function remover(vetor) {
        for (let i = 0; i < vetor.length; i++) {
            if (vetor[0] == "F" && vetor[1] == "F" && vetor[2] == "F" && vetor[3] == "F" && vetor[4] == "F") {
                vetor = "Estes recursos não foram utilizados";
                return vetor;
            }
        }
        
        vetor = vetor.filter((item) => {return item != "F"});
        vetor = JSON.stringify(vetor);
        return vetor;
    }
}

module.exports.deleteAgendamento = function (app, req, res) {
    let id_agendamento;
    let usuario = req.session.usuario
    let usuarioNivel = req.session.nivelUsuario;
    if (req.body.id_excluir_agendamento) {
        id_agendamento = req.body.id_excluir_agendamento;
    }
    else {
        res.redirect("/agendamentos");
        return;
    }

    let connection = app.config.dbConnection();
    let transporter = app.config.emailSend;
    let agendamentoModel = new app.app.models.AgendamentoDAO(connection);
    let horarioModel = new app.app.models.HorarioDAO(connection);
    let usuarioModel = new app.app.models.UsuarioDAO(connection);
    let produtoModel = new app.app.models.ProdutoDAO(connection);
    let equipamentoModel = new app.app.models.EquipamentoDAO(connection);
    let motivoModel = new app.app.models.MotivoDAO(connection);
    let agendamento, id_horario, validacaoCancelamento;
    
   if (usuarioNivel == "1") {
        req.assert("descricao_cancelamento", "0").notEmpty();
        validacaoCancelamento = req.validationErrors();
   }

    if (validacaoCancelamento) {
        let data = req.body.data;
        try {
            horarioModel.getHorarios(data, function (error, result) {
                produtoModel.getProdutos(function (error1, result1) {
                    equipamentoModel.getEquipamentos(function (error2, result2) {
                        motivoModel.getMotivos(function (error3, result3) {
                            res.render("agendamentos/horarios", {usuario, nivelUsuario: req.session.nivelUsuario, horarios: result, produtos: result1, equipamentos: result2, motivos: result3, data, agendamento: {}, validacao: {}, validacaoCancelamento});
                        });
                    });
                });
            });
            return; // Impedindo que o resto do código seja executado.
        } catch (error) {
            res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
        }
    }

    try {
        agendamentoModel.getAgendamento(id_agendamento, function (error, result) {
            agendamento = result;
            if (agendamento[0].id_usuario == usuario || usuarioNivel == "1") {
                id_horario = agendamento[0].id_horario;
                horarioModel.getHorario(id_horario, function (error2, result2) {
                    let data = result2[0].data_horario;
                    let horario = result2[0].horario;
                    let id_usuario;
                    id_usuario = agendamento[0].id_usuario;
                    agendamentoModel.deleteAgendamento(id_agendamento, function (error1, result1) {
                        horarioModel.deleteHorario(id_horario, function (error2, result2) {
                            usuarioModel.getUsuario(id_usuario, function (error3, result3) {
                                if (usuarioNivel == "1") {
                                    let email_usuario = result3[0].email_usuario;
                                    let mensagem = req.body.descricao_cancelamento;
                                    let email = {
                                        from: "Administrador Web-Lab <>",
                                        to: email_usuario,
                                        subject: "Sua solicitação de agendamento foi recusada!",
                                        text: mensagem
                                    }
                                    transporter.sendMail(email, function (error4, info) {
                                        if (error4) {
                                            console.log(error4);
                                        } else {
                                            console.log('Email sent: ' + info.response);
                                            res.redirect("/agendamentos");
                                        }
                                    });   
                                }
                                else {
                                    let nome_usuario = result3[0].nome_usuario;
                                    let mensagem = `O usuário ${nome_usuario} cancelou o agendamento da data: ${data}, horario: ${horario}.`;
                                    let email = {
                                        from: "Administrador Web-Lab <>",
                                        to: "",
                                        subject: "Agendamento cancelado!",
                                        text: mensagem
                                    }
                                    transporter.sendMail(email, function (error4, info) {
                                        if (error4) {
                                            console.log(error4);
                                        } else {
                                            console.log('Email sent: ' + info.response);
                                            res.redirect("/agendamentos");
                                        }
                                    });
                                }                          
                            });
                        });
                    });
                });
            }
            else {
                res.redirect("/home");
            }
        });
    } catch (error) {
        res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
    }

}

module.exports.confirmarAgendamento = function (app, req, res) {
    let id_agendamento;
    if (req.body.id_agendamento_confirmacao) {
        id_agendamento = req.body.id_agendamento_confirmacao;
    }
    else {
        res.redirect("/agendamentos");
        return;
    }
    let connection = app.config.dbConnection();
    let transporter = app.config.emailSend;
    let agendamentoModel = new app.app.models.AgendamentoDAO(connection);
    let usuarioModel = new app.app.models.UsuarioDAO(connection);
    let horarioModel = new app.app.models.HorarioDAO(connection);

    try {
        agendamentoModel.getAgendamento(id_agendamento, function (error, result) {
            let id_horario = result[0].id_horario;
            horarioModel.getHorario(id_horario, function (error2, result2) {
                let data = result2[0].data_horario;
                let horario = result2[0].horario;
                let status_horario = "CONFIRMADO";
                horarioModel.updateStatusHorario(id_horario, status_horario, function (error3, result3) {
                    let id_usuario = result[0].id_usuario;
                    usuarioModel.getUsuario(id_usuario, function (error4, result4) {
                        let email_usuario = result4[0].email_usuario;
                        let mensagem = `Sua solicitação de agendamento da data: ${data}, horario: ${horario}, foi aceita!`;
                        let email = {
                            from: "Administrador Web-Lab <>",
                            to: email_usuario,
                            subject: "Solicitação de agendamento confirmada!",
                            text: mensagem
                        }
                        transporter.sendMail(email, function (error5, info) {
                            if (error5) {
                                console.log(error5);
                            }
                            else {
                                console.log('Email sent: ' + info.response);
                                res.redirect("/agendamentos");
                            }
                        });
                    });
                });
            });
        });
    } catch (error) {
        res.send("Erro ao conectar ao banco de dados. Por favor tente mais tarde").end();
    }
}
