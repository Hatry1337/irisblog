import Express from "express";

import routeAuth from "./auth/auth";
import routeUserAPI from "./userapi/userapi";

const routeRoot = Express.Router();

routeRoot.use("/auth",      routeAuth);
routeRoot.use("/userapi",   routeUserAPI);

export default routeRoot;