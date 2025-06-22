import dotenv from "dotenv";

dotenv.config();

const APP_CONSTANT = {
    PORT: process.env.PORT || 3000,
    REDIS_URL: process.env.REDIS_URL,
    REDIS_PORT: process.env.REDIS_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: Number(process.env.DB_PORT) as number,
    DB_NAME: process.env.DB_NAME,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    CLIENT_BASE_URL: process.env.CLIENT_BASE_URL,
    NODE_ENV: "development",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
};

export default APP_CONSTANT;
