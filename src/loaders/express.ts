import express from "express";
import type { Express } from "express";
export class ExpressLoader {
  private static loader: ExpressLoader;
  public app: Express;
  private constructor() {
    this.app = express();
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
