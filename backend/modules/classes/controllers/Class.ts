import { Response } from "express";
import ClassServices from "../services/Class";
import { RequestWithUser } from "@/@types/auth";

export default class ClassController {
  // Create class
  static async create(req: RequestWithUser, res: Response) {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).send({
        message: "Class name is required",
      });
    }

    try {
      const classEntity = await ClassServices.createClass(name, req.user.id);
      res.status(201).send({
        message: "Class created successfully",
        data: classEntity,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get all classes
  static async getAll(req: RequestWithUser, res: Response) {
    try {
      const classes = await ClassServices.getAllClasses();
      res.send({
        message: "Classes retrieved successfully",
        data: classes,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get class by ID
  static async getById(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      const classEntity = await ClassServices.findById(id);
      res.send({
        message: "Class retrieved successfully",
        data: classEntity,
      });
    } catch (error: any) {
      res.status(404).send({ message: error.message });
    }
  }

  // Update class
  static async update(req: RequestWithUser, res: Response) {
    const { id } = req.params;
    const { name } = req.body;

    try {
      const classEntity = await ClassServices.updateClass(id, { name });
      res.send({
        message: "Class updated successfully",
        data: classEntity,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Delete class
  static async delete(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      await ClassServices.deleteClass(id);
      res.send({
        message: "Class deleted successfully",
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get paginated classes
  static async paginate(req: RequestWithUser, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const result = await ClassServices.paginate(page, limit);
      res.send({
        message: "Classes retrieved successfully",
        ...result,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Search classes
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
      const result = await ClassServices.paginateSearched(
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

  // Delete multiple classes
  static async deleteMany(req: RequestWithUser, res: Response) {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send({
        message: "Array of class IDs is required",
      });
    }

    try {
      const result = await ClassServices.deleteMany(ids);
      res.send({
        message: `${result.count} classes deleted successfully`,
        deletedCount: result.count,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Add subjects to class
  static async addSubjects(req: RequestWithUser, res: Response) {
    const { id } = req.params;
    const { subjectIds } = req.body;

    if (!subjectIds || !Array.isArray(subjectIds) || subjectIds.length === 0) {
      return res.status(400).send({
        message: "Array of subject IDs is required",
      });
    }

    try {
      const classEntity = await ClassServices.addSubjects(id, subjectIds);
      res.send({
        message: "Subjects added to class successfully",
        data: classEntity,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Remove subjects from class
  static async removeSubjects(req: RequestWithUser, res: Response) {
    const { id } = req.params;
    const { subjectIds } = req.body;

    if (!subjectIds || !Array.isArray(subjectIds) || subjectIds.length === 0) {
      return res.status(400).send({
        message: "Array of subject IDs is required",
      });
    }

    try {
      const classEntity = await ClassServices.removeSubjects(id, subjectIds);
      res.send({
        message: "Subjects removed from class successfully",
        data: classEntity,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get classes with counts
  static async getWithCounts(req: RequestWithUser, res: Response) {
    try {
      const classes = await ClassServices.getClassesWithCounts();
      res.send({
        message: "Classes with counts retrieved successfully",
        data: classes,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }
}
