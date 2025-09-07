import { Response } from "express";
import ExpenseTypeServices from "../services/ExpenseType";
import { RequestWithUser } from "@/@types/auth";

export default class ExpenseTypeController {
  // Create expense type
  static async create(req: RequestWithUser, res: Response) {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).send({
        message: "Name is required",
      });
    }

    try {
      const expenseType = await ExpenseTypeServices.createExpenseType(
        name,
        description || null,
        req.user.id
      );
      res.status(201).send({
        message: "Expense type created successfully",
        data: expenseType,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get all expense types
  static async getAll(req: RequestWithUser, res: Response) {
    try {
      const expenseTypes = await ExpenseTypeServices.getAllExpenseTypes();
      res.send({
        message: "Expense types retrieved successfully",
        data: expenseTypes,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get expense type by ID
  static async getById(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      const expenseType = await ExpenseTypeServices.findById(id);
      res.send({
        message: "Expense type retrieved successfully",
        data: expenseType,
      });
    } catch (error: any) {
      res.status(404).send({ message: error.message });
    }
  }

  // Update expense type
  static async update(req: RequestWithUser, res: Response) {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
      const expenseType = await ExpenseTypeServices.updateExpenseType(id, {
        name,
        description,
      });
      res.send({
        message: "Expense type updated successfully",
        data: expenseType,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Delete expense type
  static async delete(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      await ExpenseTypeServices.deleteExpenseType(id);
      res.send({
        message: "Expense type deleted successfully",
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get paginated expense types
  static async paginate(req: RequestWithUser, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const result = await ExpenseTypeServices.paginate(page, limit);
      res.send({
        message: "Expense types retrieved successfully",
        ...result,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Search expense types
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
      const result = await ExpenseTypeServices.paginateSearched(
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

  // Delete multiple expense types
  static async deleteMany(req: RequestWithUser, res: Response) {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send({
        message: "Array of expense type IDs is required",
      });
    }

    try {
      const result = await ExpenseTypeServices.deleteMany(ids);
      res.send({
        message: `${result.count} expense types deleted successfully`,
        deletedCount: result.count,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get expense type statistics
  static async getStatistics(req: RequestWithUser, res: Response) {
    try {
      const statistics = await ExpenseTypeServices.getStatistics();
      res.send({
        message: "Expense type statistics retrieved successfully",
        data: statistics,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get expense types with counts
  static async getWithCounts(req: RequestWithUser, res: Response) {
    try {
      const expenseTypes = await ExpenseTypeServices.getExpenseTypesWithCounts();
      res.send({
        message: "Expense types with counts retrieved successfully",
        data: expenseTypes,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }
}
