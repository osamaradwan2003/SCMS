import { Router } from "express";
import MessageController from "./controllers/Message";

const routes = Router();

// Create message
routes.post("/", MessageController.create as any);

// Get all messages
routes.get("/", MessageController.getAll as any);

// Get paginated messages
routes.get("/paginate", MessageController.paginate as any);

// Search messages
routes.get("/search", MessageController.search as any);

// Get message statistics
routes.get("/statistics", MessageController.getStatistics as any);

// Get unread messages
routes.get("/unread", MessageController.getUnreadMessages as any);

// Get broadcast messages
routes.get("/broadcast", MessageController.getBroadcastMessages as any);

// Get recent messages
routes.get("/recent", MessageController.getRecentMessages as any);

// Get messages by recipient
routes.get("/recipient/:recipientId", MessageController.getByRecipient as any);

// Get messages by sender
routes.get("/sender/:senderId", MessageController.getBySender as any);

// Get conversation between two users
routes.get("/conversation/:user1Id/:user2Id", MessageController.getConversation as any);

// Mark message as read
routes.patch("/:id/read", MessageController.markAsRead as any);

// Mark message as unread
routes.patch("/:id/unread", MessageController.markAsUnread as any);

// Mark multiple messages as read
routes.patch("/mark-read", MessageController.markMultipleAsRead as any);

// Get message by ID
routes.get("/:id", MessageController.getById as any);

// Update message
routes.put("/:id", MessageController.update as any);

// Delete message
routes.delete("/:id", MessageController.delete as any);

// Delete multiple messages
routes.delete("/", MessageController.deleteMany as any);

export default routes;
