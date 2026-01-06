// Este archivo contiene datos de ejemplo para probar la aplicación
// Puedes usar estos datos para poblar tu app inicialmente

// Función para obtener la fecha actual en zona horaria de Chile (UTC-3)
export const getChileDate = (): Date => {
  const now = new Date();
  // Crear una fecha en zona horaria de Chile (UTC-3, sin horario de verano)
  // Chile usa UTC-3 en invierno y UTC-4 en verano
  const offset = -3 * 60; // UTC-3 en minutos
  const chileTime = new Date(now.getTime() + (offset + now.getTimezoneOffset()) * 60000);
  return chileTime;
};

// Función para formatear números con separador de miles (punto)
export const formatPrice = (price: number): string => {
  return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const sampleDishes = [
  // Desayuno
  {
    id: '1',
    name: 'Café con Leche',
    description: 'Café colombiano con leche fresca',
    price: 2500,
    category: 'Desayuno'
  },
  {
    id: '2',
    name: 'Pan con Palta',
    description: 'Pan integral con palta y tomate',
    price: 3000,
    category: 'Desayuno'
  },
  {
    id: '3',
    name: 'Huevos Revueltos',
    description: 'Huevos revueltos con pan tostado',
    price: 3500,
    category: 'Desayuno'
  },
  
  // Almuerzo
  {
    id: '4',
    name: 'Cazuela de Vacuno',
    description: 'Cazuela tradicional chilena con vacuno',
    price: 6500,
    category: 'Almuerzo'
  },
  {
    id: '5',
    name: 'Pollo al Horno',
    description: 'Pollo al horno con papas y ensalada',
    price: 5500,
    category: 'Almuerzo'
  },
  {
    id: '6',
    name: 'Arroz con Pollo',
    description: 'Arroz con pollo y verduras',
    price: 5000,
    category: 'Almuerzo'
  },
  
  // Bebestibles
  {
    id: '7',
    name: 'Jugo Natural',
    description: 'Jugo natural de frutas de temporada',
    price: 2000,
    category: 'Bebestibles'
  },
  {
    id: '8',
    name: 'Coca Cola',
    description: 'Coca Cola 350ml',
    price: 1500,
    category: 'Bebestibles'
  },
  {
    id: '9',
    name: 'Agua Mineral',
    description: 'Agua mineral sin gas 500ml',
    price: 1000,
    category: 'Bebestibles'
  },
  
  // Otros
  {
    id: '10',
    name: 'Empanada de Queso',
    description: 'Empanada al horno rellena de queso',
    price: 1500,
    category: 'Otros'
  },
  {
    id: '11',
    name: 'Sopaipillas',
    description: 'Sopaipillas con pebre',
    price: 2000,
    category: 'Otros'
  },
  {
    id: '12',
    name: 'Completo',
    description: 'Completo italiano con palta, tomate y mayo',
    price: 3000,
    category: 'Otros'
  }
];

// Instrucciones para agregar estos datos:
// 1. Abre la app en el emulador o dispositivo
// 2. Ve a la sección "Platos"
// 3. Usa el botón "+" para agregar cada plato manualmente
// 
// O bien, puedes modificar el AppContext para cargar estos datos inicialmente
// si no hay platos guardados en AsyncStorage
