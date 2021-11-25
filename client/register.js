import {navigate} from "./helpers/navigate.js";
const registerForm = document.getElementById("register-form");

const register = async (username, password) => {
    try {
        const response = await fetch("http://localhost:8080/auth/register", {
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

        navigate("login/login");
    } catch (error) {
        console.error(error);
    }
};

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = new FormData(registerForm);
    const [username, password] = form.values();

    await register(username, password);
});
