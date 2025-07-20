import APP_CONSTANT from "../constants/AppConfig";
import crypto from "crypto";
import jwt from "jsonwebtoken";

type Token = {
    userId: number;
    userType: string;
    loginType: string;
};

const accessToken = ({ userId, userType, loginType }: Token) => {
    const token = jwt.sign(
        { id: userId, userType, loginType },
        APP_CONSTANT.JWT_ACCESS_SECRET as string,
        {
            expiresIn: "15m",
        }
    );
    return token;
};

const refreshToken = ({ userId, userType, loginType }: Token) => {
    const token = jwt.sign(
        { id: userId, userType, loginType },
        APP_CONSTANT.JWT_REFRESH_SECRET as string,
        {
            expiresIn: "7d",
        }
    );
    return token;
};

const decodeToken = (token: string) => {
    const decoded = jwt.verify(token, APP_CONSTANT.JWT_ACCESS_SECRET as string);

    if (
        typeof decoded === "object" &&
        "id" in decoded &&
        "loginType" in decoded &&
        typeof decoded.id === "number" &&
        typeof decoded.loginType === "string"
    ) {
        return decoded as {
            id: number;
            userType: string;
            loginType: string;
        };
    } else {
        return undefined;
    }
};

const generateVerificationToken = () => crypto.randomBytes(32).toString("hex");

export default {
    accessToken,
    refreshToken,
    generateVerificationToken,
    decodeToken,
};
