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

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const url = "http://localhost:3000/api/users";

    try {
        // Campos de login
        const email = document.querySelector("#usuario");
        const password = document.querySelector("#senha").value;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);


        const userEmailExists = data.some(user => (user.email.toLowerCase().trim() === email.value.toLowerCase().trim()));

        if (!userEmailExists) {
            createAlert("E-mail não cadastrado!");

            const wrapper = email.closest(".label-float");

            if (wrapper) {
                const label = wrapper.querySelector('label');
                email.style.borderColor = "#C7110A";
                label.style.color = "#C7110A";
            }

            return;
        } else {
            console.log("E-mail existe!");
        }

    } catch (error) {
        console.error(error);
    }
});