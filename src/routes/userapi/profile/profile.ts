import Express from "express";
import { UserAPIRequest } from "../userapi";
import { User } from "../../../models/User";
import HTTPError from "../../../structs/HTTPError";

const routeProfile = Express.Router();

routeProfile.get("/:userId?", (async (req: UserAPIRequest, res: Express.Response, next: Express.NextFunction) => {
    let user = await User.findOne({
        where: {
            userId: req.params.userId || req.userapi.userId
        }
    });

    if(!user) {
        return next(new HTTPError(
            "User not found.",
            404,
        ));
    }

    return res.json({
        username: user.username,
        first_name: user.firstName,
        last_name: user.lastName ?? undefined,
        registration_date: user.createdAt
    });
}) as unknown as Express.RequestHandler);

export default routeProfile;