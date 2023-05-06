import Express from "express";

import routeAuthRegister from "./register";
import routeAuthLogin from "./login";

const routeAuth = Express.Router();

routeAuth.use("/register",  routeAuthRegister);
routeAuth.use("/login",     routeAuthLogin);

export default routeAuth;