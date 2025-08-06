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