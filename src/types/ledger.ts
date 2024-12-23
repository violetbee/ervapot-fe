import { ProductType } from "./product";

export enum LedgerType {
  CUSTOMER = "MÜŞTERİ",
  WHOLESALER = "TOPTANCI",
}

export type GetLedgerType = {
  id: string;
  name: string;
  type: string;
  phone: string;
  address: string;
  balance: number;
  orders: [];
  createdAt: Date;
  updatedAt: Date;
  stock?: {
    id: string;
    createdAt: Date;
    description: string;
    totalBox: number;
    stockType: string;
    specialPrice?: number;
    product: ProductType;
  }[];
};

export type CreateLedgerType = Omit<
  GetLedgerType,
  "id" | "orders" | "createdAt" | "updatedAt"
>;
