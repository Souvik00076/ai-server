import { ExpressLoader } from "./express";
export class Loader {
  private constructor() {}

  public static init() {
    const express = ExpressLoader.getInstance();
  }
}
