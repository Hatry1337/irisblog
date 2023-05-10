import Express from "express";
import { UserAPIRequest } from "../userapi.js";
import { User } from "../../../models/User.js";
import HTTPError from "../../../structs/HTTPError.js";
import { Op } from "sequelize";

const routeProfile = Express.Router();

routeProfile.get("/:usernameOrId?", (async (req: UserAPIRequest, res: Express.Response, next: Express.NextFunction) => {
    let user = await User.findOne({
        where: {
            [Op.or]:
                req.params.usernameOrId
                    ? {
                        username: req.params.usernameOrId,
                        userId: req.params.usernameOrId
                    }
                    : {
                        userId: req.userapi.userId,
                    }
        }
    });

    if(!user) {
        return next(new HTTPError(
            "User not found.",
            404,
        ));
    }

    return res.json({
        id: user.userId,
        username: user.username,
        first_name: user.firstName,
        last_name: user.lastName ?? undefined,
        registration_date: user.createdAt
    });
}) as unknown as Express.RequestHandler);

export default routeProfile;