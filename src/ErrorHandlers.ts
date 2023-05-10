import Express from "express";
import HTTPError from "./structs/HTTPError.js";
import Joi from "joi";

export function productionHandler(){
    return (err: any, req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        if(err.name === "ValidationError" && err.isJoi) {
            let validationError = err as Joi.ValidationError;

            res.status(400);
            return res.json({
                message: "Request validation error: " + validationError.message,
            });
        }

        res.status(err.status || 500);

        let response = {
            message: err.message,
            error: {}
        }

        if(err instanceof HTTPError && err.extras) {
            response = Object.assign(response, err.extras);
        }

        return res.json(response);
    }
}

export function developmentHandler(){
    return (err: any, req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        if(err.name === "ValidationError" && err.isJoi) {
            let validationError = err as Joi.ValidationError;

            res.status(400);
            return res.json({
                message: "Request validation error: " + validationError.message,
                error: err
            });
        }

        res.status(err.status || 500);

        let response = {
            message: err.message,
            error: err
        }

        if(err instanceof HTTPError && err.extras) {
            response = Object.assign(response, err.extras);
        }

        return res.json(response);
    }
}

export function notFoundHandler(){
    return (req: Express.Request, res: Express.Response, next: Express.NextFunction) =>  {
        let err = new HTTPError('Not Found', 404);
        next(err);
    }
}