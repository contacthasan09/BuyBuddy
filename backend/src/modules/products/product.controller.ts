import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, created } from "../../utils/response";
import * as productService from "./product.service";
import { AuthedRequest } from "../../middleware/auth.middleware";
import { audit } from "../audit/audit.service";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const result = await productService.listProducts(req.query as any);
  return ok(res, result);
});

export const detail = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getProductBySlug(
    String(req.params.slug)
  );
  return ok(res, product);
});

export const adminList = asyncHandler(async (req: Request, res: Response) => {
  const result = await productService.listProducts(req.query as any);
  return ok(res, result);
});

export const adminGetById = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await productService.getProductById(
      String(req.params.id)
    );
    return ok(res, product);
  }
);

export const adminCreate = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const product = await productService.createProduct(req.body);

    await audit({
      req,
      action: "product.create",
      resource: "product",
      resourceId: String(product._id),
      after: {
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        sellingPrice: product.sellingPrice,
        status: product.status,
      },
    });

    return created(res, product, "Product created");
  }
);

export const adminUpdate = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const id = String(req.params.id);

    // Snapshot before update
    const before = await productService.getProductById(id);
    const beforeSnapshot = {
      name: before.name,
      sellingPrice: before.sellingPrice,
      discountPrice: before.discountPrice,
      status: before.status,
    };

    const product = await productService.updateProduct(id, req.body);

    await audit({
      req,
      action: "product.update",
      resource: "product",
      resourceId: id,
      before: beforeSnapshot,
      after: {
        name: product.name,
        sellingPrice: product.sellingPrice,
        discountPrice: product.discountPrice,
        status: product.status,
      },
    });

    return ok(res, product, "Product updated");
  }
);

export const adminDelete = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const id = String(req.params.id);

    // Snapshot before delete
    const before = await productService.getProductById(id);
    const beforeSnapshot = {
      name: before.name,
      slug: before.slug,
      sku: before.sku,
    };

    await productService.deleteProduct(id);

    await audit({
      req,
      action: "product.delete",
      resource: "product",
      resourceId: id,
      before: beforeSnapshot,
    });

    return ok(res, null, "Product deleted");
  }
);