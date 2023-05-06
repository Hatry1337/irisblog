import { Sequelize } from 'sequelize-typescript';
import { Attachment } from "./models/Attachment";
import { BlogPost } from "./models/BlogPost";
import { User } from "./models/User";
import { UserCredentials } from "./models/UserCredentials";

const sequelize = new Sequelize(process.env.DB_URI, {
    models: [
        Attachment,
        BlogPost,
        User,
        UserCredentials,
    ],
    logging: false
});

export default sequelize;