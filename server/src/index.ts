//
import { connectToDatabase } from "./db/data-source";
import cors from "cors";
import dotenv from "dotenv";
import errorHandler from "./middlewares/errorHandler";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index";
import startJobs from "./jobs/jobs";

dotenv.config();
const app = express();
const port = Number(process.env.PORT) || 3000;

connectToDatabase();
startJobs();

app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:3000"],
        credentials: true,
    })
);
app.use(helmet());
app.use(morgan("common"));
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin",
    })
);

app.get("/", (req, res) => {
    res.send("Hello from server");
});

app.use("/api", routes);

app.use(errorHandler);

app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
});
