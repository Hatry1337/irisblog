import Express from "express";
import jwt from "jsonwebtoken";
import HTTPError from "../../structs/HTTPError";
import {IUserJWTPayload, JWTManager} from "../../JWTManager";

import routeProfile from "./profile/profile";

const routeUserAPI = Express.Router();

export interface UserAPIRequest extends Express.Request {
    userapi: {
        userId: number;
        username: string;
    }
}

routeUserAPI.use((async (req: UserAPIRequest, res: Express.Response, next: Express.NextFunction) => {
    let token = req.headers.authorization || req.body.token || req.query.token;

    if(!token || typeof token !== "string") {
        return next(new HTTPError(
            "Unauthorized.",
            401,
        ));
    }

    let userJwt: jwt.Jwt | jwt.JwtPayload | IUserJWTPayload | string;
    try {
        userJwt = await JWTManager.verify(token)
    } catch (e) {
        if(e instanceof jwt.TokenExpiredError) {
            return next(new HTTPError(
                "Token expired.",
                401,
            ));
        }
        if(e instanceof jwt.NotBeforeError) {
            return next(new HTTPError(
                "Token is not active yet.",
                401,
            ));
        }
        if(e instanceof jwt.JsonWebTokenError) {
            return next(new HTTPError(
                "Incorrect token provided.",
                403,
            ));
        }
        return next(e);
    }

    if(typeof userJwt === "string") {
        return next(new HTTPError(
            "Incorrect jwt token schema.",
            400,
        ));
    }

    if("username" in userJwt) {
        req.userapi = {
            username: userJwt.username,
            userId: userJwt.userId
        }
    } else {
        req.userapi = {
            username: userJwt.payload.username,
            userId: userJwt.payload.userId
        }
    }
    return next();
}) as unknown as Express.RequestHandler);

routeUserAPI.use("/profile",   routeProfile);

export default routeUserAPI;