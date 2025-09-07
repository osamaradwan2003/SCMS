import { Response } from "express";
import SubjectServices from "../services/Subject";
import { RequestWithUser } from "@/@types/auth";

export default class SubjectController {
  // Create subject
  static async create(req: RequestWithUser, res: Response) {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).send({
        message: "Subject name is required",
      });
    }

    try {
      const subject = await SubjectServices.createSubject(name, req.user.id);
      res.status(201).send({
        message: "Subject created successfully",
        data: subject,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get all subjects
  static async getAll(req: RequestWithUser, res: Response) {
    try {
      const subjects = await SubjectServices.getAllSubjects();
      res.send({
        message: "Subjects retrieved successfully",
        data: subjects,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get subject by ID
  static async getById(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      const subject = await SubjectServices.findById(id);
      res.send({
        message: "Subject retrieved successfully",
        data: subject,
      });
    } catch (error: any) {
      res.status(404).send({ message: error.message });
    }
  }

  // Update subject
  static async update(req: RequestWithUser, res: Response) {
    const { id } = req.params;
    const { name } = req.body;

    try {
      const subject = await SubjectServices.updateSubject(id, { name });
      res.send({
        message: "Subject updated successfully",
        data: subject,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Delete subject
  static async delete(req: RequestWithUser, res: Response) {
    const { id } = req.params;

    try {
      await SubjectServices.deleteSubject(id);
      res.send({
        message: "Subject deleted successfully",
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get paginated subjects
  static async paginate(req: RequestWithUser, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const result = await SubjectServices.paginate(page, limit);
      res.send({
        message: "Subjects retrieved successfully",
        ...result,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Search subjects
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
      const result = await SubjectServices.paginateSearched(
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

  // Delete multiple subjects
  static async deleteMany(req: RequestWithUser, res: Response) {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send({
        message: "Array of subject IDs is required",
      });
    }

    try {
      const result = await SubjectServices.deleteMany(ids);
      res.send({
        message: `${result.count} subjects deleted successfully`,
        deletedCount: result.count,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get subjects with counts
  static async getWithCounts(req: RequestWithUser, res: Response) {
    try {
      const subjects = await SubjectServices.getSubjectsWithCounts();
      res.send({
        message: "Subjects with counts retrieved successfully",
        data: subjects,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  // Get subjects by class
  static async getByClass(req: RequestWithUser, res: Response) {
    const { classId } = req.params;

    try {
      const subjects = await SubjectServices.getByClass(classId);
      res.send({
        message: "Subjects retrieved successfully",
        data: subjects,
      });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }
}
