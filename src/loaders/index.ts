import { ExpressLoader } from "./express";
import baseRoute from "../routes/index.ts";
export class Loader {
  private constructor() {}

  public static init() {
    const express = ExpressLoader.getInstance();
    express.app.use("/", baseRoute);
  }
}
