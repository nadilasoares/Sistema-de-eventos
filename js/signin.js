const form = document.querySelector("#form-signin");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const url = "http://localhost:3000/api/users";

    try {
        const name = document.querySelector("#name-input").value.trim();
        const email = document.querySelector("#email-input").value.trim();
        const password = document.querySelector("#pass-input").value;
        const confirmPassword = document.querySelector("#confirm-pass-input").value;
        const matricula = document.querySelector("#matricula-input").value.trim();
        const cpf = document.querySelector("#cpf-input").value.trim();
        const alertContainer = document.querySelector("#alert");

        if (password !== confirmPassword) {
            alert("As senhas são diferentes!");
            return;
        }

        const response = await fetch("http://localhost:3000/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password,
                matricula,
                cpf
            })
        });

        if (!response.ok) {
            const alert = document.createElement("div");
            alert.classList.add("alert", "alert-danger", "w-100");
            alert.setAttribute("role", "alert");
            alert.textContent = "Dados inválidos!";
            alertContainer.appendChild(alert);
            form.reset();
            
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        form.reset();
        window.location.href = "./login.html";
    } catch (error) {
        console.error(error);
    }
});