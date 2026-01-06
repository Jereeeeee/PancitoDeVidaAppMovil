export enum DishCategory {
  DESAYUNO = 'Desayuno',
  ALMUERZO = 'Almuerzo',
  BEBESTIBLES = 'Bebestibles',
  OTROS = 'Otros',
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: DishCategory;
}

export interface OrderItem {
  dish: Dish;
  quantity: number;
}

export enum TableStatus {
  AVAILABLE = 'Disponible',
  OCCUPIED = 'Ocupada',
  RESERVED = 'Reservada',
}

export interface Table {
  id: number;
  status: TableStatus;
}

export interface Order {
  id: string;
  tableId: number | null; // null para zona libre
  customerName?: string; // Nombre del cliente frecuente (opcional)
  items: OrderItem[];
  total: number;
  createdAt: Date;
  completed: boolean;
  paid?: boolean; // Estado de pago para clientes frecuentes (opcional)
}

export interface DailyStat {
  date: string;
  totalSales: number;
  ordersCount: number;
  topDishes: {
    dish: Dish;
    quantity: number;
  }[];
}

export interface FrequentCustomer {
  id: string;
  name: string;
  local: string;
  createdAt: Date;
}
