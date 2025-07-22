// const token = localStorage.getItem('authToken');

async function getData() {
    // const url = "http://localhost:3000/api/users/me";
    const url = "../mock.json";

    try {
        // const response = await fetch(url, {
        //     method: 'GET',
        //     headers: {
        //         'Authorization': `Bearer ${token}`,
        //         'Content-Type': 'application/json'
        //     }
        // });

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        loadCertificationCard(data);
    } catch (error) {
        console.error(error);
    }
}

function dateToMonth(date) {
    const months = [
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
    ];
    const d = new Date(date);

    return months[d.getMonth()];
}

function extractDate(date) {
    const data = date;
    const [ano, mes, dia] = data.split("-");

    return {
        ano,
        mes,
        dia
    };
}

function loadCertificationCard({ certificados }) {
    if (!certificados) {
        alert("Não foram identificados certificados no banco!");
        return;
    }

    const containerCertificados = document.querySelector("#accordion-certificados");
    let accordionItem = "";

    certificados.forEach(certificado => {
        const dataInicio = certificado.dataInicio;
        const {mes: mesInicio, dia: diaInicio} = extractDate(dataInicio);

        const dataFim = certificado.dataFim;
        const {ano: anoFim, mes: mesFim, dia: diaFim} = extractDate(dataFim);

        const nomeEvento = certificado.nomeEvento;
        const cargaHoraria = certificado.cargaHoraria;
        const arquivoUrl = certificado.arquivoUrl;
        console.log(arquivoUrl);
        

        accordionItem += `
            <div class="accordion-item">
                <h2 class="accordion-header" id="month-title">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapse${dateToMonth(dataInicio)}" aria-expanded="false" aria-controls="collapse${dateToMonth(dataInicio)}"
                        id="btn${dateToMonth(dataInicio)}">
                        Julho
                    </button>
                </h2>
                <div id="collapse${dateToMonth(dataInicio)}" class="accordion-collapse collapse">
                    <div class="accordion-body d-flex flex-column gap-3">
                        <div class="d-flex align-items-center text-danger gap-1 certificate-notification"
                            id="certificate-notification-error">
                            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
                            <span>Período incorreto!</span>
                        </div>

                        <div class="card shadow-sm">
                            <div class="card-body">
                                <div class="d-flex card-container justify-content-between align-items-center">
                                    <div class="d-flex flex-column gap-3">
                                        <h3 class="card-title text-left">
                                            ${nomeEvento}
                                        </h3>

                                        <div class="d-flex align-items-center gap-4 calendar-hours-container">
                                            <div class="d-flex gap-2 align-items-center">
                                                <img src="../pictures/calendar.svg" class="calendar-icon"
                                                    alt="Data do certificado">
                                                <div class="card-sub-text"><span id="date-begin">${diaInicio}/${mesInicio}</span> à
                                                    <span id="date-end">${diaFim}/${mesFim}</span>/<span id="year">${anoFim}</span>
                                                </div>
                                            </div>

                                            <div class="d-flex gap-2 align-items-center">
                                                <img src="../pictures/timer.svg" class="calendar-icon"
                                                    alt="Horas do certificado">
                                                <div class="card-sub-text" id="">${cargaHoraria} hora(s)</div>
                                            </div>
                                        </div>
                                    </div>

                                    <a href="${arquivoUrl}" download class="btn btn-primary">Baixar
                                        arquivo</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    containerCertificados.innerHTML = accordionItem;
}

getData();