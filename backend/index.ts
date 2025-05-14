import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { loadRoutes } from "@utils";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
//autoload route

loadRoutes(app, []);
app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
