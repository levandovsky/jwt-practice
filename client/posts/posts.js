import { navigate } from "../helpers/navigate.js";

const list = document.getElementById("list");
const addPostBtn = document.getElementById("addPostBtn");

const main = async () => {
    const token = sessionStorage.getItem("token");
    try {
        const response = await fetch("http://localhost:8080/posts", {
            method: "GET",
            headers: {
                authorization: `Bearer ${token}`,
            },
        });

        const {posts} = await response.json();

        posts.forEach((post) => {
            const li = document.createElement("li");
            li.innerHTML = post.message;
            list.appendChild(li);
        });
    } catch (error) {}

    addPostBtn.onclick = () => navigate("posts/add-post")
};

main();
