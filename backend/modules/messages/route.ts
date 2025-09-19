import { Router } from "express";
import MessageController from "./controllers/Message";
import { checkLogin } from "@/middleware/auth";
import { checkPermission } from "@/middleware/permissions";
import { AppModel } from "@prisma/client";

const routes = Router();

// Create message
routes.post("/", checkLogin, checkPermission(AppModel.MessageLog, "create"), MessageController.create as any);

// Get all messages
routes.get("/", checkLogin, checkPermission(AppModel.MessageLog, "view"), MessageController.getAll as any);

// Get paginated messages
routes.get("/paginate", checkLogin, checkPermission(AppModel.MessageLog, "view"), MessageController.paginate as any);

// Search messages
routes.get("/search", checkLogin, checkPermission(AppModel.MessageLog, "view"), MessageController.search as any);

// Get message statistics
routes.get("/statistics", checkLogin, checkPermission(AppModel.MessageLog, "view"), MessageController.getStatistics as any);

// Get unread messages
routes.get("/unread", checkLogin, checkPermission(AppModel.MessageLog, "view"), MessageController.getUnreadMessages as any);

// Get broadcast messages
routes.get("/broadcast", checkLogin, checkPermission(AppModel.MessageLog, "view"), MessageController.getBroadcastMessages as any);

// Get recent messages
routes.get("/recent", checkLogin, checkPermission(AppModel.MessageLog, "view"), MessageController.getRecentMessages as any);

// Get messages by recipient
routes.get("/recipient/:recipientId", checkLogin, checkPermission(AppModel.MessageLog, "view"), MessageController.getByRecipient as any);

// Get messages by sender
routes.get("/sender/:senderId", checkLogin, checkPermission(AppModel.MessageLog, "view"), MessageController.getBySender as any);

// Get conversation between two users
routes.get("/conversation/:user1Id/:user2Id", checkLogin, checkPermission(AppModel.MessageLog, "view"), MessageController.getConversation as any);

// Mark message as read
routes.patch("/:id/read", checkLogin, checkPermission(AppModel.MessageLog, "update"), MessageController.markAsRead as any);

// Mark message as unread
routes.patch("/:id/unread", checkLogin, checkPermission(AppModel.MessageLog, "update"), MessageController.markAsUnread as any);

// Mark multiple messages as read
routes.patch("/mark-read", checkLogin, checkPermission(AppModel.MessageLog, "update"), MessageController.markMultipleAsRead as any);

// Get message by ID
routes.get("/:id", checkLogin, checkPermission(AppModel.MessageLog, "view"), MessageController.getById as any);

// Update message
routes.put("/:id", checkLogin, checkPermission(AppModel.MessageLog, "update"), MessageController.update as any);

// Delete message
routes.delete("/:id", checkLogin, checkPermission(AppModel.MessageLog, "delete"), MessageController.delete as any);

// Delete multiple messages
routes.delete("/", checkLogin, checkPermission(AppModel.MessageLog, "delete"), MessageController.deleteMany as any);

export default routes;
