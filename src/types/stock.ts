export enum ShiftType {
  MORNING = "SABAH",
  NOON = "ÖĞLE",
  EVENING = "AKŞAM",
}

export type StockType = {
  id: string;
  barcode: string;
  quantityPerBox: number;
  totalBox: number;
  totalQuantity: number;
  shift: string;
  createdAt: Date;
  employee: {
    user: {
      id: string;
      name: string;
      surname: string;
    };
  };
  product: {
    id: string;
    name: string;
    price: number;
  };
  stockType: string;
};
