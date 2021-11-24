import {navigate} from "./helpers/navigate.js.js";

const textarea = document.getElementById("message");

const button = document.getElementById("add");

button.onclick = async () => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await fetch("http://localhost:8080/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                message: textarea.value,
            }),
        });

        const data = await response.json();

        if (data.error) throw new Error(data.error);

        navigate("posts");
    } catch (error) {}
};
