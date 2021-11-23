import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const main = async () => {
    try {
        const {MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PW, MYSQL_DB} = process.env;

        const connection = await mysql.createConnection({
            host: MYSQL_HOST,
            port: MYSQL_PORT,
            user: MYSQL_USER,
            password: MYSQL_PW,
            database: MYSQL_DB,
        });

        const createUsersTable = `CREATE TABLE IF NOT EXISTS Users (
            id INTEGER AUTO_INCREMENT NOT NULL,
            username VARCHAR (50) NOT NULL,
            password CHAR (60) NOT NULL,
            PRIMARY KEY (id),
            UNIQUE (username)
        )`;

        const createPostsTable = `CREATE TABLE IF NOT EXISTS Posts (
            id INTEGER AUTO_INCREMENT NOT NULL,
            user_id INTEGER NOT NULL,
            message TEXT NOT NULL,
            PRIMARY KEY (id),
            FOREIGN KEY (user_id) REFERENCES Users (id)
        )`;

        await connection.query(createUsersTable);

        await connection.query(createPostsTable);

        const app = express();

        app.use(express.json());

        app.get("/", (req, res) => {
            res.send({
                users,
            });
        });

        app.get("/posts", async (req, res) => {
            const {authorization} = req.headers;

            if (!authorization) {
                return res.sendStatus(403);
            }

            const [, token] = authorization.split(" ");

            try {
                const parsed = jwt.verify(token, "secret");
                const query = "SELECT * FROM Posts WHERE user_id = ?"
                const [posts] = await connection.query(query, [parsed.user_id])
                res.send({
                    posts,
                });
            } catch (error) {
                if (error instanceof jwt.JsonWebTokenError) {
                    return res.status(403).send({
                        error: error.message,
                    });
                }
                res.status(500).send({
                    error: error.message,
                });
            }
        });

        app.post("/posts", async (req, res) => {
            // validate user token, and add post by user_id
            const {authorization} = req.headers;

            if (!authorization) {
                return res.sendStatus(403);
            }

            const [, token] = authorization.split(" ");
            
        })

        app.post("/register", async (req, res) => {
            const {username, password} = req.body;

            try {
                const hashed = await bcrypt.hash(password, 10);
                const query = "INSERT INTO Users (username, password) VALUES (?, ?);";

                await connection.query(query, [username, hashed]);

                res.send({
                    registered: username,
                });
            } catch (error) {
                res.status(500).send({
                    error: error.message,
                });
            }
        });

        app.post("/login", async (req, res) => {
            const {username, password} = req.body;

            try {
                const query = "SELECT * FROM Users WHERE username = ?";
                const [result] = await connection.query(query, [username]);
                const [user] = result;

                if (!user) {
                    return res.status(404).send({
                        message: "Incorrect username or password",
                    });
                }

                const validPw = await bcrypt.compare(password, user.password);

                if (!validPw) {
                    return res.status(404).send({
                        message: "Incorrect username or password",
                    });
                }

                const token = jwt.sign({user_id: user.id}, "secret");

                res.send({
                    token,
                });
            } catch (error) {
                res.status(500).send({
                    error: error.message,
                });
            }
            // const user = users.find((u) => u.username === username);

            // if (!user) {
            //     return res.sendStatus(404);
            // }

            // const validPw = await bcrypt.compare(password, user.password);

            // if (!validPw) {
            //     return res.sendStatus(403);
            // }

            // const token = jwt.sign({username}, "secret");

            // res.send({
            //     token,
            // });
        });

        app.listen(8080, () => {
            console.log("listening");
        });
    } catch (e) {
        console.log(e);
    }
};

main();
