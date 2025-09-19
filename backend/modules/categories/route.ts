import { Router } from "express";
import CategoryController from "./controllers/Category";
import { checkLogin } from "@/middleware/auth";
import { checkPermission } from "@/middleware/permissions";
import { AppModel } from "@prisma/client";

const routes = Router();

// Create category
routes.post("/", checkLogin, checkPermission(AppModel.Category, "create"), CategoryController.create as any);

// Get all categories
routes.get("/", checkLogin, checkPermission(AppModel.Category, "view"), CategoryController.getAll as any);

// Get paginated categories
routes.get("/paginate", checkLogin, checkPermission(AppModel.Category, "view"), CategoryController.paginate as any);

// Search categories
routes.get("/search", checkLogin, checkPermission(AppModel.Category, "view"), CategoryController.search as any);

// Get category statistics
routes.get("/statistics", checkLogin, checkPermission(AppModel.Category, "view"), CategoryController.getStatistics as any);

// Get categories by type
routes.get("/type/:type", checkLogin, checkPermission(AppModel.Category, "view"), CategoryController.getByType as any);

// Get category by ID
routes.get("/:id", checkLogin, checkPermission(AppModel.Category, "view"), CategoryController.getById as any);

// Update category
routes.put("/:id", checkLogin, checkPermission(AppModel.Category, "update"), CategoryController.update as any);

// Delete category
routes.delete("/:id", checkLogin, checkPermission(AppModel.Category, "delete"), CategoryController.delete as any);

// Delete multiple categories
routes.delete("/", checkLogin, checkPermission(AppModel.Category, "delete"), CategoryController.deleteMany as any);

export default routes;
