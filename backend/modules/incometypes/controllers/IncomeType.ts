import { Response } from "express";
import IncomeTypeServices from "../services/IncomeType";
import { RequestWithUser } from "@/@types/auth";

export default class IncomeTypeController {
  // Create income type
  static async create(req: RequestWithUser, res: Response) {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).send({
        message: "Name is required",
      });
    }

    try {
      const incomeType = await IncomeTypeServices.createIncomeType(
        name,
        description || null,
        req.user.id
      );
      res.status(201).send({
        message: "Income type created successfully",
        data: incomeType,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get all income types
  static async getAll(req: RequestWithUser, res: Response) {
    try {
      const incomeTypes = await IncomeTypeServices.getAllIncomeTypes();
      res.send({
        message: "Income types retrieved successfully",
        data: incomeTypes,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get income type by ID
  static async getById(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      const incomeType = await IncomeTypeServices.findById(id);
      res.send({
        message: "Income type retrieved successfully",
        data: incomeType,
      });
    } catch (error: any) {
      res.status(404).send({ message: error.message });
    }
  }

  // Update income type
  static async update(req: RequestWithUser, res: Response) {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
      const incomeType = await IncomeTypeServices.updateIncomeType(id, {
        name,
        description,
      });
      res.send({
        message: "Income type updated successfully",
        data: incomeType,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Delete income type
  static async delete(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      await IncomeTypeServices.deleteIncomeType(id);
      res.send({
        message: "Income type deleted successfully",
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get paginated income types
  static async paginate(req: RequestWithUser, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const result = await IncomeTypeServices.paginate(page, limit);
      res.send({
        message: "Income types retrieved successfully",
        ...result,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Search income types
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
      const result = await IncomeTypeServices.paginateSearched(
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

  // Delete multiple income types
  static async deleteMany(req: RequestWithUser, res: Response) {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send({
        message: "Array of income type IDs is required",
      });
    }

    try {
      const result = await IncomeTypeServices.deleteMany(ids);
      res.send({
        message: `${result.count} income types deleted successfully`,
        deletedCount: result.count,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get income type statistics
  static async getStatistics(req: RequestWithUser, res: Response) {
    try {
      const statistics = await IncomeTypeServices.getStatistics();
      res.send({
        message: "Income type statistics retrieved successfully",
        data: statistics,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get income types with counts
  static async getWithCounts(req: RequestWithUser, res: Response) {
    try {
      const incomeTypes = await IncomeTypeServices.getIncomeTypesWithCounts();
      res.send({
        message: "Income types with counts retrieved successfully",
        data: incomeTypes,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }
}
