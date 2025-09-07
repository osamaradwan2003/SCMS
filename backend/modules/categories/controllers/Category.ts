import { Response } from "express";
import CategoryServices from "../services/Category";
import { RequestWithUser } from "@/@types/auth";

export default class CategoryController {
  // Create category
  static async create(req: RequestWithUser, res: Response) {
    const { name, type, calculateMethod } = req.body;
    
    if (!name || !type || !calculateMethod) {
      return res.status(400).send({
        message: "Name, type, and calculate method are required",
      });
    }

    try {
      const category = await CategoryServices.createCategory(
        name,
        type,
        calculateMethod,
        req.user.id
      );
      res.status(201).send({
        message: "Category created successfully",
        data: category,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get all categories
  static async getAll(req: RequestWithUser, res: Response) {
    try {
      const categories = await CategoryServices.getAllCategories();
      res.send({
        message: "Categories retrieved successfully",
        data: categories,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get categories by type
  static async getByType(req: RequestWithUser, res: Response) {
    const { type } = req.params;

    try {
      const categories = await CategoryServices.getByType(type);
      res.send({
        message: "Categories retrieved successfully",
        data: categories,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get category by ID
  static async getById(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      const category = await CategoryServices.findById(id);
      res.send({
        message: "Category retrieved successfully",
        data: category,
      });
    } catch (error: any) {
      res.status(404).send({ message: error.message });
    }
  }

  // Update category
  static async update(req: RequestWithUser, res: Response) {
    const { id } = req.params;
    const { name, type, calculateMethod } = req.body;

    try {
      const category = await CategoryServices.updateCategory(id, {
        name,
        type,
        calculateMethod,
      });
      res.send({
        message: "Category updated successfully",
        data: category,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Delete category
  static async delete(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      await CategoryServices.deleteCategory(id);
      res.send({
        message: "Category deleted successfully",
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get paginated categories
  static async paginate(req: RequestWithUser, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const result = await CategoryServices.paginate(page, limit);
      res.send({
        message: "Categories retrieved successfully",
        ...result,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Search categories
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
      const result = await CategoryServices.paginateSearched(
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

  // Delete multiple categories
  static async deleteMany(req: RequestWithUser, res: Response) {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send({
        message: "Array of category IDs is required",
      });
    }

    try {
      const result = await CategoryServices.deleteMany(ids);
      res.send({
        message: `${result.count} categories deleted successfully`,
        deletedCount: result.count,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get category statistics
  static async getStatistics(req: RequestWithUser, res: Response) {
    try {
      const statistics = await CategoryServices.getStatistics();
      res.send({
        message: "Category statistics retrieved successfully",
        data: statistics,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }
}
