import { TSchema } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { Request, Response, NextFunction } from "express";

// Generic validation middleware function
export function validateSchema<T extends TSchema>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = Value.Check(schema, req.body);

    if (!result) {
      const errors = [...Value.Errors(schema, req.body)];
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.map((error) => ({
          path: error.path,
          message: error.message,
        })),
      });
    }

    next();
  };
}
