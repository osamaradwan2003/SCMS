import { Router } from "express";
import SubscriptionController from "./controllers/Subscription";

const routes = Router();

// Create subscription
routes.post("/", SubscriptionController.create as any);

// Get all subscriptions
routes.get("/", SubscriptionController.getAll as any);

// Get paginated subscriptions
routes.get("/paginate", SubscriptionController.paginate as any);

// Search subscriptions
routes.get("/search", SubscriptionController.search as any);

// Get subscription statistics
routes.get("/statistics", SubscriptionController.getStatistics as any);

// Get subscriptions with counts
routes.get("/counts", SubscriptionController.getWithCounts as any);

// Get subscription by ID
routes.get("/:id", SubscriptionController.getById as any);

// Update subscription
routes.put("/:id", SubscriptionController.update as any);

// Delete subscription
routes.delete("/:id", SubscriptionController.delete as any);

// Delete multiple subscriptions
routes.delete("/", SubscriptionController.deleteMany as any);

export default routes;
