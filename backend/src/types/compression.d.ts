declare module "compression" {
  import { RequestHandler } from "express";

  interface CompressionOptions {
    threshold?: number | string;
    level?: number;
    memLevel?: number;
    strategy?: number;
    windowBits?: number;
    chunkSize?: number;
    flush?: number;
    finishFlush?: number;
    filter?: (
      req: import("http").IncomingMessage,
      res: import("http").ServerResponse
    ) => boolean;
  }

  function compression(options?: CompressionOptions): RequestHandler;

  export = compression;
}
