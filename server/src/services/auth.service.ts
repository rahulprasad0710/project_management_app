// src/services/googleAuth.service.ts

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
    console.log({
        accessToken,
    });
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

        console.log("LOG: ~ data:", data);

        if (!data.email) {
            return null;
        }

        return data;
    } catch (error) {
        console.log("LOG: ~ error:", error);
        return null;
    }
};
