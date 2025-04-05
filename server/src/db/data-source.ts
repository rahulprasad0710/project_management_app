import "reflect-metadata";
import { DataSource } from "typeorm";
import entities from "./entity/index";

import APP_CONSTANT from "../constants/AppConfig";

const dataSource = new DataSource({
    type: "postgres",
    host: APP_CONSTANT.DB_HOST,
    port: APP_CONSTANT.DB_PORT,
    username: APP_CONSTANT.DB_USER,
    password: APP_CONSTANT.DB_PASSWORD,
    database: APP_CONSTANT.DB_NAME,
    synchronize: true, // Synchronize is true for development only
    logging: false,
    entities: entities,
    migrations: [],
    subscribers: [],
});

export async function connectToDatabase() {
    try {
        const dbConnect = await dataSource.initialize();
        console.log("Connected to database :-", dbConnect.options.database);
    } catch (err: unknown) {
        console.error(err);
        process.exit(1);
    }
}

export default dataSource;
