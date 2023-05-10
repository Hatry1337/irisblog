import Express from "express";

import routeAuthRegister from "./register.js";
import routeAuthLogin from "./login.js";

const routeAuth = Express.Router();

routeAuth.use("/register",  routeAuthRegister);
routeAuth.use("/login",     routeAuthLogin);

export default routeAuth;