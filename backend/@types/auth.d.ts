import { type Request } from "express";
import { type UploadedFile } from "express-fileupload";
export type RequestWithUser = Request & { user?: any; file?: UploadedFile };
