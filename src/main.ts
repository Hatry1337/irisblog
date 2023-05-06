import "dotenv/config";
import Express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { developmentHandler, notFoundHandler, productionHandler } from "./ErrorHandlers";
import log4js from "log4js";
import { requestLogger } from "./RequestLogger";
import sequelize from "./database";
import routeRoot from "./routes/root";
import { JWTManager } from "./JWTManager";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DB_URI: string;
            LOGS_DIR: string;
            JWT_RSA_PRIVATE_KEY: string;
            MAX_SESSIONS_PER_USER: number;
        }
    }
}

const LOGS_DIR = process.env.LOGS_DIR || ".";

log4js.configure({
    appenders: {
        console:    { type: 'console' },
        requests:   { type: 'file', filename: LOGS_DIR + '/requests.log' },
        app:        { type: 'file', filename: LOGS_DIR + '/app.log' },
    },
    categories: {
        default:  { appenders: ['console', 'app'],      level: 'info' },
        app:      { appenders: ['console', 'app'],      level: 'info' },
        req:      { appenders: ['console', 'requests'], level: 'info' },
    }
});

const logger = log4js.getLogger("app");
const app = Express();

//initialize JWTManager with rsa key files
if(!process.env.JWT_RSA_PRIVATE_KEY) {
    logger.error("'JWT_RSA_PRIVATE_KEY' env var is not provided but required.");
    process.exit(1);
}
JWTManager.Init(process.env.JWT_RSA_PRIVATE_KEY);

app.use(requestLogger(log4js.getLogger("req")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/", routeRoot);
app.set('port', process.env.PORT || 8081);

app.use(notFoundHandler());
if (app.get('env') === 'development') {
    app.use(developmentHandler());
}
app.use(productionHandler());

const server = app.listen(app.get('port'), async () => {
    logger.info(`Express server started on port ${app.get("port")}!`);

    logger.info(`Synchronizing database...`);
    await sequelize.sync({ force: false });
    logger.info(`IrisBlog is ready to serve requests.`);
});

process.on("SIGINT", async () => {
    logger.warn("Received 'SIGINT' from user. Stopping server...");
    server.close();
    logger.info("Server stopped.");
    process.exit(130);
});