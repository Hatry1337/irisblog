import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "./User";

export enum AttachmentFileType {
    Image   = "image",
    Video   = "video",
    Audio   = "audio",
    Binary  = "binary",
}

@Table({
    timestamps: true,
})
export class Attachment extends Model<Attachment> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    declare attachmentId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare originalFileName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare fileExtension: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare fileMD5Hash: string;

    @Column({
        type: DataType.ENUM<string>(
            AttachmentFileType.Image,
            AttachmentFileType.Video,
            AttachmentFileType.Audio,
            AttachmentFileType.Binary,
        ),
        allowNull: false
    })
    declare fileType: AttachmentFileType;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    declare isPublic: boolean;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare uploaderId: number;


    @BelongsTo(() => User)
    declare uploader: User;
}