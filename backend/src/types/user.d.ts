import type { AuthPayload } from "../middleware/middleware";

declare global {
  namespace Express {
    export interface Request {
      user?: AuthPayload;
    }
  }
}
