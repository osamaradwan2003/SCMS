import { Response } from "express";
import BankServices from "../services/Bank";
import { RequestWithUser } from "@/@types/auth";

export default class BankController {
  // Create bank
  static async create(req: RequestWithUser, res: Response) {
    const { name, balance } = req.body;
    
    if (!name || balance === undefined) {
      return res.status(400).send({
        message: "Bank name and balance are required",
      });
    }

    try {
      const bank = await BankServices.createBank(
        name,
        parseFloat(balance),
        req.user.id
      );
      res.status(201).send({
        message: "Bank created successfully",
        data: bank,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get all banks
  static async getAll(req: RequestWithUser, res: Response) {
    try {
      const banks = await BankServices.getAllBanks();
      res.send({
        message: "Banks retrieved successfully",
        data: banks,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get bank by ID
  static async getById(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      const bank = await BankServices.findById(id);
      res.send({
        message: "Bank retrieved successfully",
        data: bank,
      });
    } catch (error: any) {
      res.status(404).send({ message: error.message });
    }
  }

  // Update bank
  static async update(req: RequestWithUser, res: Response) {
    const { id } = req.params;
    const { name, balance } = req.body;

    try {
      const bank = await BankServices.updateBank(id, {
        name,
        balance: balance ? parseFloat(balance) : undefined,
      });
      res.send({
        message: "Bank updated successfully",
        data: bank,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Delete bank
  static async delete(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      await BankServices.deleteBank(id);
      res.send({
        message: "Bank deleted successfully",
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get paginated banks
  static async paginate(req: RequestWithUser, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const result = await BankServices.paginate(page, limit);
      res.send({
        message: "Banks retrieved successfully",
        ...result,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Search banks
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
      const result = await BankServices.paginateSearched(
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

  // Delete multiple banks
  static async deleteMany(req: RequestWithUser, res: Response) {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send({
        message: "Array of bank IDs is required",
      });
    }

    try {
      const result = await BankServices.deleteMany(ids);
      res.send({
        message: `${result.count} banks deleted successfully`,
        deletedCount: result.count,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get bank statistics
  static async getStatistics(req: RequestWithUser, res: Response) {
    try {
      const statistics = await BankServices.getStatistics();
      res.send({
        message: "Bank statistics retrieved successfully",
        data: statistics,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Update bank balance
  static async updateBalance(req: RequestWithUser, res: Response) {
    const { id } = req.params;
    const { amount, operation } = req.body;

    if (!amount || !operation || !['add', 'subtract'].includes(operation)) {
      return res.status(400).send({
        message: "Amount and operation (add/subtract) are required",
      });
    }

    try {
      const bank = await BankServices.updateBalance(
        id,
        parseFloat(amount),
        operation
      );
      res.send({
        message: "Bank balance updated successfully",
        data: bank,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }
}
