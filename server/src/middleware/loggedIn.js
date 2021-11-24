import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const loggedInMiddleware = (req, res, next) => {
    const {authorization} = req.headers;
    const {TOKEN_SECRET} = process.env;
    if (!authorization) {
        return res.sendStatus(403);
    }

    const [, token] = authorization.split(" ");

    try {
        const parsed = jwt.verify(token, TOKEN_SECRET);
        req.token = parsed;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).send({
                error: error.message,
            });
        }
    }
};
