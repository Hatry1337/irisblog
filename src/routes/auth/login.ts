import Express from "express";
import log4js from "log4js";
import Joi from "joi";
import bcrypt from "bcrypt";

import HTTPError from "../../structs/HTTPError";
import { User } from "../../models/User";
import { UserCredentials } from "../../models/UserCredentials";
import { IUserJWTPayload, JWTManager } from "../../JWTManager";

const routeAuthLogin = Express.Router();
const logger = log4js.getLogger("app");

export interface ILoginRequest {
    username?: string;
    email?: string;
    password: string;
    session_ttl?: number;
}

const LoginRequestSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30),

    email: Joi.string()
        .email(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9$!@_%^*&()]{3,30}$'))
        .required(),

    session_ttl: Joi.number()
        .min(10 * 60)               // min session time to live 10 minutes
        .max(365 * 24 * 60 * 60)    // max session time to live 1 year
        .default(30 * 24 * 60 * 60)
        .optional(),
})
    .xor('username', 'email');

routeAuthLogin.post("/", async (req, res, next) => {
    try {
        if(req.headers.authorization) {
            return next(new HTTPError(
                "Already authorized",
                400,
            ));
        }

        let validatedBody = await LoginRequestSchema.validateAsync(req.body) as ILoginRequest;

        let user = await User.findOne({
            where: validatedBody.username
                ? { username: validatedBody.username }
                : { email: validatedBody.email }
            ,
            include: [ UserCredentials ]
        });

        if(!user) {
            return next(new HTTPError(
                "Incorrect username/email or password.",
                403,
            ));
        }

        let isPassValid = await bcrypt.compare(validatedBody.password, user.credentials.passHash);

        if(!isPassValid) {
            return next(new HTTPError(
                "Incorrect username/email or password.",
                403,
            ));
        }

        let jwt = await JWTManager.sign({
            userId: user.userId,
            username: user.username,
        } as IUserJWTPayload, {
            expiresIn: validatedBody.session_ttl
        });

        return res.json({
            success: true,
            jwt
        });
    } catch (error: any) {
        if(error.name === "ValidationError" && error.isJoi) {
            let validationError = error as Joi.ValidationError;

            return next(new HTTPError(
                "Request validation error: " + validationError.message,
                400
            ));
        }

        if(error instanceof HTTPError) {
            return next(error);
        }

        logger.error("Authorization:auth/login", error);
        let err = new HTTPError('Something went wrong...', 500);
        return next(err);
    }
});

export default routeAuthLogin;