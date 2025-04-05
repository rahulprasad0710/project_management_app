import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
//
import { connectToDatabase } from "./db/data-source";
import routes from "./routes/index";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

connectToDatabase();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("common"));
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin",
    })
);

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use("/api", routes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
