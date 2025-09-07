import { Response } from "express";
import SubscriptionServices from "../services/Subscription";
import { RequestWithUser } from "@/@types/auth";

export default class SubscriptionController {
  // Create subscription
  static async create(req: RequestWithUser, res: Response) {
    const { name, value, notes } = req.body;
    
    if (!name || value === undefined) {
      return res.status(400).send({
        message: "Name and value are required",
      });
    }

    try {
      const subscription = await SubscriptionServices.createSubscription(
        name,
        parseFloat(value),
        notes || null,
        req.user.id
      );
      res.status(201).send({
        message: "Subscription created successfully",
        data: subscription,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get all subscriptions
  static async getAll(req: RequestWithUser, res: Response) {
    try {
      const subscriptions = await SubscriptionServices.getAllSubscriptions();
      res.send({
        message: "Subscriptions retrieved successfully",
        data: subscriptions,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get subscription by ID
  static async getById(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      const subscription = await SubscriptionServices.findById(id);
      res.send({
        message: "Subscription retrieved successfully",
        data: subscription,
      });
    } catch (error: any) {
      res.status(404).send({ message: error.message });
    }
  }

  // Update subscription
  static async update(req: RequestWithUser, res: Response) {
    const { id } = req.params;
    const { name, value, notes } = req.body;

    try {
      const subscription = await SubscriptionServices.updateSubscription(id, {
        name,
        value: value ? parseFloat(value) : undefined,
        notes,
      });
      res.send({
        message: "Subscription updated successfully",
        data: subscription,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Delete subscription
  static async delete(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      await SubscriptionServices.deleteSubscription(id);
      res.send({
        message: "Subscription deleted successfully",
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get paginated subscriptions
  static async paginate(req: RequestWithUser, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const result = await SubscriptionServices.paginate(page, limit);
      res.send({
        message: "Subscriptions retrieved successfully",
        ...result,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Search subscriptions
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
      const result = await SubscriptionServices.paginateSearched(
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

  // Delete multiple subscriptions
  static async deleteMany(req: RequestWithUser, res: Response) {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send({
        message: "Array of subscription IDs is required",
      });
    }

    try {
      const result = await SubscriptionServices.deleteMany(ids);
      res.send({
        message: `${result.count} subscriptions deleted successfully`,
        deletedCount: result.count,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get subscription statistics
  static async getStatistics(req: RequestWithUser, res: Response) {
    try {
      const statistics = await SubscriptionServices.getStatistics();
      res.send({
        message: "Subscription statistics retrieved successfully",
        data: statistics,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get subscriptions with counts
  static async getWithCounts(req: RequestWithUser, res: Response) {
    try {
      const subscriptions = await SubscriptionServices.getSubscriptionsWithCounts();
      res.send({
        message: "Subscriptions with counts retrieved successfully",
        data: subscriptions,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }
}
