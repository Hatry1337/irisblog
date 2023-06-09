import Express from "express";

import routeAuth from "./auth/auth.js";
import routeUserAPI from "./userapi/userapi.js";

const routeRoot = Express.Router();

routeRoot.use("/auth",      routeAuth);
routeRoot.use("/userapi",   routeUserAPI);

export default routeRoot;