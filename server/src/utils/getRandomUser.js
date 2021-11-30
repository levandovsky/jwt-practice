import fetch from "node-fetch";

const getRandomUser = async () => {
    try {
        const response = await fetch("https://randomuser.me/api/");
        const {results} = await response.json();
        const [
            {
                login: {username, password},
            },
        ] = results;

        return {
            username,
            password,
        };
    } catch (error) {
        console.error("getRandomUser", error);
        throw error;
    }
};

export default getRandomUser;
