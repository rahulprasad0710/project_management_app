import AppError from "../utils/AppError";
import { ErrorType } from "../enums/Eums";
import UserService from "./users.service";
// src/services/googleAuth.service.ts
import bcrypt from "bcryptjs";

const userService = new UserService();

export interface GoogleUserInfo {
    sub: string; // Google user ID
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
}

export const getGoogleUserInfo = async (
    accessToken: string
): Promise<GoogleUserInfo | null | undefined> => {
    try {
        const res = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const data = await res.json();

        if (!data.email) {
            return null;
        }

        return data;
    } catch (error) {
        console.log("LOG: ~ error:", error);
        return null;
    }
};

// ! # USER LOGGING IN WITH CREDENTIALS
const loginWithCredentials = async (email: string, password: string) => {
    const userFromDB = await userService.getByEmail(email);

    if (!userFromDB) {
        throw new AppError("User not found", 401, ErrorType.NOT_FOUND_ERROR);
    }

    const isPasswordCorrect = await checkPassword(
        password,
        userFromDB.password
    );

    if (!isPasswordCorrect) {
        throw new AppError(
            "Invalid user credentials",
            401,
            ErrorType.AUTH_ERROR
        );
    }

    if (!userFromDB.emailVerified) {
        throw new AppError("Email not verified", 401, ErrorType.AUTH_ERROR);
    }

    return userFromDB;
};

const checkPassword = async (enteredPassword: string, realPassword: string) => {
    const isPasswordCorrect = await bcrypt.compare(
        enteredPassword,
        realPassword
    );
    return isPasswordCorrect;
};

const verifyEmailAndSetPassword = async ({
    id,
    password,
    token,
}: {
    id: number;
    password: string;
    token: string;
}) => {
    if (!token)
        throw new AppError(
            "Invalid or expired token",
            400,
            ErrorType.AUTH_ERROR
        );

    const user = await userService.getById(id);
    if (!user) {
        throw new AppError("User not found", 401, ErrorType.NOT_FOUND_ERROR);
    }

    console.log({
        user,
    });

    if (user.emailVerified || user.isActive || user.verifyEmailToken == null) {
        throw new AppError(
            "Something Went Wrong.",
            500,
            ErrorType.INTERNAL_SERVER_ERROR
        );
    }

    const isTokenVerified = token === user.verifyEmailToken;

    if (!isTokenVerified) {
        throw new AppError(
            "Invalid or expired token",
            400,
            ErrorType.AUTH_ERROR
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const response = await userService.confirmUser({
        userId: id,
        password: hashedPassword,
    });
    return {
        id,
    };
};

export default {
    loginWithCredentials,
    verifyEmailAndSetPassword,
};
