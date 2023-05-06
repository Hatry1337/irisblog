import { Table, Model, Column, DataType, Scopes, HasOne } from "sequelize-typescript";
import { UserCredentials } from "./UserCredentials";

@Scopes(() => ({
    full: {
        include: [
            { model: UserCredentials,   as: "credentials" },
        ]
    },
    credentials: {
        include: [
            { model: UserCredentials,   as: "credentials" },
        ]
    }
}))
@Table({
    timestamps: true,
})
export class User extends Model<User> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    declare userId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare username: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare firstName: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    declare lastName: string | null;


    @HasOne(() => UserCredentials)
    declare credentials: UserCredentials;
}