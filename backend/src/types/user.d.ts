import "express";
import { AuthPayload } from "./middleware/middleware";

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthPayload;
  }
}
