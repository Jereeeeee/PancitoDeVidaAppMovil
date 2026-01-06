# ⚡ Comandos Rápidos - Pancito de Vida

## 🚀 Generar APK

### Opción 1: Con el script (Recomendado)
```powershell
.\generar-apk.ps1
```

### Opción 2: Con NPM
```powershell
npm run build:android
```

### Opción 3: Manual
```powershell
cd android
.\gradlew assembleRelease
cd ..
```

---

## 📱 Instalar en Dispositivo

### Via ADB (USB)
```powershell
npm run install:device
```

O manualmente:
```powershell
adb install android\app\build\outputs\apk\release\app-release.apk
```

---

## 🔨 Desarrollo

### Iniciar Metro Bundler
```powershell
npm start
```

### Ejecutar en Android (Modo Dev)
```powershell
npm run android
```

### Ejecutar ambos (2 terminales)
**Terminal 1:**
```powershell
npm start
```

**Terminal 2:**
```powershell
npm run android
```

---

## 🧹 Limpieza

### Limpiar build de Android
```powershell
npm run clean:android
```

### Limpiar todo y reinstalar
```powershell
rm -rf node_modules
npm install
npm run clean:android
```

### Limpiar caché de Metro
```powershell
npm start -- --reset-cache
```

---

## 🛠️ Build Variants

### APK de Debug (Pruebas)
```powershell
npm run build:android:debug
```
📍 Ubicación: `android\app\build\outputs\apk\debug\app-debug.apk`

### APK de Release (Producción)
```powershell
npm run build:android
```
📍 Ubicación: `android\app\build\outputs\apk\release\app-release.apk`

---

## 🔍 Utilidades

### Ver dispositivos conectados
```powershell
adb devices
```

### Ver logs de la app
```powershell
adb logcat | Select-String "ReactNative"
```

### Desinstalar app del dispositivo
```powershell
adb uninstall com.pancitodevidaapp
```

### Reinstalar app
```powershell
adb uninstall com.pancitodevidaapp
npm run install:device
```

---

## 📊 Información del Proyecto

### Ver versión de Node
```powershell
node --version
```

### Ver versión de npm
```powershell
npm --version
```

### Ver dependencias instaladas
```powershell
npm list --depth=0
```

### Verificar errores de lint
```powershell
npm run lint
```

---

## 🎯 Flujo Completo

### Primera vez (Setup)
```powershell
# 1. Instalar dependencias
npm install

# 2. Probar en modo desarrollo
npm start          # Terminal 1
npm run android    # Terminal 2

# 3. Generar APK
npm run build:android

# 4. Instalar en dispositivo
npm run install:device
```

### Desarrollo diario
```powershell
# Abrir 2 terminales

# Terminal 1
npm start

# Terminal 2
npm run android
```

### Generar nueva versión
```powershell
# 1. Hacer cambios en el código

# 2. Limpiar builds anteriores
npm run clean:android

# 3. Generar nuevo APK
npm run build:android

# 4. Instalar en dispositivo
npm run install:device
```

---

## 🐛 Solución Rápida de Problemas

### Error: Metro ya está corriendo
```powershell
# Cerrar todos los procesos de Node
taskkill /F /IM node.exe

# Reiniciar Metro
npm start -- --reset-cache
```

### Error: Gradle no encuentra SDK
```powershell
# Verificar variable de entorno
$env:ANDROID_HOME

# Si no está configurada:
$env:ANDROID_HOME = "C:\Users\TU_USUARIO\AppData\Local\Android\Sdk"
```

### Error al compilar Android
```powershell
# Limpieza completa
npm run clean:android
rm -rf node_modules
npm install

# Intentar de nuevo
npm run build:android
```

### APK no instala en dispositivo
```powershell
# Desinstalar versión anterior
adb uninstall com.pancitodevidaapp

# Instalar nueva
npm run install:device
```

---

## 💡 Tips

1. **Siempre limpia antes de generar APK final:**
   ```powershell
   npm run clean:android
   npm run build:android
   ```

2. **Para desarrollo rápido, usa modo debug:**
   ```powershell
   npm run build:android:debug
   ```

3. **Verifica que el dispositivo esté conectado:**
   ```powershell
   adb devices
   ```

4. **Si hay problemas con Metro:**
   ```powershell
   npm start -- --reset-cache
   ```

---

## ⚡ Atajos de Teclado (En el emulador/dispositivo)

- **R R** (doble R) - Recargar app
- **Ctrl + M** (Windows) - Abrir menú de desarrollo
- **Cmd + M** (Mac) - Abrir menú de desarrollo

---

## 📝 Notas Importantes

- 🔴 **APK Debug**: Más rápido de compilar, más grande, para pruebas
- 🟢 **APK Release**: Optimizado, más pequeño, para producción
- 📱 **Instalar**: Requiere habilitar "Fuentes desconocidas" en Android
- 💾 **Datos**: Se guardan automáticamente con AsyncStorage
- 🌐 **Internet**: No requiere conexión, funciona 100% offline

---

¡Guarda este archivo como referencia rápida! 📌
