import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "./User";

@Table({
    timestamps: true,
})
export class UserCredentials extends Model<UserCredentials> {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare userId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare passHash: string;


    @BelongsTo(() => User)
    declare user: User;
}