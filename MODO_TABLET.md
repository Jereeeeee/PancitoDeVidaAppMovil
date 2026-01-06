# 📱 Modo Tablet - Pancito de Vida

## ✨ Ventajas del Modo Tablet

- **Pantalla más grande**: 1280x800 pixels
- **Mejor visualización**: Ideal para gestionar múltiples pedidos
- **Más espacio**: Ver más información sin hacer scroll
- **Experiencia profesional**: Simula una tablet de punto de venta

## 🚀 Cómo Iniciar en Modo Tablet

### Opción 1: Script Automático
```powershell
cd D:\PancitoDeVida
emulator -avd Medium_Phone_API_36.1 -skin 1280x800 -gpu host
```

Espera 40 segundos y luego:
```powershell
npx react-native run-android
```

### Opción 2: Comando Completo
```powershell
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:Path = "$env:Path;$env:ANDROID_HOME\emulator"
emulator -avd Medium_Phone_API_36.1 -skin 1280x800 -gpu host
```

## 📊 Especificaciones Tablet

- **Resolución**: 1280 x 800 pixels
- **Orientación**: Horizontal (landscape)
- **GPU**: Aceleración por hardware
- **Memoria**: 4GB RAM
- **Núcleos**: 2 cores

## 🎯 Próximos Pasos

1. **Espera** a que veas el escritorio de Android en la tablet
2. **Ejecuta** la app con `npx react-native run-android`
3. **Disfruta** de Pancito de Vida en pantalla grande

## 💡 Consejos

- El emulador tablet tarda ~40 segundos en iniciar
- Puedes rotar la tablet con Ctrl + F11 / Ctrl + F12
- Para ver en vertical, usa el comando sin `-skin`
- El modo tablet es ideal para usar con mouse

## 🔄 Volver a Modo Teléfono

Si quieres volver al modo teléfono normal:
```powershell
emulator -avd Medium_Phone_API_36.1
```

---

**¡Tu app ahora se ejecuta como una tablet profesional!** 🎉
