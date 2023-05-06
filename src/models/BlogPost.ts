import { Table, Model, Column, DataType, ForeignKey, BelongsTo, Scopes } from "sequelize-typescript";
import { User } from "./User";
import { Attachment } from "./Attachment";

@Scopes(() => ({
    full: {
        include: [
            { model: Attachment, as: "attachments" },
        ]
    },
    attachments: {
        include: [
            { model: Attachment, as: "attachments" },
        ]
    },
}))
@Table({
    timestamps: true,
})
export class BlogPost extends Model<BlogPost> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    declare postId: number;

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
        type: DataType.INTEGER,
        allowNull: false
    })
    declare authorId: number;


    @BelongsTo(() => User)
    declare author: User;
}