import { Response } from "express";
import MessageServices from "../services/Message";
import { RequestWithUser } from "@/@types/auth";

export default class MessageController {
  // Create message
  static async create(req: RequestWithUser, res: Response) {
    const { title, content, recipientId } = req.body;
    
    if (!title || !content) {
      return res.status(400).send({
        message: "Title and content are required",
      });
    }

    try {
      const message = await MessageServices.createMessage(
        title,
        content,
        recipientId || null,
        req.user.id
      );
      res.status(201).send({
        message: "Message created successfully",
        data: message,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get all messages
  static async getAll(req: RequestWithUser, res: Response) {
    try {
      const messages = await MessageServices.getAllMessages();
      res.send({
        message: "Messages retrieved successfully",
        data: messages,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get message by ID
  static async getById(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      const message = await MessageServices.findById(id);
      res.send({
        message: "Message retrieved successfully",
        data: message,
      });
    } catch (error: any) {
      res.status(404).send({ message: error.message });
    }
  }

  // Update message
  static async update(req: RequestWithUser, res: Response) {
    const { id } = req.params;
    const { title, content, recipientId, isRead } = req.body;

    try {
      const message = await MessageServices.updateMessage(id, {
        title,
        content,
        recipientId,
        isRead,
      });
      res.send({
        message: "Message updated successfully",
        data: message,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Delete message
  static async delete(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      await MessageServices.deleteMessage(id);
      res.send({
        message: "Message deleted successfully",
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get paginated messages
  static async paginate(req: RequestWithUser, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const result = await MessageServices.paginate(page, limit);
      res.send({
        message: "Messages retrieved successfully",
        ...result,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Search messages
  static async search(req: RequestWithUser, res: Response) {
    const { q: search } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!search) {
      return res.status(400).send({
        message: "Search query is required",
      });
    }

    try {
      const result = await MessageServices.paginateSearched(
        page,
        limit,
        search as string
      );
      res.send({
        message: "Search results retrieved successfully",
        ...result,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get messages by recipient
  static async getByRecipient(req: RequestWithUser, res: Response) {
    const { recipientId } = req.params;

    try {
      const messages = await MessageServices.getByRecipient(recipientId);
      res.send({
        message: "Recipient messages retrieved successfully",
        data: messages,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get messages by sender
  static async getBySender(req: RequestWithUser, res: Response) {
    const { senderId } = req.params;

    try {
      const messages = await MessageServices.getBySender(senderId);
      res.send({
        message: "Sender messages retrieved successfully",
        data: messages,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get unread messages
  static async getUnreadMessages(req: RequestWithUser, res: Response) {
    const { recipientId } = req.query;

    try {
      const messages = await MessageServices.getUnreadMessages(recipientId as string);
      res.send({
        message: "Unread messages retrieved successfully",
        data: messages,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Mark message as read
  static async markAsRead(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      const message = await MessageServices.markAsRead(id);
      res.send({
        message: "Message marked as read",
        data: message,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Mark message as unread
  static async markAsUnread(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      const message = await MessageServices.markAsUnread(id);
      res.send({
        message: "Message marked as unread",
        data: message,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Mark multiple messages as read
  static async markMultipleAsRead(req: RequestWithUser, res: Response) {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send({
        message: "Array of message IDs is required",
      });
    }

    try {
      const result = await MessageServices.markMultipleAsRead(ids);
      res.send({
        message: `${result.count} messages marked as read`,
        updatedCount: result.count,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Delete multiple messages
  static async deleteMany(req: RequestWithUser, res: Response) {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send({
        message: "Array of message IDs is required",
      });
    }

    try {
      const result = await MessageServices.deleteMany(ids);
      res.send({
        message: `${result.count} messages deleted successfully`,
        deletedCount: result.count,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get message statistics
  static async getStatistics(req: RequestWithUser, res: Response) {
    const { userId } = req.query;

    try {
      const statistics = await MessageServices.getStatistics(userId as string);
      res.send({
        message: "Message statistics retrieved successfully",
        data: statistics,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get conversation between two users
  static async getConversation(req: RequestWithUser, res: Response) {
    const { user1Id, user2Id } = req.params;

    try {
      const conversation = await MessageServices.getConversation(user1Id, user2Id);
      res.send({
        message: "Conversation retrieved successfully",
        data: conversation,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get broadcast messages
  static async getBroadcastMessages(req: RequestWithUser, res: Response) {
    try {
      const messages = await MessageServices.getBroadcastMessages();
      res.send({
        message: "Broadcast messages retrieved successfully",
        data: messages,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get recent messages
  static async getRecentMessages(req: RequestWithUser, res: Response) {
    const limit = parseInt(req.query.limit as string) || 10;
    const { userId } = req.query;

    try {
      const messages = await MessageServices.getRecentMessages(limit, userId as string);
      res.send({
        message: "Recent messages retrieved successfully",
        data: messages,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }
}
