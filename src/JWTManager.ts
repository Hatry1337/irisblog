import jwt from "jsonwebtoken";
import fs from "fs";

export interface IUserJWTPayload {
    username: string;
    userId: number;
}

export class JWTManager {
    private static privateKey: string;

    public static Init(privateKeyPath: string) {
        JWTManager.privateKey = fs.readFileSync(privateKeyPath, "utf-8");
    }

    public static sign(payload: string | Buffer | object, options?: jwt.SignOptions): Promise<string> {
        return new Promise<string>((res, rej) => {
            jwt.sign(payload, JWTManager.privateKey, { ...options, algorithm: "RS256" },
                (error, encoded) => {
                    if(error) {
                        return rej(error);
                    }
                    return res(encoded!);
                }
            );
        });
    }

    public static verify(token: string, options?: jwt.VerifyOptions): Promise<string | jwt.Jwt | jwt.JwtPayload> {
        return new Promise<string | jwt.Jwt | jwt.JwtPayload>((res, rej) => {
            jwt.verify(token, JWTManager.privateKey, { ...options, algorithms: [ "RS256" ] },
                (error, decoded) => {
                    if(error) {
                        return rej(error);
                    }
                    return res(decoded!);
                }
            );
        });
    }
}