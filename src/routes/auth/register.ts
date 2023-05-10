import Express from "express";
import log4js from "log4js";
import Joi from "joi";
import bcrypt from "bcrypt";

import HTTPError from "../../structs/HTTPError.js";
import { User } from "../../models/User.js";
import { UserCredentials } from "../../models/UserCredentials.js";

const routeAuthRegister = Express.Router();
const logger = log4js.getLogger("app");

export interface IRegisterRequest {
    username: string;
    email: string;
    first_name: string;
    last_name?: string;
    password: string;
    password_repeat: string;
}

const RegisterRequestSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    email: Joi.string()
        .email()
        .required(),

    first_name: Joi.string()
        .pattern(new RegExp(`[a-zA-Z]{2,30}$`))
        .required(),

    last_name: Joi.string()
        .pattern(new RegExp(`[a-zA-Z]{2,30}$`))
        .optional(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9$!@_%^*&()]{3,30}$'))
        .required(),

    password_repeat: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9$!@_%^*&()]{3,30}$'))
        .required(),
});

routeAuthRegister.post("/", async (req, res, next) => {
    try {
        if(req.headers.authorization) {
            return next(new HTTPError(
                "Already authorized",
                400,
            ));
        }

        let validatedBody = await RegisterRequestSchema.validateAsync(req.body) as IRegisterRequest;

        if(validatedBody.password !== validatedBody.password_repeat) {
            return next(new HTTPError(
                "Passwords does not match.",
                400,
            ));
        }

        let existingUsername = await User.findOne({
            where: {
                username: validatedBody.username
            },
            attributes: [ "username"]
        });

        if(existingUsername) {
            return next(new HTTPError(
                "Username already in use.",
                403,
            ));
        }

        let existingEmail = await User.findOne({
            where: {
                email: validatedBody.email
            },
            attributes: [ "email" ]
        });

        if(existingEmail) {
            return next(new HTTPError(
                "Email already in use.",
                403,
            ));
        }

        let passHash = await bcrypt.hash(validatedBody.password, 10);

        let user = await User.create({
            username: validatedBody.username,
            email: validatedBody.email,
            firstName: validatedBody.first_name,
            lastName: validatedBody.last_name,
            credentials: {
                passHash
            }
        } as User, {
            include: [ UserCredentials ]
        });

        return res.json({
            success: true,
            username: user.username
        });
    } catch (error: any) {
        if(error instanceof HTTPError || error.isJoi) {
            return next(error);
        }

        logger.error("Authorization:auth/register", error);
        let err = new HTTPError('Something went wrong...', 500);
        return next(err);
    }
});

export default routeAuthRegister;