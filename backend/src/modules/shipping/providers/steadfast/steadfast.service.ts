import axios, { AxiosInstance } from "axios";
import { env } from "../../../../config/env";
import { logger } from "../../../../utils/logger";
import { AppError } from "../../../../utils/AppError";
import {
  CourierProvider,
  CourierShipmentInput,
  CourierShipmentResult,
  CourierStatusResult,
} from "../../shipping.interface";
import { mapSteadfastStatus } from "./steadfast.mapper";

class SteadfastService implements CourierProvider {
  readonly name = "STEADFAST";
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.STEADFAST_BASE_URL,
      timeout: 15000,
      headers: {
        "Api-Key": env.STEADFAST_API_KEY,
        "Secret-Key": env.STEADFAST_SECRET_KEY,
        "Content-Type": "application/json",
      },
    });

    this.client.interceptors.response.use(
      (r) => r,
      (err) => {
        logger.error(
          {
            status: err?.response?.status,
            data: err?.response?.data,
            url: err?.config?.url,
          },
          "Steadfast API error"
        );
        return Promise.reject(err);
      }
    );
  }

  private assertConfigured() {
    if (!env.STEADFAST_API_KEY || !env.STEADFAST_SECRET_KEY) {
      throw new AppError("Steadfast credentials not configured", 500);
    }
  }

  async createShipment(input: CourierShipmentInput): Promise<CourierShipmentResult> {
    this.assertConfigured();

    const payload = {
      invoice: input.invoice,
      recipient_name: input.recipientName,
      recipient_phone: input.recipientPhone,
      recipient_address: input.recipientAddress,
      cod_amount: input.codAmount,
      note: input.note || "",
      item_description: input.itemDescription || "",
      total_lot: input.totalLot || 1,
      delivery_type: input.deliveryType ?? 0,
    };

    const { data } = await this.client.post("/create_order", payload);

    if (!data?.consignment?.consignment_id) {
      throw new AppError(
        data?.message || "Steadfast did not return consignment_id",
        502,
        data
      );
    }

    return {
      consignmentId: String(data.consignment.consignment_id),
      trackingCode: data.consignment.tracking_code,
      status: mapSteadfastStatus(data.consignment.status),
      raw: data,
    };
  }

  async getStatusByInvoice(invoice: string): Promise<CourierStatusResult> {
    this.assertConfigured();
    const { data } = await this.client.get(`/status_by_invoice/${invoice}`);
    return {
      status: mapSteadfastStatus(data.delivery_status),
      rawStatus: data.delivery_status,
    };
  }

  async getStatusByTrackingCode(code: string): Promise<CourierStatusResult> {
    this.assertConfigured();
    const { data } = await this.client.get(`/status_by_trackingcode/${code}`);
    return {
      status: mapSteadfastStatus(data.delivery_status),
      rawStatus: data.delivery_status,
    };
  }

  async getStatusByConsignmentId(id: string): Promise<CourierStatusResult> {
    this.assertConfigured();
    const { data } = await this.client.get(`/status_by_cid/${id}`);
    return {
      status: mapSteadfastStatus(data.delivery_status),
      rawStatus: data.delivery_status,
    };
  }

  async getBalance(): Promise<number> {
    this.assertConfigured();
    const { data } = await this.client.get("/get_balance");
    return Number(data.current_balance || 0);
  }

  async createReturnRequest(params: { invoice: string; reason?: string }) {
    this.assertConfigured();
    const { data } = await this.client.post("/create_return_request", {
      invoice: params.invoice,
      reason: params.reason,
    });
    return data;
  }
}

export const steadfastService = new SteadfastService();