import Express from "express";
import HTTPError from "./structs/HTTPError";

export function productionHandler(){
    return (err: any, req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        res.status(err.status || 500);

        let response = {
            message: err.message,
            error: {}
        }

        if(err instanceof HTTPError && err.extras) {
            response = Object.assign(response, err.extras);
        }

        res.json(response);
    }
}

export function developmentHandler(){
    return (err: any, req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        res.status(err.status || 500);

        let response = {
            message: err.message,
            error: err
        }

        if(err instanceof HTTPError && err.extras) {
            response = Object.assign(response, err.extras);
        }

        res.json(response);
    }
}

export function notFoundHandler(){
    return (req: Express.Request, res: Express.Response, next: Express.NextFunction) =>  {
        let err = new HTTPError('Not Found', 404);
        next(err);
    }
}