import { Router } from "express";
import AuthController from "./controllers/Auth";

const routes = Router();

routes.post("/me", AuthController.me);

export default routes;
