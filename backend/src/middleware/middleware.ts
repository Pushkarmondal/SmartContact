import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export interface AuthPayload extends JwtPayload {
  id: number;
  email: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token" });
    } 
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || "Your sectet here"
    ) as AuthPayload;
    if (!decodedToken.id) {
      return res.status(401).json({ message: "Invalid token: no id" });
    }
    req.user = decodedToken; 
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
