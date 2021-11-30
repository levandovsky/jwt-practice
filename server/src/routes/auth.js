import {Router} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import joi from "joi";

import getRandomUser from "../utils/getRandomUser.js";

dotenv.config();

const router = Router();

const userInfoSchema = joi.object({
    username: joi.string().max(50),
    password: joi.string().min(8),
});

router.post("/register", async (req, res) => {
    const {mysql} = req.app;

    try {
        const {username, password} = await userInfoSchema.validateAsync(req.body);
        const hashed = await bcrypt.hash(password, 10);
        const query = "INSERT INTO Users (username, password) VALUES (?, ?);";

        await mysql.query(query, [username, hashed]);

        res.send({
            registered: username,
        });
    } catch (error) {
        res.status(500).send({
            error: error.message,
        });
    }
});

router.post("/register/random", async (req, res) => {
    const {mysql} = req.app;
    try {
        const {username, password} = await getRandomUser();

        const hashed = await bcrypt.hash(password, 10);
        const query = "INSERT INTO Users (username, password) VALUES (?, ?);";

        await mysql.query(query, [username, hashed]);

        res.send({
            registered: {
                username,
                password
            },
        });

    } catch (error) {
        res.status(500).send({
            error: error.message,
        });
    }
});

router.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const {mysql} = req.app;

    try {
        const query = "SELECT * FROM Users WHERE username = ?";
        const [result] = await mysql.query(query, [username]);
        const [user] = result;

        if (!user) {
            return res.status(404).send({
                error: "Incorrect username or password",
            });
        }

        const validPw = await bcrypt.compare(password, user.password);

        if (!validPw) {
            return res.status(404).send({
                error: "Incorrect username or password",
            });
        }

        const token = jwt.sign({user_id: user.id}, process.env.TOKEN_SECRET);

        res.send({
            token,
        });
    } catch (error) {
        res.status(500).send({
            error: error.message,
        });
    }
});

export default router;
