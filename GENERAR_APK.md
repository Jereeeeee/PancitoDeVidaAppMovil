# 📦 Guía Completa para Generar APK

Esta guía te ayudará a generar el archivo APK de la aplicación Pancito de Vida para instalarlo en dispositivos Android.

## Prerrequisitos

Antes de generar el APK, asegúrate de tener:

1. ✅ Android Studio instalado
2. ✅ Android SDK configurado
3. ✅ Java JDK 11 o superior instalado
4. ✅ Variables de entorno configuradas:
   - `ANDROID_HOME` apuntando a tu SDK de Android
   - `JAVA_HOME` apuntando a tu JDK

## Verificar Configuración

```bash
# Verificar Java
java -version

# Verificar variables de entorno (Windows PowerShell)
$env:ANDROID_HOME
$env:JAVA_HOME
```

## Opción 1: APK de Debug (Recomendado para Pruebas)

El APK de debug es más rápido de generar y no requiere configuración adicional de firma.

```bash
# Desde la raíz del proyecto
cd android

# Limpiar builds anteriores (opcional pero recomendado)
gradlew clean

# Generar APK de debug
gradlew assembleDebug

# Volver al directorio raíz
cd ..
```

**Ubicación del APK:** `android/app/build/outputs/apk/debug/app-debug.apk`

## Opción 2: APK de Release (Para Distribución)

El APK de release está optimizado para producción pero usa una firma de debug por defecto.

```bash
# Desde la raíz del proyecto
cd android

# Limpiar builds anteriores
gradlew clean

# Generar APK de release
gradlew assembleRelease

# Volver al directorio raíz
cd ..
```

**Ubicación del APK:** `android/app/build/outputs/apk/release/app-release.apk`

## Opción 3: APK de Release con Firma Personalizada (Producción Real)

Para distribución en producción, deberías crear tu propia keystore.

### 1. Crear Keystore

```bash
cd android/app

keytool -genkeypair -v -storetype PKCS12 -keystore pancito-release-key.keystore -alias pancito-key-alias -keyalg RSA -keysize 2048 -validity 10000

cd ../..
```

Guarda la información que ingreses (contraseñas, etc.) en un lugar seguro.

### 2. Configurar Gradle

Edita `android/gradle.properties` y agrega:

```properties
PANCITO_UPLOAD_STORE_FILE=pancito-release-key.keystore
PANCITO_UPLOAD_KEY_ALIAS=pancito-key-alias
PANCITO_UPLOAD_STORE_PASSWORD=TU_CONTRASEÑA_STORE
PANCITO_UPLOAD_KEY_PASSWORD=TU_CONTRASEÑA_KEY
```

### 3. Actualizar build.gradle

Edita `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('PANCITO_UPLOAD_STORE_FILE')) {
                storeFile file(PANCITO_UPLOAD_STORE_FILE)
                storePassword PANCITO_UPLOAD_STORE_PASSWORD
                keyAlias PANCITO_UPLOAD_KEY_ALIAS
                keyPassword PANCITO_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

### 4. Generar APK Firmado

```bash
cd android
gradlew assembleRelease
cd ..
```

## Instalar APK en Dispositivo

### Método 1: Via USB (ADB)

```bash
# Conecta tu dispositivo por USB con depuración USB habilitada

# Para APK de debug
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Para APK de release
adb install android/app/build/outputs/apk/release/app-release.apk
```

### Método 2: Transferencia Manual

1. Copia el APK a tu dispositivo (USB, email, Drive, etc.)
2. En el dispositivo, ve a Ajustes > Seguridad
3. Habilita "Fuentes desconocidas" o "Instalar apps desconocidas"
4. Usa un explorador de archivos para encontrar el APK
5. Toca el APK y confirma la instalación

### Método 3: Google Drive / Email

1. Sube el APK a Google Drive o envíalo por email
2. Abre el enlace en el dispositivo Android
3. Descarga y toca para instalar

## Solución de Problemas

### Error: "ANDROID_HOME not set"

**Windows PowerShell:**
```powershell
$env:ANDROID_HOME = "C:\Users\TU_USUARIO\AppData\Local\Android\Sdk"
```

Para hacerlo permanente, agrégalo a las variables de entorno del sistema.

### Error: "JDK not found"

Verifica la instalación de Java y configura JAVA_HOME:

```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-11"
```

### Error al compilar: "Build failed"

```bash
# Limpiar todo
cd android
gradlew clean
cd ..

# Eliminar node_modules y reinstalar
rm -rf node_modules
npm install

# Intentar de nuevo
cd android
gradlew assembleDebug
```

### APK muy grande

El APK de debug suele ser más grande. Para reducir el tamaño:
- Usa `assembleRelease` en lugar de `assembleDebug`
- Habilita ProGuard (minifyEnabled true)
- Considera generar APKs separados por arquitectura

### Error: "Installed failed: INSTALL_FAILED_UPDATE_INCOMPATIBLE"

Desinstala la versión anterior de la app primero:

```bash
adb uninstall com.pancitodevidaapp
```

## Verificar el APK

### Ver información del APK

```bash
# Windows
cd android/app/build/outputs/apk/release
aapt dump badging app-release.apk
```

### Tamaño del APK

- Debug: ~30-50 MB (aproximado)
- Release sin optimizar: ~25-40 MB
- Release optimizado: ~15-30 MB

## Distribución

### Para Testing Interno
- Comparte el APK de debug directamente
- No requiere configuración especial

### Para Usuarios Finales
- Usa APK de release firmado
- Considera subir a Google Play Store para actualizaciones automáticas

### Para Google Play Store
1. Genera un APK o AAB (Android App Bundle) firmado
2. Crea una cuenta de desarrollador de Google Play
3. Sube el APK/AAB siguiendo el proceso de Google Play Console

## Comandos Útiles

```bash
# Ver dispositivos conectados
adb devices

# Ver logs de la app
adb logcat | grep ReactNative

# Desinstalar app
adb uninstall com.pancitodevidaapp

# Limpiar build
cd android && gradlew clean && cd ..

# Build completo
cd android && gradlew clean assembleRelease && cd ..
```

## Checklist Final

Antes de distribuir tu APK:

- [ ] Versión actualizada en `android/app/build.gradle` (versionCode y versionName)
- [ ] App probada en modo release
- [ ] Iconos personalizados configurados
- [ ] Nombre de app correcto en strings.xml
- [ ] APK firmado (para producción)
- [ ] APK probado en al menos un dispositivo real
- [ ] Tamaño del APK es razonable
- [ ] No hay errores en los logs

## Notas Importantes

⚠️ **Seguridad:**
- NUNCA compartas tu keystore de producción
- NUNCA subas tu keystore a control de versiones
- Guarda las contraseñas de tu keystore en un lugar seguro

📝 **Versioning:**
- Incrementa `versionCode` para cada nuevo APK
- Usa semantic versioning para `versionName` (1.0.0, 1.0.1, etc.)

🔄 **Actualizaciones:**
- Para actualizar la app, los usuarios deben desinstalar y reinstalar manualmente
- O considera publicar en Play Store para actualizaciones automáticas

---

¡Listo! Ahora puedes generar y distribuir tu APK de Pancito de Vida. 🥖
