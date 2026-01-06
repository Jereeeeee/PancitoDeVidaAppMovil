import AsyncStorage from '@react-native-async-storage/async-storage';
import {Share} from 'react-native';
import {Buffer} from 'buffer';

const STORAGE_KEYS = {
  DISHES: '@pancito_dishes',
  ORDERS: '@pancito_orders',
  TABLES: '@pancito_tables',
  FREQUENT_CUSTOMERS: '@pancito_frequent_customers',
  STATISTICS: '@pancito_statistics',
};

interface BackupTopDish {
  id: string;
  name: string;
  category: string;
  quantity: number;
  revenue: number;
}

export interface BackupStatistics {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  paidOrders: number;
  totalRevenue: number;
  averageTicket: number;
  topDishes: BackupTopDish[];
}

export interface BackupData {
  exportDate: string;
  appVersion: string;
  dishes: any[];
  orders: any[];
  tables: any[];
  frequentCustomers: any[];
  statistics: BackupStatistics;
}

// Calcula estadísticas completas basadas en los pedidos guardados
const calculateStatistics = (orders: any[]): BackupStatistics => {
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.completed).length;
  const pendingOrders = totalOrders - completedOrders;
  const paidOrders = orders.filter(o => o.paid).length;
  const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
  const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const dishMap: Record<string, BackupTopDish> = {};

  orders.forEach(order => {
    (order.items || []).forEach((item: any) => {
      if (!item?.dish?.id) {
        return;
      }

      const dishId = String(item.dish.id);
      if (!dishMap[dishId]) {
        dishMap[dishId] = {
          id: dishId,
          name: item.dish.name || 'Plato',
          category: item.dish.category || 'Sin categoría',
          quantity: 0,
          revenue: 0,
        };
      }

      const qty = Number(item.quantity) || 0;
      const price = Number(item.dish.price) || 0;
      dishMap[dishId].quantity += qty;
      dishMap[dishId].revenue += qty * price;
    });
  });

  const topDishes = Object.values(dishMap)
    .sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue)
    .slice(0, 5);

  return {
    totalOrders,
    completedOrders,
    pendingOrders,
    paidOrders,
    totalRevenue,
    averageTicket,
    topDishes,
  };
};

// Construye el respaldo y entrega JSON y metadata
export const buildBackupJson = async (): Promise<{
  fileName: string;
  jsonString: string;
  backupData: BackupData;
}> => {
  const [dishesData, ordersData, tablesData, customersData] = await Promise.all([
    AsyncStorage.getItem(STORAGE_KEYS.DISHES),
    AsyncStorage.getItem(STORAGE_KEYS.ORDERS),
    AsyncStorage.getItem(STORAGE_KEYS.TABLES),
    AsyncStorage.getItem(STORAGE_KEYS.FREQUENT_CUSTOMERS),
  ]);

  const dishes = dishesData ? JSON.parse(dishesData) : [];
  const orders = ordersData ? JSON.parse(ordersData) : [];
  const tables = tablesData ? JSON.parse(tablesData) : [];
  const frequentCustomers = customersData ? JSON.parse(customersData) : [];

  const statistics = calculateStatistics(orders);

  const backupData: BackupData = {
    exportDate: new Date().toISOString(),
    appVersion: '1.0.0',
    dishes,
    orders,
    tables,
    frequentCustomers,
    statistics,
  };

  const fileName = `PancitoDeVida_Respaldo_${new Date().toISOString().split('T')[0]}.json`;
  const jsonString = JSON.stringify(backupData);

  return {fileName, jsonString, backupData};
};

// Exportar todos los datos a un formato JSON
export const exportAllData = async (): Promise<boolean> => {
  try {
    const {fileName, jsonString} = await buildBackupJson();

    // Crear data URL base64 para evitar que algunos destinos recorten el JSON
    const base64Data = Buffer.from(jsonString, 'utf8').toString('base64');
    const dataUrl = `data:application/json;name=${fileName};base64,${base64Data}`;

    // Compartir archivo usando Share API nativa (mensaje + url)
    const shareResponse = await Share.share({
      message: jsonString,
      url: dataUrl,
      title: 'Respaldo de Datos - Pancito de Vida',
    });

    return shareResponse.action !== Share.dismissedAction;
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};

// Exportar pero devolviendo el JSON para usos en nube (S3, etc.)
export const exportAllDataString = async (): Promise<{
  fileName: string;
  jsonString: string;
}> => {
  const {fileName, jsonString} = await buildBackupJson();
  return {fileName, jsonString};
};

// Importar datos desde un archivo JSON
export const importDataFromFile = async (fileContent: string): Promise<boolean> => {
  try {
    const backupData: BackupData = JSON.parse(extractJsonString(fileContent));

    // Validar que tiene los campos requeridos
    if (!backupData.dishes || !backupData.orders || !backupData.tables || !backupData.frequentCustomers || !backupData.statistics) {
      throw new Error('Formato de respaldo inválido');
    }

    const statistics = backupData.statistics || calculateStatistics(backupData.orders);

    // Guardar datos
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(backupData.dishes)),
      AsyncStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(backupData.orders)),
      AsyncStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(backupData.tables)),
      AsyncStorage.setItem(STORAGE_KEYS.FREQUENT_CUSTOMERS, JSON.stringify(backupData.frequentCustomers)),
      AsyncStorage.setItem(STORAGE_KEYS.STATISTICS, JSON.stringify(statistics)),
    ]);

    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
};

// Obtener información del respaldo
export const getBackupInfo = (backupData: BackupData): string => {
  return `
Respaldo generado: ${new Date(backupData.exportDate).toLocaleDateString()}
Versión de app: ${backupData.appVersion}

Datos incluidos:
• Platos: ${backupData.dishes.length}
• Pedidos: ${backupData.orders.length}
• Mesas: ${backupData.tables.length}
• Clientes frecuentes: ${backupData.frequentCustomers.length}

Estadísticas:
• Total de pedidos: ${backupData.statistics.totalOrders}
• Pedidos completados: ${backupData.statistics.completedOrders}
• Pendientes: ${backupData.statistics.pendingOrders}
• Pagados: ${backupData.statistics.paidOrders}
• Ticket promedio: $${backupData.statistics.averageTicket.toLocaleString()}
• Ingresos totales: $${backupData.statistics.totalRevenue.toLocaleString()}
  `.trim();
};

// Importar datos desde texto JSON pegado
export const importDataFromJSON = async (jsonText: string): Promise<boolean> => {
  try {
    const cleanedText = extractJsonString(jsonText);

    // Validar y parsear JSON
    let backupData: BackupData;
    try {
      backupData = JSON.parse(cleanedText);
    } catch (parseError) {
      throw new Error('El formato del JSON es inválido. Verifica que copiaste todo el contenido correctamente.');
    }
    
    // Validar estructura
    if (!backupData.dishes || !backupData.orders || !backupData.tables || !backupData.frequentCustomers || !backupData.statistics) {
      throw new Error('El archivo no tiene un formato válido de respaldo');
    }

    const statistics = backupData.statistics || calculateStatistics(backupData.orders);

    // Guardar datos
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(backupData.dishes)),
      AsyncStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(backupData.orders)),
      AsyncStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(backupData.tables)),
      AsyncStorage.setItem(STORAGE_KEYS.FREQUENT_CUSTOMERS, JSON.stringify(backupData.frequentCustomers)),
      AsyncStorage.setItem(STORAGE_KEYS.STATISTICS, JSON.stringify(statistics)),
    ]);

    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
};

// Extrae el JSON válido incluso si el texto tiene ruido antes o después
const extractJsonString = (rawText: string): string => {
  const trimmed = (rawText || '').trim();

  if (!trimmed) {
    throw new Error('El texto está vacío');
  }

  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('El JSON está incompleto. Asegúrate de copiar todo el contenido.');
  }

  return trimmed.slice(start, end + 1);
};

