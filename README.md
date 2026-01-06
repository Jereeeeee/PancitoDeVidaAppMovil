# 🥖 Pancito de Vida - Sistema de Gestión de Pedidos

**Aplicación móvil Android con React Native y TypeScript para gestionar pedidos en restaurantes**

---

## 📋 Descripción del Proyecto

Pancito de Vida es una aplicación completa de gestión de pedidos y mesas para restaurantes, desarrollada como una solución moderna con React Native. La aplicación permite administrar pedidos en múltiples mesas, gestionar un menú dinámico, y generar reportes de ventas automáticos.

---

## ✨ Características Principales

### 🏠 **Pantalla de Inicio**
- Menú principal con accesos rápidos a todas las funciones
- Diseño limpio e intuitivo

### 📋 **Gestión de Pedidos**
- 4 mesas numeradas + zona libre para pedidos sin mesa asignada
- Estados de mesa: Disponible, Ocupada, Reservada
- Visualización de pedidos activos por mesa
- Cálculo automático de totales
- Opción para completar pedidos

### ➕ **Nuevo Pedido**
- Selector de mesa o zona libre
- Catálogo completo de platos disponibles
- Adición y sustracción de cantidad con botones +/-
- **Suma automática de precios en tiempo real**
- Vista previa del pedido
- Cálculo total antes de confirmar

### 🍽️ **Gestión de Platos**
- 4 categorías: Desayuno, Almuerzo, Bebestibles, Otros
- CRUD completo (Crear, Leer, Actualizar, Eliminar)
- Campos por plato: Nombre, Precio, Descripción, Categoría
- Gestión visual e intuitiva

### 📊 **Estadísticas y Reportes**
- Reporte diario automático
- Total de ventas del día
- Cantidad de pedidos completados
- **Top 5 platos más vendidos**
- Dashboard con métricas clave
- Promedio de venta por pedido

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| React Native | 0.83.1 | Framework móvil |
| TypeScript | 5.8.3 | Tipado estático |
| React Navigation | 7.9.0 | Navegación (Bottom Tabs) |
| AsyncStorage | 2.2.0 | Persistencia local de datos |
| React Context API | - | Gestión de estado global |
| React | 19.2.0 | Librería UI |
| Node.js | 20+ | Runtime de JavaScript |

---

## 📁 Estructura del Proyecto

```
PancitoDeVida/
├── .github/
│   └── copilot-instructions.md       # Guía de instrucciones
├── android/                          # Configuración Android (APK)
│   ├── app/
│   │   └── build/                   # Salida de builds
│   ├── gradle/
│   └── build.gradle
├── ios/                             # Soporte iOS
├── src/
│   ├── components/                  # Componentes reutilizables
│   ├── context/
│   │   └── AppContext.tsx          # Estado global de la app
│   ├── navigation/
│   │   └── AppNavigator.tsx        # Configuración de navegación
│   ├── screens/                     # Pantallas principales (5)
│   │   ├── HomeScreen.tsx
│   │   ├── OrdersScreen.tsx
│   │   ├── NewOrderScreen.tsx
│   │   ├── DishesScreen.tsx
│   │   └── StatisticsScreen.tsx
│   ├── types/
│   │   └── index.ts                # Interfaces TypeScript
│   └── utils/
│       ├── sampleData.ts           # Datos de ejemplo
│       ├── dataBackup.ts           # Funciones de respaldo
│       └── versiculos.ts           # Contenido adicional
├── App.tsx                          # Componente raíz
├── package.json                     # Dependencias y scripts
├── tsconfig.json                    # Configuración TypeScript
├── babel.config.js                  # Configuración Babel
├── metro.config.js                  # Configuración Metro
├── jest.config.js                   # Configuración Jest
├── app.json                         # Configuración de la app
└── README.md                        # Documentación técnica
```

---

## 🚀 Instalación y Setup

### Prerequisitos
- **Node.js** v20 o superior
- **npm** o **yarn**
- **Android Studio** con SDK configurado (para Android)
- **JDK 11** o superior

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tuusuario/PancitoDeVida.git
cd PancitoDeVida
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Android (si no está hecho)**
```bash
# Crear archivo local.properties con rutas del SDK
# En android/local.properties:
sdk.dir=/ruta/a/tu/Android/Sdk
```

---

## 🎮 Ejecutar la Aplicación

### Modo Desarrollo

**Terminal 1 - Iniciar Metro Bundler:**
```bash
npm start
```

**Terminal 2 - Compilar y ejecutar en Android:**
```bash
npm run android
```

### En Dispositivo o Emulador

Asegúrate de tener un dispositivo o emulador Android conectado:
```bash
adb devices
npm run android
```

---

## 📦 Generación de APK

### APK de Debug (Para pruebas)
```bash
npm run build:android:debug
```
**Ubicación:** `android/app/build/outputs/apk/debug/app-debug.apk`

### APK de Release (Para producción)
```bash
npm run build:android
```
**Ubicación:** `android/app/build/outputs/apk/release/app-release.apk`

### Instalación en Dispositivo
```bash
npm run install:device
```

O manualmente:
1. Habilitar "Fuentes desconocidas" en Ajustes > Seguridad
2. Transferir APK al dispositivo
3. Abrir el archivo y confirmar instalación

---

## 💾 Persistencia de Datos

La aplicación utiliza **AsyncStorage** para almacenar datos localmente:
- ✅ Catálogo de platos
- ✅ Pedidos activos y completados
- ✅ Estados de mesas
- ✅ Historial de ventas
- ✅ Reportes diarios

Los datos persisten incluso después de cerrar la aplicación.

---

## 🔧 Scripts Disponibles

```json
{
  "npm start": "Inicia el Metro Bundler",
  "npm run android": "Compila y ejecuta en Android",
  "npm run ios": "Compila y ejecuta en iOS",
  "npm test": "Ejecuta tests con Jest",
  "npm run lint": "Valida el código con ESLint",
  "npm run build:android": "Genera APK de release",
  "npm run build:android:debug": "Genera APK de debug",
  "npm run clean:android": "Limpia la carpeta build de Android",
  "npm run install:device": "Instala APK en dispositivo conectado"
}
```

---

## 🎨 Interfaz de Usuario

- **Paleta de colores** distintiva por módulo
- **Navegación por pestañas** inferior (Bottom Tabs)
- **Iconos emoji** para mejor experiencia de usuario
- **Diseño responsive** adaptado a diferentes tamaños
- **Feedback visual** en todas las interacciones

---

## 📱 Compatibilidad

- **Android:** 5.0+ (API 21+)
- **Orientación:** Portrait (recomendado)
- **Soporte para tablet:** Disponible en MODO_TABLET.md

---

## 🧪 Testing

Ejecutar tests unitarios:
```bash
npm test
```

Linter:
```bash
npm run lint
```

---

## 📚 Documentación Adicional

Este repositorio incluye documentación completa:

| Documento | Descripción |
|-----------|------------|
| `README.md` | Documentación técnica y features |
| `GENERAR_APK.md` | Guía detallada para generar APK |
| `MANUAL_USUARIO.md` | Manual de uso de la aplicación |
| `COMANDOS.md` | Referencia rápida de comandos |
| `MODO_TABLET.md` | Configuración para modo tablet |
| `GUIA_IMPORTAR_DATOS.md` | Cómo importar datos existentes |

---

## 🔐 Seguridad y Mejores Prácticas

✅ **TypeScript** para tipado estático y menos errores
✅ **Context API** para gestión segura de estado
✅ **Almacenamiento local** de datos sensibles
✅ **Validación** de entrada en formularios
✅ **Manejo de errores** robusto

---

## 🐛 Troubleshooting

### "Module not found" error
```bash
npm install
cd android && gradlew clean && cd ..
npm start -- --reset-cache
```

### Problema con Metro Bundler
```bash
# Limpiar caché
npm start -- --reset-cache

# O en Windows
npm start -- --reset-cache
```

### APK no instala
1. Desinstalar versión anterior
2. Habilitar "Fuentes desconocidas"
3. Intentar instalación nuevamente

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está disponible bajo la Licencia MIT.

---

## 📧 Contacto

Para soporte o preguntas sobre el proyecto, contacta al equipo de desarrollo.

---

## 📊 Estado del Proyecto

✅ **COMPLETADO Y LISTO PARA PRODUCCIÓN**

- Todas las features solicitadas implementadas
- APK generado y probado
- Documentación completa
- Sistema robusto de gestión de datos

---

**Última actualización:** Enero 2026
**Versión:** 1.0.0
