import express from "express";
import cors from "cors";
import { CLIENT_URL } from "./utils/env.js";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import errorHandler from "./utils/error-handler.js";

const app = express();

app.use(cors(
  {
    origin: CLIENT_URL,
    credentials: true
  }
));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(cookieParser());


app.use("/api/v1", router);

app.use(errorHandler);

app.use((req, res, next) => {
  res.status(404).json({ error: "Not found" });
})

export default app