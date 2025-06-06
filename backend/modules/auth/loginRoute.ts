import { Router } from "express";
import AuthController from "./controllers/Auth";

const routes = Router();

routes.post("/login", AuthController.login);

export default routes;
