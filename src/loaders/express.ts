import express from "express";
import baseRoute from "../routes/index";
import type { Express } from "express";
import cors from "cors";
export class ExpressLoader {
  private static loader: ExpressLoader;
  public app: Express;
  private constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use("/", baseRoute);
    const corsOptions = {
      origin: "*",
      methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
      ],
      credentials: true,
      maxAge: 86400,
    };

    this.app.use(cors(corsOptions));
    this.app.listen(3000, () => {
      console.log("Listening at port 3000");
    });
  }
  public static getInstance(): ExpressLoader {
    if (!this.loader) {
      this.loader = new ExpressLoader();
    }
    return this.loader;
  }
}
