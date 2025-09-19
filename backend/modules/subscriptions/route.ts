import { Router } from "express";
import SubscriptionController from "./controllers/Subscription";
import { checkLogin } from "@/middleware/auth";
import { checkPermission } from "@/middleware/permissions";
import { AppModel } from "@prisma/client";

const routes = Router();

// Create subscription
routes.post("/", checkLogin, checkPermission(AppModel.Subscriptions, "create"), SubscriptionController.create as any);

// Get all subscriptions
routes.get("/", checkLogin, checkPermission(AppModel.Subscriptions, "view"), SubscriptionController.getAll as any);

// Get paginated subscriptions
routes.get("/paginate", checkLogin, checkPermission(AppModel.Subscriptions, "view"), SubscriptionController.paginate as any);

// Search subscriptions
routes.get("/search", checkLogin, checkPermission(AppModel.Subscriptions, "view"), SubscriptionController.search as any);

// Get subscription statistics
routes.get("/statistics", checkLogin, checkPermission(AppModel.Subscriptions, "view"), SubscriptionController.getStatistics as any);

// Get subscriptions with counts
routes.get("/counts", checkLogin, checkPermission(AppModel.Subscriptions, "view"), SubscriptionController.getWithCounts as any);

// Get subscription by ID
routes.get("/:id", checkLogin, checkPermission(AppModel.Subscriptions, "view"), SubscriptionController.getById as any);

// Update subscription
routes.put("/:id", checkLogin, checkPermission(AppModel.Subscriptions, "update"), SubscriptionController.update as any);

// Delete subscription
routes.delete("/:id", checkLogin, checkPermission(AppModel.Subscriptions, "delete"), SubscriptionController.delete as any);

// Delete multiple subscriptions
routes.delete("/", checkLogin, checkPermission(AppModel.Subscriptions, "delete"), SubscriptionController.deleteMany as any);

export default routes;
