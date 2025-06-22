// src/services/googleAuth.service.ts

import UserService from "./users.service";

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

export const loginWithCredentials = async (email: string, password: string) => {
    try {
        const userFromDB = await userService.getByEmail(email);

        // if (!userFromDB) {
        //     return null;
        // }

        // const isPasswordCorrect = await userFromDB.checkPassword(password);

        // if (!isPasswordCorrect) {
        //     return null;
        // }

        return userFromDB;
    } catch (error) {
        console.log("LOG: ~ error:", error);
        return null;
    }
};

// async checkPassword(enteredPassword: string) {
//     const isPasswordCorrect = await bcrypt.compare(
//         enteredPassword,
//         this.password
//     );
//     return isPasswordCorrect;
// }
