const token = localStorage.getItem('authToken');

const saveReferenceMonthForm = document.querySelector("#salvar-data-referencia");

saveReferenceMonthForm.addEventListener("submit", saveReferenceMonth);

async function saveReferenceMonth(e) {
    e.preventDefault();

    const url = "http://localhost:3000/api/certificates/reference-month";

    const mesReferencia = document.querySelector("#mes-referencia");
    const anoReferencia = document.querySelector("#ano-referencia");


    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                "month": mesReferencia.value,
                "year": anoReferencia.value
            })
        });

        const data = await response.json();

        if (!response.ok) {
            const error = data.error.toLowerCase();
            let input = null;
            let label = null;

            if (error.includes("month")) {
                input = mesReferencia;
                label = document.querySelector(`label[for="mes-referencia"]`);
            } else if (error.includes("year")) {
                input = anoReferencia;
                label = document.querySelector(`label[for="ano-referencia"]`);
            }

            if (input) {
                input.classList.add("border", "border-danger");

                if (label) {
                    label.classList.add("text-danger");
                }
            }

            createAlert(data.error);

            throw new Error(`Response status: ${response.status}`);
        }

        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

async function loadTableContent() {
    const url = "http://localhost:3000/api/users/";

    const tableContetContainer = document.querySelector("#tabela-alunos-conteudo");

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        if (!response.ok) {
            createAlert(data.error);

            throw new Error(`Response status: ${response.status}`);
        }

        let tableContent = "";
        let cont = 0;

        data.forEach(user => {
            if (user) {
                cont++;

                tableContent = `
                    <tr>
                        <th scope="row">${cont}</th>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.matricula}</td>
                        <td>
                            <div class="d-flex align-items-center text-danger gap-1 certificate-notification justify-content-center"
                                id="certificate-notification-error">
                            </div>
                        </td>
                        <td>
                            <div class="d-flex flex-column justify-content-center gap-3 py-2">
                                <a href="./certificates.html"
                                    class="btn btn-primary d-flex justify-content-center align-items-center gap-2" id="certificados-button">
                                    <i class="fa fa-certificate" aria-hidden="true"></i>
                                    <span>Certificados</span>
                                </a>
                            </div>
                        </td>
                    </tr>
                `;

                tableContetContainer.innerHTML = tableContent;
            }
        });

        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

loadTableContent();