export interface SteadfastOrderInput {
  invoice: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  cod_amount: number;
  note?: string;
  item_description?: string;
  total_lot?: number;
  delivery_type?: 0 | 1;
  alternative_phone?: string;
  recipient_email?: string;
}

export interface SteadfastConsignment {
  consignment_id: number;
  invoice: string;
  tracking_code: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  cod_amount: number;
  status: string;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface SteadfastCreateResponse {
  status: number;
  message: string;
  consignment: SteadfastConsignment;
}

export interface SteadfastStatusResponse {
  status: number;
  delivery_status: string;
}