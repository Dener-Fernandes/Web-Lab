CREATE DATABASE web_lab;
USE web_lab;

CREATE TABLE horario (
id_horario INTEGER PRIMARY KEY KEY AUTO_INCREMENT,
data_horario VARCHAR(10),
status_horario VARCHAR(20),
horario VARCHAR(15)
);

CREATE TABLE motivo_agendamento (
id_motivo_agendamento INTEGER PRIMARY KEY AUTO_INCREMENT,
descricao_motivo VARCHAR(15)
);

INSERT INTO motivo_agendamento (descricao_motivo) VALUES ("AULA");
INSERT INTO motivo_agendamento (descricao_motivo) VALUES ("EXPERIMENTO");

CREATE TABLE usuario (
id_usuario INTEGER PRIMARY KEY AUTO_INCREMENT,
status_usuario VARCHAR(10),
nome_usuario VARCHAR(60),
cpf_usuario CHAR(11),
email_usuario VARCHAR(60),
senha_usuario VARCHAR(60),
imagem_usuario VARCHAR(60),
nivel_usuario INTEGER,
data_criacao_usuario TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE permanencia (
id_permanencia INTEGER PRIMARY KEY AUTO_INCREMENT,
segunda_feira_manha VARCHAR(15),
terca_feira_manha VARCHAR(15),
quarta_feira_manha VARCHAR(15),
quinta_feira_manha VARCHAR(15),
sexta_feira_manha VARCHAR(15),
segunda_feira_tarde VARCHAR(15),
terca_feira_tarde VARCHAR(15),
quarta_feira_tarde VARCHAR(15),
quinta_feira_tarde VARCHAR(15),
sexta_feira_tarde VARCHAR(15),
id_usuario INTEGER,
FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
);

CREATE TABLE aviso (
id_aviso INTEGER PRIMARY KEY AUTO_INCREMENT,
descricao_aviso TEXT,
data_publicacao VARCHAR(10),
id_usuario INTEGER,
data_criacao_aviso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY(id_usuario) REFERENCES usuario (id_usuario)
);

CREATE TABLE laboratorio (
id_laboratorio INTEGER PRIMARY KEY AUTO_INCREMENT,
nome_laboratorio VARCHAR(60),
imagem_laboratorio VARCHAR(60),
descricao_laboratorio TEXT,
id_usuario INTEGER,
FOREIGN KEY(id_usuario) REFERENCES usuario (id_usuario)
);

CREATE TABLE agendamento (
id_agendamento INTEGER PRIMARY KEY AUTO_INCREMENT,
descricao_agendamento VARCHAR(200),
data_criacao_agendamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
nome_produto VARCHAR(500),
nome_equipamento VARCHAR(500),
id_usuario INTEGER,
id_motivo_agendamento INTEGER,
id_laboratorio INTEGER,
id_horario INTEGER,
FOREIGN KEY(id_usuario) REFERENCES usuario (id_usuario),
FOREIGN KEY(id_motivo_agendamento) REFERENCES motivo_agendamento (id_motivo_agendamento),
FOREIGN KEY(id_laboratorio) REFERENCES laboratorio (id_laboratorio),
FOREIGN KEY(id_horario) REFERENCES horario (id_horario)
);

CREATE TABLE equipamento (
id_equipamento INTEGER PRIMARY KEY AUTO_INCREMENT,
nome_equipamento VARCHAR(60),
status_equipamento VARCHAR(15),
imagem_equipamento VARCHAR(60),
numero_patrimonio INTEGER,
quantidade_equipamento INTEGER,
pertence_laboratorio INTEGER,
data_criacao_equipamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY(pertence_laboratorio) REFERENCES laboratorio (id_laboratorio)
);

CREATE TABLE produto (
id_produto INTEGER PRIMARY KEY AUTO_INCREMENT,
nome_produto VARCHAR(60),
status_produto VARCHAR(15),
imagem_produto VARCHAR(60),
formula_produto VARCHAR(60),
quantidade_produto INTEGER,
pertence_laboratorio INTEGER,
data_criacao_produto TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY(pertence_laboratorio) REFERENCES laboratorio (id_laboratorio)
);


