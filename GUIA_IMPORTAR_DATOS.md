# 📤 Guía de Importación de Datos - Pancito de Vida

## ✅ Implementación Completada

Se ha agregado exitosamente la funcionalidad de **importar datos** al sistema de respaldo de Pancito de Vida.

---

## 🎯 ¿Cómo Funciona?

### **1. Exportar Datos (Crear Respaldo)**

1. Abre la app en tu tablet
2. Presiona el botón **"💾 Respaldo"** en la pantalla principal
3. En el modal, presiona **"📥 Exportar Datos"**
4. Se abrirá el menú de compartir de Android
5. Elige dónde guardar:
   - Gmail (envíate un email)
   - WhatsApp (a ti mismo)
   - Google Drive
   - Descargas (archivo local)

El archivo generado se llama: `PancitoDeVida_Respaldo_YYYY-MM-DD.json`

---

### **2. Importar Datos (Restaurar Respaldo)**

1. Localiza tu archivo de respaldo (`.json`)
2. Abre el archivo con cualquier app de texto o editor
3. Copia TODO el contenido (Ctrl+A, Ctrl+C)
4. En Pancito de Vida:
   - Presiona **"💾 Respaldo"**
   - Presiona **"📤 Importar Datos"**
   - Se abrirá un nuevo modal
5. **Pega** el contenido JSON en el cuadro de texto
6. Presiona **"✅ Confirmar Importación"**
7. Lee la advertencia (se reemplazarán los datos actuales)
8. Confirma la importación
9. La app se reiniciará automáticamente con los datos restaurados

---

## ⚠️ Advertencias Importantes

### **Datos Actuales se Reemplazarán**
- La importación **elimina** todos los datos actuales
- Se reemplazan con los datos del archivo JSON
- No hay función "deshacer" - asegúrate de tener un respaldo actual antes

### **Formato del Archivo**
- Solo acepta archivos JSON generados por la función de exportar
- El archivo debe contener:
  - `dishes` (platos)
  - `orders` (pedidos)
  - `tables` (mesas)
  - `frequentCustomers` (clientes frecuentes)
  - `statistics` (estadísticas)

### **Validación**
- Si el archivo está corrupto o incompleto, se mostrará un error
- No se importarán datos parciales
- Todo o nada: se importan todos los datos o ninguno

---

## 🎨 Interfaz de Usuario

### **Modal de Respaldo**
```
┌─────────────────────────────────┐
│  💾 Respaldar Datos            │
├─────────────────────────────────┤
│                                 │
│  Exporta todos tus datos...     │
│                                 │
│  ⚠️ Importante                  │
│  Si desinstalas la app sin...   │
│                                 │
│  ┌──────────────────────┐       │
│  │ 📥 Exportar Datos    │ Café  │
│  └──────────────────────┘       │
│                                 │
│  ┌──────────────────────┐       │
│  │ 📤 Importar Datos    │ Verde │
│  └──────────────────────┘       │
│                                 │
│  [Cancelar]                     │
└─────────────────────────────────┘
```

### **Modal de Importar**
```
┌─────────────────────────────────┐
│  📤 Importar Datos             │
├─────────────────────────────────┤
│                                 │
│  Pega aquí el contenido del...  │
│                                 │
│  ⚠️ Advertencia                 │
│  Esta acción reemplazará TODOS..│
│                                 │
│  ┌─────────────────────────┐   │
│  │ {                       │   │
│  │   "exportDate": "...",  │   │
│  │   "appVersion": "1.0.0",│   │
│  │   "dishes": [...],      │   │
│  │   ...                   │   │
│  │ }                       │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌──────────────────────┐       │
│  │✅ Confirmar Importa.. │ Verde│
│  └──────────────────────┘       │
│                                 │
│  [Cancelar]                     │
│                                 │
│  💡 Cómo obtener el JSON:       │
│  1. Abre el archivo...          │
└─────────────────────────────────┘
```

---

## 📊 Ejemplo de Archivo JSON

```json
{
  "exportDate": "2026-01-02T12:30:45.123Z",
  "appVersion": "1.0.0",
  "dishes": [
    {
      "id": "1",
      "name": "Completo",
      "price": 2500,
      "category": "Breakfast"
    }
  ],
  "orders": [
    {
      "id": "order_1",
      "tableNumber": 1,
      "items": [...],
      "total": 5000,
      "date": "2026-01-02"
    }
  ],
  "tables": [...],
  "frequentCustomers": [...],
  "statistics": {
    "totalOrders": 150,
    "totalRevenue": 450000
  }
}
```

---

## 🔧 Detalles Técnicos

### **Archivos Modificados**

1. **src/utils/dataBackup.ts**
   - Agregada función `importDataFromJSON(jsonText: string)`
   - Validación de estructura de datos
   - Guardado en AsyncStorage

2. **src/screens/HomeScreen.tsx**
   - Agregado modal de importación
   - TextInput multiline para pegar JSON
   - Manejo de estado `importModalVisible` e `importText`
   - Función `handleImportData()` con validación

### **Estados de la App**

```typescript
const [backupModalVisible, setBackupModalVisible] = useState(false);
const [importModalVisible, setImportModalVisible] = useState(false);
const [isExporting, setIsExporting] = useState(false);
const [isImporting, setIsImporting] = useState(false);
const [importText, setImportText] = useState('');
```

### **Flujo de Importación**

```
Usuario presiona "📤 Importar" 
    ↓
Se abre modal con TextInput
    ↓
Usuario pega JSON
    ↓
Presiona "✅ Confirmar"
    ↓
Validación de JSON
    ↓
Validación de estructura
    ↓
Guardar en AsyncStorage
    ↓
Reiniciar navegación
    ↓
Datos restaurados
```

---

## ✅ APK Generado

**Archivo**: `android/app/build/outputs/apk/release/app-release.apk`  
**Tamaño**: 54.21 MB  
**Versión**: 1.0.0  
**Build**: Exitoso en 2m 37s

### **Funcionalidades Incluidas**
- ✅ Exportar datos a JSON
- ✅ Compartir vía Share API de Android
- ✅ Importar datos desde JSON pegado
- ✅ Validación de formato
- ✅ Vista previa de datos antes de importar
- ✅ Advertencias claras
- ✅ Reinicio automático post-importación
- ✅ 365 versículos bíblicos
- ✅ UI escalada para tablet S7 FE
- ✅ Sistema completo de gestión de pedidos

---

## 🚀 Instalación en Dispositivo

```powershell
# Conecta tu tablet vía USB
# Habilita "Depuración USB" en la tablet
# Ejecuta:
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

O copia el archivo APK a la tablet y ábrelo desde el explorador de archivos.

---

## 📱 Casos de Uso

### **Migrar a Nueva Tablet**
1. Exporta datos en la tablet antigua
2. Envía el archivo JSON por email
3. Instala la app en la nueva tablet
4. Abre el email y copia el JSON
5. Importa en la nueva tablet

### **Actualizar la App**
1. Exporta datos antes de actualizar
2. Actualiza la app
3. Importa datos si es necesario

### **Respaldo de Seguridad Semanal**
1. Cada semana exporta datos
2. Guarda en Google Drive
3. En caso de problema, restaura desde Drive

### **Cambio de Dispositivo**
1. Exporta desde tablet actual
2. Guarda JSON en la nube
3. Descarga en nuevo dispositivo
4. Importa datos

---

## 🎉 Resumen

La funcionalidad de importar datos está **completamente implementada y funcional**. Los usuarios pueden:

1. ✅ Exportar todos sus datos en formato JSON
2. ✅ Guardar el respaldo donde prefieran (email, Drive, WhatsApp)
3. ✅ Importar datos pegando el contenido JSON
4. ✅ Ver información del respaldo antes de confirmar
5. ✅ Restaurar datos completos con un solo clic

**Sin dependencias externas problemáticas** - solo usa:
- React Native Share API (incluida)
- AsyncStorage (ya instalada)
- TextInput nativo (incluido)

Simple, funcional y confiable. 🎯
