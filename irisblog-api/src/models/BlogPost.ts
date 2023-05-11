import { Table, Model, Column, DataType, ForeignKey, BelongsTo, Scopes } from "sequelize-typescript";
import { User } from "./User.js";
import { Attachment } from "./Attachment.js";
import { nanoid } from 'nanoid'

@Scopes(() => ({
    full: {
        include: [
            //{ model: Attachment,    as: "attachments" },
            { model: User,          as: "author" },
        ]
    },
    attachments: {
        include: [
            { model: Attachment, as: "attachments" },
        ]
    },
    author: {
        include: [
            { model: User, as: "author" },
        ]
    },
}))
@Table({
    timestamps: true,
})
export class BlogPost extends Model<BlogPost> {
    @Column({
        type: DataType.STRING,
        primaryKey: true,
        allowNull: false,
        defaultValue: () => nanoid()
    })
    declare postId: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare postHeader: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    declare postBody: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare authorId: string;


    @BelongsTo(() => User)
    declare author: User;
}