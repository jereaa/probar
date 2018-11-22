import * as express from "express";
import * as mongoose from "mongoose";
import * as cors from "cors";
import * as path from "path";

import { CONFIG } from "./config";
import { adminRouter } from "./api";

mongoose.connect(CONFIG.MONGODB_URI);
const mongoDB = mongoose.connection;

mongoDB.on("error", () => {
    console.error(`MongoDB connection error. Please make sure that ${CONFIG.MONGODB_URI} is running.`);
});

mongoDB.once("open", () => {
    console.log(`Connected to MongoDB at ${CONFIG.MONGODB_URI}`);
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const port = CONFIG.PORT;
app.set("port", port);

app.use("/api/admin", adminRouter);

if (process.env.NODE_ENV === "production") {
    app.use("/", express.static(path.join(__dirname, "../probar")));

    app.get("*", (req, res) => {
        res.sendfile(path.join(__dirname, "../probar/index.html"));
    });
}

app.listen(port, () => console.log(`Server running on localhost:${port}`));
