const apiRoutes = {
    user: "users",
    userMe: "users/me",
    userLogin: "users/login",
    certificate: "certificates",
    certificateMonth: "certificates/reference-month",
};

function getUrl(route) {
    const url = `http://localhost:3000/api/${route}`;

    return url;
}

const token = localStorage.getItem('authToken');