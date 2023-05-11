import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "./User.js";

@Table({
    timestamps: true,
})
export class UserCredentials extends Model<UserCredentials> {
    @ForeignKey(() => User)
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare userId: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare passHash: string;


    @BelongsTo(() => User)
    declare user: User;
}