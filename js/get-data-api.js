const apiRoutes = {
    user: "users",
    userMe: "users/me",
    userLogin: "users/login",
    certificate: "certificates",
    certificate: "certificates/reference-month",
};

function getHeaderData(token) {
    const headers = {
        aplicationJson: 'application/json'
    };

    if (token) {
        headers[bearerToken] = `Bearer ${token}`;
    }

    return headers;
}

function getUrl(route) {
    const url = `http://localhost:3000/api/${route}`;

    return url;
}

async function getData(route, token) {
    try {
        const header = getHeaderData(token);
        const response = await fetch(getUrl(route), {
            method: "GET",
            headers: {
                header
            }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();

        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

function errorMessage(data, route) {
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

    if (route.includes(apiRoutes.user)) {
        if (route == apiRoutes.userLogin) {
            if (error.includes("user") || error.includes("email") || error.includes("e-mail")) {
                input = document.querySelector("#usuario-nome");
            } else if (error.includes("password")) {
                input = document.querySelector("#usuario-senha");
            }
        }
        else if (route == apiRoutes.user) {
            if (error.includes("user")) {
                input = document.querySelector(".label-float #name-input");
            } else if (error.includes("email") || error.includes("e-mail")) {
                input = document.querySelector(".label-float #email-input");
            } else if (error.includes("matricula") || error.includes("matrícula")) {
                input = document.querySelector(".label-float #matricula-input");
            } else if (error.includes("cpf")) {
                input = document.querySelector(".label-float #cpf-input");
            } else if (error.includes("password")) {
                input = document.querySelector(".label-float #pass-input");
            }
        }

        if (input) {
            const wrapper = input.closest('.label-float');

            if (wrapper) {
                const label = wrapper.querySelector('label');
                input.classList.add("border", "border-danger");
                label.classList.add("text-danger");
            }
        }
    }

    createAlert(data.error);
}

async function postData(route, token, bodyContent) {
    try {
        const header = getHeaderData(token);
        const response = await fetch(getUrl(route), {
            method: "POST",
            headers: {
                header
            },
            body: JSON.stringify(bodyContent)
        });

        const data = await response.json();

        if (!response.ok) {
            errorMessage(data, route);
            throw new Error(`Response status: ${response.status}`);
        }

        if (route === apiRoutes.userLogin) {
            if (data.token) {
                localStorage.setItem('authToken', data.token);

                if (data.user.role == "participant") {
                    window.location.href = '../pages/certificates.html';
                } else {
                    window.location.href = '../pages/tutoria.html';
                }
            }
        }


        console.log(data);
    } catch (error) {
        console.error(error);
    }
}