import { Response } from "express";
import transactionervices from "../services/Transaction";
import { RequestWithUser } from "@/@types/auth";

export default class transactionController {
  // Create transaction
  static async create(req: RequestWithUser, res: Response) {
    const {
      categoryId,
      bankId,
      incomeTypeId,
      expenseTypeId,
      date,
      amount,
      note,
    } = req.body;

    if (!categoryId || !bankId || !date || amount === undefined) {
      return res.status(400).send({
        message: "Category ID, bank ID, date, and amount are required",
      });
    }

    try {
      const transaction = await transactionervices.createtransaction(
        categoryId,
        bankId,
        incomeTypeId || null,
        expenseTypeId || null,
        new Date(date),
        parseFloat(amount),
        note || null,
        req.user.id
      );
      res.status(201).send({
        message: "transaction created successfully",
        data: transaction,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get all transaction
  static async getAll(req: RequestWithUser, res: Response) {
    try {
      const transaction = await transactionervices.getAlltransaction();
      res.send({
        message: "transaction retrieved successfully",
        data: transaction,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get transaction by ID
  static async getById(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      const transaction = await transactionervices.findById(id);
      res.send({
        message: "transaction retrieved successfully",
        data: transaction,
      });
    } catch (error: any) {
      res.status(404).send({ message: error.message });
    }
  }

  // Update transaction
  static async update(req: RequestWithUser, res: Response) {
    const { id } = req.params;
    const {
      categoryId,
      bankId,
      incomeTypeId,
      expenseTypeId,
      date,
      amount,
      note,
    } = req.body;

    try {
      const transaction = await transactionervices.updatetransaction(id, {
        categoryId,
        bankId,
        incomeTypeId,
        expenseTypeId,
        date: date ? new Date(date) : undefined,
        amount: amount ? parseFloat(amount) : undefined,
        note,
      });
      res.send({
        message: "transaction updated successfully",
        data: transaction,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Delete transaction
  static async delete(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      await transactionervices.deletetransaction(id);
      res.send({
        message: "transaction deleted successfully",
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get paginated transaction
  static async paginate(req: RequestWithUser, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const result = await transactionervices.paginate(page, limit);
      res.send({
        message: "transaction retrieved successfully",
        ...result,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Search transaction
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
      const result = await transactionervices.paginateSearched(
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

  // Get transaction by date range
  static async getByDateRange(req: RequestWithUser, res: Response) {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).send({
        message: "Start date and end date are required",
      });
    }

    try {
      const transaction = await transactionervices.getByDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.send({
        message: "transaction retrieved successfully",
        data: transaction,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get transaction by bank
  static async getByBank(req: RequestWithUser, res: Response) {
    const { bankId } = req.params;

    try {
      const transaction = await transactionervices.getByBank(bankId);
      res.send({
        message: "transaction retrieved successfully",
        data: transaction,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get transaction by category
  static async getByCategory(req: RequestWithUser, res: Response) {
    const { categoryId } = req.params;

    try {
      const transaction = await transactionervices.getByCategory(categoryId);
      res.send({
        message: "transaction retrieved successfully",
        data: transaction,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get transaction statistics
  static async getStatistics(req: RequestWithUser, res: Response) {
    try {
      const statistics = await transactionervices.getStatistics();
      res.send({
        message: "transaction statistics retrieved successfully",
        data: statistics,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }
}
