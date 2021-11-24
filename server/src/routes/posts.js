import {Router} from "express";
import {loggedInMiddleware} from "../middleware/loggedIn.js";
import joi from "joi";

const router = Router();

router.get("/", loggedInMiddleware, async (req, res) => {
    try {
        const {mysql} = req.app;
        const {user_id} = req.token;
        const query = "SELECT * FROM Posts WHERE user_id = ?;";
        const [posts] = await mysql.query(query, [user_id]);

        res.send({
            posts,
        });
    } catch (error) {
        res.status(500).send({
            error: error.message,
        });
    }
});

router.post("/", loggedInMiddleware, async (req, res) => {
    const {mysql} = req.app;

    try {
        const query = `
            INSERT INTO Posts (user_id, message)
            VALUES (?, ?)
        `;
        const user_id = await joi.number().validateAsync(req.token.user_id)
        const message = await joi.string().validateAsync(req.body.message);

        const [{insertId}] = await mysql.query(query, [user_id, message]);

        res.status(201).send({
            post: {
                id: insertId,
                user_id,
                message,
            },
        });
    } catch (error) {
        res.status(500).send({
            error: error.message,
        });
    }
});

export default router;
