import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { loadRoutes } from "@utils/index";
import { checkLogin } from "./middleware/auth";
import routes from "@/modules/auth/loginRoute";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
//autoload route
app.use("/auth", routes); //skip auth routes from middleware
app.use(checkLogin);
loadRoutes(app);
app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
