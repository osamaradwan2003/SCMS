import { Router } from "express";
import AuthController from "./controllers/Auth";

const routes = Router();

routes.post("/me", AuthController.me);
routes.post("/change-password", AuthController.changePassword);
routes.post("/update-profile", AuthController.updateProfile);

export default routes;
