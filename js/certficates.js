const token = localStorage.getItem('authToken');

async function uploadFile(file, title, description, institution, workload, startDate, endDate) {
    const url = "http://localhost:3000/api/certificates/upload";

    const formData = new FormData();
    formData.append("certificate", file);

    existsInFormData(formData, "title", title);
    existsInFormData(formData, "description", description);
    existsInFormData(formData, "institution", institution);
    existsInFormData(formData, "workload", workload);
    existsInFormData(formData, "startDate", startDate);
    existsInFormData(formData, "endDate", endDate);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        createCertificateCard(data);
    } catch (error) {
        console.error(error);
    }
}

function existsInFormData(formData, valFormData, val) {
    if (val) {
        formData.append(`${valFormData}`, val);
    }
}

function certificateCardBody(title, formattedStartDate, formattedEndDate, year, workload, certificateUrl) {
    const card = `
        <div class="card-body">
            <div class="d-flex card-container justify-content-between align-items-center">
                <div class="d-flex flex-column gap-3">
                    <h3 class="card-title text-left">${title}</h3>

                    <div class="d-flex align-items-center gap-4 calendar-hours-container">
                        <div class="d-flex gap-2 align-items-center">
                            <img src="../pictures/calendar.svg" class="calendar-icon" alt="Data do certificado">
                            <div class="card-sub-text"><span id="date-begin">${formattedStartDate}</span> à
                                <span id="date-end">${formattedEndDate}</span>/<span id="year">${year}</span>
                            </div>
                        </div>

                        <div class="d-flex gap-2 align-items-center">
                            <img src="../pictures/timer.svg" class="calendar-icon" alt="Horas do certificado">
                            <div class="card-sub-text" id="">${workload} horas</div>
                        </div>
                    </div>
                </div>

                <div class="d-flex align-items-center gap-3">
                    <button type="button" class="btn btn-danger remove-certificate-button">Remover</button>

                    <a href="http://localhost:3000/${certificateUrl}" download class="btn btn-primary">Baixar arquivo</a>                            
                </div>
            </div>
        </div>
    `;

    return card;
}

const certificatesContainer = document.querySelector("#certificados-container");


function createCertificateCard(certificate) {
    const certificateCard = document.createElement("div");
    certificateCard.classList.add("card", "shadow-sm");
    certificateCard.dataset.certificateId = certificate.id;

    const startDate = new Date(certificate.startDate);
    const endDate = new Date(certificate.endDate);
    const formattedStartDate = startDate.toLocaleDateString('pt-BR');
    const formattedEndDate = endDate.toLocaleDateString('pt-BR');

    const year = startDate.getFullYear();

    certificateCard.innerHTML = certificateCardBody(certificate.title, formattedStartDate, formattedEndDate, year, certificate.workload, certificate.certificateUrl);

    certificatesContainer.appendChild(certificateCard);


    const removeCertificateButton = certificateCard.querySelector(".remove-certificate-button");

    removeCertificateButton.addEventListener("click", async () => {
        await removeCertificate(certificate.id, certificateCard);
    });
}

async function removeCertificate(certificateId, cardElement) {
    const url = `http://localhost:3000/certificates/${certificateId}`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        cardElement.remove();
    } catch (error) {
        console.error(error);
    }
}

const formCertificate = document.querySelector("#form-certificado");

formCertificate.addEventListener("submit", (event) => {
    event.preventDefault();

    const file = document.querySelector("#upload-certificado").files[0];
    const title = document.querySelector("#titulo-certificado").value;
    const description = document.querySelector("#descricao-certificado").value;
    const institution = document.querySelector("#instituicao-certificado").value;
    const workload = document.querySelector("#carga-horaria-certificado").value;
    const startDate = new Date(`${document.querySelector("#data-inicio-certificado").value}T00:00:00Z`);
    const endDate = new Date(`${document.querySelector("#data-fim-certificado").value}T23:59:59Z`);

    if (!file) {
        alert("Faça upload do arquivo do certificado!");
        return;
    }

    uploadFile(file, title, description, institution, workload, startDate, endDate);
});

async function getUserData() {
    const url = "http://localhost:3000/api/users/me";

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        loadUserContent(data);
        loadCertificateCards(data.id);
    } catch (error) {
        console.error(error);
    }
}

function loadUserContent(data) {
    const userName = document.querySelectorAll(".user-name-span");

    userName.forEach(user => {
        user.textContent = data.name;
    });
}

async function loadCertificateCards(userId) {
    const url = `http://localhost:3000/api/certificates/user/${userId}?status=pending`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const certificates = await response.json();

        certificatesContainer.innerHTML = '';

        certificates.forEach(certificate => {
            createCertificateCard(certificate);
        });
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    getUserData();
});