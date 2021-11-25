import {navigate} from "../helpers/navigate.js";
const loginForm = document.getElementById("login-form");

const login = async (username, password) => {
    try {
        const response = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        const data = await response.json();

        if (data.error) throw new Error(data.error);

        sessionStorage.setItem("token", data.token);

        navigate("posts/posts");
    } catch (error) {
        console.error(error);
    }
};

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = new FormData(loginForm);
    const [username, password] = form.values();

    await login(username, password);
});
