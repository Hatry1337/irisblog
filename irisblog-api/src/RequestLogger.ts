import log4js from "log4js";
import Express, { Request, Response } from "express";

export function requestLogger(logger: log4js.Logger){
    function logReq(req: Request, res: Response) {
        logger.info(`[${req.method}] [${res.statusCode}] ${req.ip} =>`, req.originalUrl,
            (req.app.get('env') === 'development') ? (`\n${" ".repeat(39)}Body: ` + JSON.stringify(req.body)) : "",
            (req.app.get('env') === 'development') ? (`\n${" ".repeat(39)}Params: ` + JSON.stringify(req.params)) : "");
    }
    return (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        if(res.headersSent) {
            logReq(req, res);
        }else{
            res.on('finish', () => {
                logReq(req, res);
            });
        }
        next();
    }
}