export interface Product {
  sku: string;
  name: string;
  price: number;
  upc: string;
  status: 'Active' | 'Inactive';
  parentSku?: string;
  category: string;
  qbItemCode?: string;
  ssSku?: string;
  wooId?: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'IN QB' | 'IN SHIPSTATION' | 'SHIPPED' | 'CLOSED' | 'NEEDS ACTION';

export interface OrderItem {
  sku: string;
  name: string;
  qty: number;
  price: number;
  mapPrice?: number;
}

export interface Order {
  id: string;
  channel: 'WOO' | 'WALMART' | 'TIKTOK' | 'NEWEGG' | 'EMAIL PO' | 'MANUAL';
  customer: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shipBy: string;
  invoiceStatus?: 'NOT INVOICED' | 'SENT' | 'PAYMENT PENDING' | 'PAID' | 'OVERDUE';
  tracking?: {
    number: string;
    carrier: string;
    status: string;
    lastScan: string;
  };
}
