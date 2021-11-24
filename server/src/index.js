import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import postsRouter from "./routes/posts.js";
import authRouter from "./routes/auth.js";
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

        app.mysql = connection;

        app.use(express.json());

        app.use("/posts", postsRouter);

        app.use("/auth", authRouter)

        app.listen(8080, () => {
            console.log("listening");
        });
    } catch (e) {
        console.log(e);
    }
};

main();
