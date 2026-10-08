import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ok, created } from "../../utils/response";
import * as service from "./order.service";
import { audit } from "../audit/audit.service";
import { Order } from "./order.model";
import { AuthedRequest } from "../../middleware/auth.middleware";

export const create = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await service.createOrder(req.body);
    return created(res, order, "Order placed successfully");
  }
);

export const track = asyncHandler(
  async (req: Request, res: Response) => {
    const { invoice, phone } = req.query as {
      invoice: string;
      phone: string;
    };
    const result = await service.trackOrder(invoice, phone);
    return ok(res, result);
  }
);

export const adminList = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await service.listOrders(req.query as any);
    return ok(res, result);
  }
);

export const adminGet = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await service.getOrderById(String(req.params.id));
    return ok(res, result);
  }
);



export const adminUpdateStatus = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const orderId = String(req.params.id);
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    const before = { status: order.status };

    const updated = await service.updateOrderStatus(
      orderId,
      req.body.status,
      req.body.note,
      "admin"
    );

    await audit({
      req,
      action: "order.status.update",
      resource: "order",
      resourceId: orderId,
      before,
      after: { status: updated.status },
    });

    return ok(res, updated, "Order status updated");
  }
);