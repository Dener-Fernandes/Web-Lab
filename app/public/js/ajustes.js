function excluir (id, nivel) {
    document.getElementById("confirmar_exclusao").value = id;
    document.getElementById("id_nivel_usuario").value = nivel;
}
function excluir2 (id) {
    document.getElementById("confirmar_exclusao").value = id;
   
}

function hour(horario) {
    document.getElementById("horario").value = horario;
}

function data_chose(data_eacolhida) {
    document.getElementById("data").value = data_eacolhida;
}

function menu(valor){
    switch(valor){
        case "0":
            document.getElementById("produtos").className = "visivel";
            break;

        case "1":
            document.getElementById("produtos").className = "invisivel";
            break;
        
        case "2":
            document.getElementById("equipamentos").className = "visivel";
            break;

        case "3":
            document.getElementById("equipamentos").className = "invisivel";
            break;
    }
}