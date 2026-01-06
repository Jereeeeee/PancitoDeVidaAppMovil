# 🥖 Pancito de Vida - Sistema de Gestión de Pedidos

Aplicación móvil Android desarrollada con React Native y TypeScript para gestionar pedidos en el restaurante "Pancito de Vida".

## 📱 Características

### Módulos Principales

1. **🏠 Inicio** - Pantalla principal con accesos rápidos a todas las funcionalidades
2. **📋 Pedidos** - Vista de 4 mesas + zona libre con gestión de pedidos activos
3. **➕ Nuevo Pedido** - Crear pedidos con cálculo automático de totales
4. **🍽️ Platos** - Gestión del menú (Desayuno, Almuerzo, Bebestibles, Otros)
5. **📊 Estadísticas** - Reportes diarios y top platos más vendidos

## 🛠️ Tecnologías

- React Native 0.83.1 con TypeScript
- React Navigation (Bottom Tabs)
- AsyncStorage para persistencia de datos
- React Context API para estado global

## 📦 Instalación

### Prerrequisitos
- Node.js v14+
- Android Studio con SDK
- JDK 11+

### Configurar proyecto

```bash
npm install
```

## 🚀 Ejecutar la Aplicación

### Modo Desarrollo

```bash
# Iniciar Metro Bundler
npm start

# En otra terminal
npm run android
```

### Generar APK para Android

**APK de Release (Producción):**
```bash
cd android
gradlew assembleRelease
```
APK ubicado en: `android/app/build/outputs/apk/release/app-release.apk`

**APK de Debug (Pruebas):**
```bash
cd android
gradlew assembleDebug
```
APK ubicado en: `android/app/build/outputs/apk/debug/app-debug.apk`

## 📱 Instalar APK en Dispositivo

1. Habilitar "Fuentes desconocidas" en ajustes de Android
2. Transferir APK al dispositivo
3. Abrir el archivo APK y confirmar instalación

## 🏗️ Estructura del Proyecto

```
src/
├── components/      # Componentes reutilizables
├── context/        # AppContext (estado global)
├── navigation/     # Bottom Tab Navigator
├── screens/        # 5 pantallas principales
│   ├── HomeScreen.tsx
│   ├── OrdersScreen.tsx
│   ├── NewOrderScreen.tsx
│   ├── DishesScreen.tsx
│   └── StatisticsScreen.tsx
├── types/          # Interfaces TypeScript
└── utils/          # Utilidades
```

## 💾 Almacenamiento

Usa AsyncStorage para persistir:
- Platos del menú
- Pedidos (activos/completados)
- Estado de mesas
- Historial de ventas

## 📋 Funcionalidades

- ✅ 4 mesas + zona libre
- ✅ Suma automática de precios en pedidos
- ✅ Gestión completa de platos por categorías
- ✅ Reportes diarios con top 5 platos más vendidos
- ✅ Estados de mesa (Disponible/Ocupada/Reservada)
- ✅ Persistencia de datos local
- ✅ Interfaz moderna y colorida
- ✅ Navegación por pestañas

## 🐛 Solución de Problemas

### Error al compilar Android
```bash
cd android
gradlew clean
cd ..
```

### Limpiar cache de Metro
```bash
npm start -- --reset-cache
```

### Variables de entorno necesarias
- `ANDROID_HOME`: Ruta al SDK de Android
- `JAVA_HOME`: Ruta al JDK

## 📄 Scripts Disponibles

```bash
npm start          # Iniciar Metro Bundler
npm run android    # Ejecutar en Android
npm test           # Ejecutar tests
npm run lint       # Verificar código
```

## 🎨 Paleta de Colores

- Verde (#4CAF50) - Pedidos/Disponible
- Azul (#2196F3) - Nuevo Pedido
- Naranja (#FF9800) - Platos
- Púrpura (#9C27B0) - Estadísticas
- Rojo (#F44336) - Mesa Ocupada

---

**Versión:** 1.0.0  
**Desarrollado para:** Pancito de Vida  
**Última actualización:** Diciembre 2025
