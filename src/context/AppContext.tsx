import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dish, Order, Table, TableStatus, DailyStat, DishCategory, FrequentCustomer} from '../types';
import {getChileDate} from '../utils/sampleData';

interface AppContextType {
  dishes: Dish[];
  orders: Order[];
  tables: Table[];
  frequentCustomers: FrequentCustomer[];
  addDish: (dish: Dish) => Promise<void>;
  updateDish: (dish: Dish) => Promise<void>;
  deleteDish: (id: string) => Promise<void>;
  addOrder: (order: Order) => Promise<void>;
  updateOrder: (order: Order) => Promise<void>;
  completeOrder: (id: string) => Promise<void>;
  cancelOrder: (id: string) => Promise<void>;
  addFrequentCustomer: (customer: FrequentCustomer) => Promise<void>;
  deleteFrequentCustomer: (id: string) => Promise<void>;
  getOrdersByCustomer: (customerName: string) => Order[];
  getTodayStats: () => DailyStat;
  getWeeklyStats: () => DailyStat;
  getMonthlyStats: () => DailyStat;
  getAnnualStats: () => DailyStat;
  getDishesByCategory: (category: DishCategory) => Dish[];
  getOrdersByTable: (tableId: number | null) => Order[];
  updateTableStatus: (tableId: number, status: TableStatus) => void;
  reloadAllData: () => Promise<void>;
  updateOrderPaymentStatus: (orderId: string, paid: boolean) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  DISHES: '@pancito_dishes',
  ORDERS: '@pancito_orders',
  TABLES: '@pancito_tables',
  FREQUENT_CUSTOMERS: '@pancito_frequent_customers',
};

// Datos iniciales de las 4 mesas
const initialTables: Table[] = [
  {id: 1, status: TableStatus.AVAILABLE},
  {id: 2, status: TableStatus.AVAILABLE},
  {id: 3, status: TableStatus.AVAILABLE},
  {id: 4, status: TableStatus.AVAILABLE},
];

export const AppProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [frequentCustomers, setFrequentCustomers] = useState<FrequentCustomer[]>([]);

  // Cargar datos del almacenamiento
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dishesData, ordersData, tablesData, customersData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.DISHES),
        AsyncStorage.getItem(STORAGE_KEYS.ORDERS),
        AsyncStorage.getItem(STORAGE_KEYS.TABLES),
        AsyncStorage.getItem(STORAGE_KEYS.FREQUENT_CUSTOMERS),
      ]);

      if (dishesData) setDishes(JSON.parse(dishesData));
      if (ordersData) {
        const parsedOrders = JSON.parse(ordersData);
        // Convertir las fechas de string a Date
        const ordersWithDates = parsedOrders.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
        }));
        setOrders(ordersWithDates);
      }
      if (tablesData) {
        const parsedTables = JSON.parse(tablesData);
        // Si no hay mesas guardadas, usar las iniciales
        setTables(parsedTables.length > 0 ? parsedTables : initialTables);
      }
      if (customersData) {
        const parsedCustomers = JSON.parse(customersData);
        const customersWithDates = parsedCustomers.map((customer: any) => ({
          ...customer,
          createdAt: new Date(customer.createdAt),
        }));
        setFrequentCustomers(customersWithDates);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveDishes = async (newDishes: Dish[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(newDishes));
      setDishes(newDishes);
    } catch (error) {
      console.error('Error saving dishes:', error);
    }
  };

  const saveOrders = async (newOrders: Order[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(newOrders));
      setOrders(newOrders);
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  };

  const saveTables = async (newTables: Table[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(newTables));
      setTables(newTables);
    } catch (error) {
      console.error('Error saving tables:', error);
    }
  };

  const addDish = async (dish: Dish) => {
    await saveDishes([...dishes, dish]);
  };

  const updateDish = async (dish: Dish) => {
    const updated = dishes.map(d => (d.id === dish.id ? dish : d));
    await saveDishes(updated);
  };

  const deleteDish = async (id: string) => {
    const filtered = dishes.filter(d => d.id !== id);
    await saveDishes(filtered);
  };

  const addOrder = async (order: Order) => {
    await saveOrders([...orders, order]);
    
    // Actualizar estado de la mesa si no es zona libre
    if (order.tableId !== null) {
      const updatedTables = tables.map(t =>
        t.id === order.tableId ? {...t, status: TableStatus.OCCUPIED} : t
      );
      await saveTables(updatedTables);
    }
  };

  const updateOrder = async (order: Order) => {
    const updated = orders.map(o =>
      o.id === order.id ? order : o
    );
    await saveOrders(updated);
  };

  const completeOrder = async (id: string) => {
    const updated = orders.map(o =>
      o.id === id ? {...o, completed: true} : o
    );
    await saveOrders(updated);

    // Liberar mesa si todos los pedidos de la mesa están completados
    const completedOrder = orders.find(o => o.id === id);
    if (completedOrder && completedOrder.tableId !== null) {
      const tableOrders = updated.filter(
        o => o.tableId === completedOrder.tableId && !o.completed
      );
      if (tableOrders.length === 0) {
        const updatedTables = tables.map(t =>
          t.id === completedOrder.tableId
            ? {...t, status: TableStatus.AVAILABLE}
            : t
        );
        await saveTables(updatedTables);
      }
    }
  };

  const cancelOrder = async (id: string) => {
    const updated = orders.filter(o => o.id !== id);
    await saveOrders(updated);

    // Liberar mesa si ya no hay pedidos activos
    const canceledOrder = orders.find(o => o.id === id);
    if (canceledOrder && canceledOrder.tableId !== null) {
      const tableOrders = updated.filter(
        o => o.tableId === canceledOrder.tableId && !o.completed
      );
      if (tableOrders.length === 0) {
        const updatedTables = tables.map(t =>
          t.id === canceledOrder.tableId
            ? {...t, status: TableStatus.AVAILABLE}
            : t
        );
        await saveTables(updatedTables);
      }
    }
  };

  const getTodayStats = (): DailyStat => {
    const today = getChileDate().toDateString();
    const todayOrders = orders.filter(
      o => o.createdAt.toDateString() === today && o.completed
    );

    const totalSales = todayOrders.reduce((sum, order) => sum + order.total, 0);
    const ordersCount = todayOrders.length;

    // Calcular platos más vendidos
    const dishCounts: {[dishId: string]: {dish: Dish; quantity: number}} = {};
    
    todayOrders.forEach(order => {
      order.items.forEach(item => {
        if (!dishCounts[item.dish.id]) {
          dishCounts[item.dish.id] = {dish: item.dish, quantity: 0};
        }
        dishCounts[item.dish.id].quantity += item.quantity;
      });
    });

    const topDishes = Object.values(dishCounts)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const todayDate = getChileDate();
    const formattedDate = todayDate.toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return {
      date: formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1),
      totalSales,
      ordersCount,
      topDishes,
    };
  };

  const getWeeklyStats = (): DailyStat => {
    const now = getChileDate();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weekOrders = orders.filter(
      o => o.createdAt >= sevenDaysAgo && o.createdAt <= now && o.completed
    );

    const totalSales = weekOrders.reduce((sum, order) => sum + order.total, 0);
    const ordersCount = weekOrders.length;

    const dishCounts: {[dishId: string]: {dish: Dish; quantity: number}} = {};
    
    weekOrders.forEach(order => {
      order.items.forEach(item => {
        if (!dishCounts[item.dish.id]) {
          dishCounts[item.dish.id] = {dish: item.dish, quantity: 0};
        }
        dishCounts[item.dish.id].quantity += item.quantity;
      });
    });

    const topDishes = Object.values(dishCounts)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      date: 'Esta Semana',
      totalSales,
      ordersCount,
      topDishes,
    };
  };

  const getMonthlyStats = (): DailyStat => {
    const now = getChileDate();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const monthOrders = orders.filter(
      o => o.createdAt >= thirtyDaysAgo && o.createdAt <= now && o.completed
    );

    const totalSales = monthOrders.reduce((sum, order) => sum + order.total, 0);
    const ordersCount = monthOrders.length;

    const dishCounts: {[dishId: string]: {dish: Dish; quantity: number}} = {};
    
    monthOrders.forEach(order => {
      order.items.forEach(item => {
        if (!dishCounts[item.dish.id]) {
          dishCounts[item.dish.id] = {dish: item.dish, quantity: 0};
        }
        dishCounts[item.dish.id].quantity += item.quantity;
      });
    });

    const topDishes = Object.values(dishCounts)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      date: 'Este Mes',
      totalSales,
      ordersCount,
      topDishes,
    };
  };

  const getAnnualStats = (): DailyStat => {
    const now = getChileDate();
    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    
    const yearOrders = orders.filter(
      o => o.createdAt >= yearAgo && o.createdAt <= now && o.completed
    );

    const totalSales = yearOrders.reduce((sum, order) => sum + order.total, 0);
    const ordersCount = yearOrders.length;

    const dishCounts: {[dishId: string]: {dish: Dish; quantity: number}} = {};
    
    yearOrders.forEach(order => {
      order.items.forEach(item => {
        if (!dishCounts[item.dish.id]) {
          dishCounts[item.dish.id] = {dish: item.dish, quantity: 0};
        }
        dishCounts[item.dish.id].quantity += item.quantity;
      });
    });

    const topDishes = Object.values(dishCounts)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      date: 'Este Año',
      totalSales,
      ordersCount,
      topDishes,
    };
  };

  const getDishesByCategory = (category: DishCategory): Dish[] => {
    return dishes.filter(d => d.category === category);
  };

  const getOrdersByTable = (tableId: number | null): Order[] => {
    return orders.filter(o => o.tableId === tableId && !o.completed);
  };

  const getOrdersByCustomer = (customerName: string): Order[] => {
    return orders.filter(o => o.customerName === customerName && !o.completed);
  };

  const addFrequentCustomer = async (customer: FrequentCustomer) => {
    const updated = [...frequentCustomers, customer];
    setFrequentCustomers(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.FREQUENT_CUSTOMERS, JSON.stringify(updated));
  };

  const deleteFrequentCustomer = async (id: string) => {
    const updated = frequentCustomers.filter(c => c.id !== id);
    setFrequentCustomers(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.FREQUENT_CUSTOMERS, JSON.stringify(updated));
  };

  const updateTableStatus = (tableId: number, status: TableStatus) => {
    const updatedTables = tables.map(t =>
      t.id === tableId ? {...t, status} : t
    );
    saveTables(updatedTables);
  };

  const updateOrderPaymentStatus = async (orderId: string, paid: boolean) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? {...order, paid} : order
    );
    await saveOrders(updatedOrders);
  };

  const reloadAllData = async () => {
    await loadData();
  };

  return (
    <AppContext.Provider
      value={{
        dishes,
        orders,
        tables,
        frequentCustomers,
        addDish,
        updateDish,
        deleteDish,
        addOrder,
        updateOrder,
        completeOrder,
        cancelOrder,
        addFrequentCustomer,
        deleteFrequentCustomer,
        getOrdersByCustomer,
        getTodayStats,
        getWeeklyStats,
        getMonthlyStats,
        getAnnualStats,
        getDishesByCategory,
        getOrdersByTable,
        updateTableStatus,
        reloadAllData,
        updateOrderPaymentStatus,
        updateOrder,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
