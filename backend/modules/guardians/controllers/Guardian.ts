import { Response } from "express";
import GuardianServices from "../services/Guardian";
import { RequestWithUser } from "@/@types/auth";
import { BaseController } from "@/app";
import { UploadedFile } from "express-fileupload";

export default class GuardianController extends BaseController {
  protected service = new GuardianServices();
  protected entityName = "Guardian";

  // Override create method to handle relationship field mapping and file uploads
  async create(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      // Handle file uploads
      let profilePhotoPath: string | undefined;
      let documentsPath: string | undefined;

      if (req.files) {
        // Handle profile photo upload
        if (req.files.profile_photo) {
          const profilePhoto = Array.isArray(req.files.profile_photo) 
            ? req.files.profile_photo[0] 
            : req.files.profile_photo as UploadedFile;
          profilePhotoPath = this.uploadFile(profilePhoto);
        }

        // Handle documents upload
        if (req.files.documents) {
          const documents = Array.isArray(req.files.documents) 
            ? req.files.documents[0] 
            : req.files.documents as UploadedFile;
          documentsPath = this.uploadFile(documents);
        }
      }

      // Map 'relationship' to 'relationDegree' for backward compatibility
      const data = {
        name: req.body.name,
        phone: req.body.phone,
        relationDegree: req.body.relationship || req.body.relationDegree,
        profile_photo: profilePhotoPath,
        documents: documentsPath,
      };

      const guardian = await this.service.create(data, req.user?.id);
      return this.success(res, "Guardian created successfully", guardian, 201);
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  }

  // Override update method to handle file uploads
  async update(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      // Handle file uploads
      let profilePhotoPath: string | undefined;
      let documentsPath: string | undefined;

      if (req.files) {
        // Handle profile photo upload
        if (req.files.profile_photo) {
          const profilePhoto = Array.isArray(req.files.profile_photo) 
            ? req.files.profile_photo[0] 
            : req.files.profile_photo as UploadedFile;
          profilePhotoPath = this.uploadFile(profilePhoto);
        }

        // Handle documents upload
        if (req.files.documents) {
          const documents = Array.isArray(req.files.documents) 
            ? req.files.documents[0] 
            : req.files.documents as UploadedFile;
          documentsPath = this.uploadFile(documents);
        }
      }

      // Prepare update data
      const updateData: any = {};
      
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.phone) updateData.phone = req.body.phone;
      if (req.body.relationship || req.body.relationDegree) {
        updateData.relationDegree = req.body.relationship || req.body.relationDegree;
      }
      if (profilePhotoPath) updateData.profile_photo = profilePhotoPath;
      if (documentsPath) updateData.documents = documentsPath;

      const guardian = await this.service.update(id, updateData);
      return this.success(res, "Guardian updated successfully", guardian);
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  }

  // Method for uploading files to existing guardian
  async uploadFiles(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      if (!req.files) {
        return this.error(res, "No files uploaded", 400);
      }

      const updateData: any = {};

      // Handle profile photo upload
      if (req.files.profile_photo) {
        const profilePhoto = Array.isArray(req.files.profile_photo) 
          ? req.files.profile_photo[0] 
          : req.files.profile_photo as UploadedFile;
        updateData.profile_photo = this.uploadFile(profilePhoto);
      }

      // Handle documents upload
      if (req.files.documents) {
        const documents = Array.isArray(req.files.documents) 
          ? req.files.documents[0] 
          : req.files.documents as UploadedFile;
        updateData.documents = this.uploadFile(documents);
      }

      if (Object.keys(updateData).length === 0) {
        return this.error(res, "No valid files found for upload", 400);
      }

      const guardian = await this.service.update(id, updateData);
      return this.success(res, "Files uploaded successfully", guardian);
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  }

  // Custom method for finding by phone
  async findByPhone(req: RequestWithUser, res: Response): Promise<Response> {
    try {
      const { phone } = req.params;
      const guardians = await this.service.findByPhone(phone);
      return this.success(res, "Guardians retrieved successfully", guardians);
    } catch (error: any) {
      return this.error(res, error.message, 400);
    }
  }

  // Static methods for backward compatibility
  static async create(req: RequestWithUser, res: Response) {
    const controller = new GuardianController();
    return await controller.create(req, res);
  }

  static async getAll(req: RequestWithUser, res: Response) {
    const controller = new GuardianController();
    return await controller.getAll(req, res);
  }

  static async getById(req: RequestWithUser, res: Response) {
    const controller = new GuardianController();
    return await controller.getById(req, res);
  }

  static async update(req: RequestWithUser, res: Response) {
    const controller = new GuardianController();
    return await controller.update(req, res);
  }

  static async delete(req: RequestWithUser, res: Response) {
    const controller = new GuardianController();
    return await controller.delete(req, res);
  }

  static async paginate(req: RequestWithUser, res: Response) {
    const controller = new GuardianController();
    return await controller.paginate(req, res);
  }

  static async search(req: RequestWithUser, res: Response) {
    const controller = new GuardianController();
    return await controller.search(req, res);
  }

  static async deleteMany(req: RequestWithUser, res: Response) {
    const controller = new GuardianController();
    return await controller.deleteMany(req, res);
  }

  static async findByPhone(req: RequestWithUser, res: Response) {
    const controller = new GuardianController();
    return await controller.findByPhone(req, res);
  }

  static async uploadFiles(req: RequestWithUser, res: Response) {
    const controller = new GuardianController();
    return await controller.uploadFiles(req, res);
  }
}
