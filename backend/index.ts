import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { loadRoutes } from "@utils/index";
import { checkLogin } from "./middleware/auth";
import routes from "@/modules/auth/loginRoute";
import fileUpload from "express-fileupload";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());
//autoload route
app.use("/api/auth", routes); //skip auth routes from middleware
app.use(checkLogin);
loadRoutes(app, "/api");
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
