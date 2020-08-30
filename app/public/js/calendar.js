var dt = new Date();
function renderDate(mes, ano) {
    if (!mes && !ano) {
        mes = dt.getMonth() + 1;
        ano = dt.getFullYear();
        if (mes < 10) {
            mes = `0${mes}`;
        }
    } else {
        if (mes < 10) {
            mes = `0${mes}`;
        }
    }
    dt.setDate(1);
    var day = dt.getDay();
    var today = new Date();
    var endDate = new Date(
        dt.getFullYear(),
        dt.getMonth() + 1,
        0
    ).getDate();

    var prevDate = new Date(
        dt.getFullYear(),
        dt.getMonth(),
        0
    ).getDate();
    var months = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ]
    document.getElementById("month").innerHTML = months[dt.getMonth()];
    // document.getElementById("date_str").innerHTML = dt.toDateString();
    var cells = "";
    for (x = day; x > 0; x--) {
        cells += "<div class='prev_date'>" + (prevDate - x + 1) + "</div>";
        // cells += "<form action="escolher_horario" method="POST"><button class="btn btn-secondary prev_date" type="submit">${(prevDate - x + 1)}</button>" + "</form>";

    }
    for (i = 1; i <= endDate; i++) {
        
        if (i == today.getDate() && dt.getMonth() == today.getMonth()) cells += `<div class="today" data-toggle="modal" data-target="#modal" onclick="data_chose(dia_${i}.value)"> 
            <input type="text" class="invisivel" id="dia_${i}" value="${i}/${mes}/${ano}"/> ${i} 
        </div>`;
        // `<form class="today" action="/escolher_horario" method="POST"><input type="text" class="invisivel" name="data" value="${i}"><button class="today btn btn-success" type="submit"> ${i} </button></form>`;
        else
            cells += `<div data-toggle="modal" data-target="#modal" onclick="data_chose(dia_${i}.value)"> 
            <input type="text" class="invisivel" id="dia_${i}"  value="${i}/${mes}/${ano}"/> 
            ${i} 
        </div>`
        // cells += `<form action="/escolher_horario" method="POST"><input type="text" class="invisivel" name="data" value="${i}"><button class="btn btn-secondary" type="submit">${i}</button></form>`;
        // "<form action=\"/escolher_horario\" method=\"POST\">" + "<input type=\"text\" class=\"invisivel\" name=\"data\" value="+ i +">"+ "<button class=\"btn btn-secondary\" type=\"submit\">"+ i +"</button></form>";
    }
    document.getElementsByClassName("days")[0].innerHTML = cells;

}

function moveDate(para) {
    if (para == "prev") {
        dt.setMonth(dt.getMonth() - 1);
        var mes = dt.getMonth() + 1;
        var ano = dt.getFullYear();

    } else if (para == "next") {
        dt.setMonth(dt.getMonth() + 1);
        var mes = dt.getMonth() + 1;
        var ano = dt.getFullYear();
    }
    renderDate(mes, ano);
}
