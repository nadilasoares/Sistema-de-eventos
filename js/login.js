// Refatorar funções em arquivo separado para evitar repetição de código

const form = document.querySelector("#user-form");

function createAlert(content) {
    if (content) {
        alertRemove();

        const alertContainer = document.querySelector("#alert");
        const alert = document.createElement("div");
        alert.classList.add("alert", "alert-danger", "w-100", "text-center");
        alert.setAttribute("role", "alert");
        alert.textContent = content;
        alertContainer.appendChild(alert);
    }
}

function alertRemove() {
    const alertDanger = document.querySelector(".alert-danger");

    if (alertDanger) {
        alertDanger.remove();
    }
}

// Alterar fluxo com POST
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const url = "http://localhost:3000/api/users/login";

    try {
        // Campos de login
        const email = document.querySelector("#usuario-nome").value.trim();
        const password = document.querySelector("#usuario-senha").value.trim();

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            const error = data.error.toLowerCase();
            let input = null;

            if (error.includes("user") || error.includes("email") ||error.includes("e-mail")) {
                input = document.querySelector("#usuario-nome");
            }else if (error.includes("password")) {
                input = document.querySelector("#usuario-senha");
            }

            if (input) {
                const wrapper = input.closest('.label-float');

                if (wrapper) {
                    const label = wrapper.querySelector('label');
                    input.classList.add("border", "border-danger");
                    label.classList.add("text-danger");
                }
            }

            createAlert(data.error);

            throw new Error(`Response status: ${response.status}`);
        }

        if (data.token) {
            localStorage.setItem('authToken', data.token);
            console.log(localStorage.getItem('authToken'));
            // window.location.href = '../pages/certificates.html';
        }
    } catch (error) {
        console.error(error);
    }
});