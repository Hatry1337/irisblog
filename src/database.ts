import { Sequelize } from 'sequelize-typescript';
import { User } from "./models/User.js";
import { UserCredentials } from "./models/UserCredentials.js";
import { Attachment } from "./models/Attachment.js";
import { BlogPost } from "./models/BlogPost.js";


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