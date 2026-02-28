# Evidencia de Debugging - Proyecto Barbería

Durante el desarrollo de la aplicación, implementamos un proceso robusto de **Debugging** para asegurar su estabilidad en producción. Aquí detallamos los métodos y evidencias utilizados:

## 1. Identificación de Errores con `console.log` / `console.error`
En toda la lógica de servicios asíncronos (como el consumo de la Weather API en `src/services/weatherService.js`), utilizamos salidas a consola para trazar los problemas.

**Evidencia:**
Cuando la clave de WeatherAPI no está configurada, el servidor loguea este error y en lugar de crashear, devuelve `null` de forma segura.
```javascript
// backend/src/services/weatherService.js
if (!apiKey) {
    console.warn('Weather API Key missing. Skipping forecast.');
    return null;
}
```

## 2. Herramientas del Navegador (Network / Console)
Para el **Frontend (Next.js)**, utilizamos extensamente el panel *Network (Red)* de Chrome DevTools para monitorear las peticiones a nuestro backend:
- Inspeccionamos el *Preflight (OPTIONS)* provocado por **CORS**. Configuramos el middleware `cors()` en Express para permitir la comunicación correcta.
- Verificamos el envío correcto del `Authorization: Bearer <token>` desde nuestro `api.js` Axios Interceptor en cada recarga del frontend.

## 3. Pruebas Funcionales y Validaciones (Postman / Jest)
Los errores detectados mediante debugging en el flujo de validación del token nos llevaron a construir pruebas unitarias con Jest (`backend/tests/authMiddleware.test.js`):
- Confirmar el código `401 Unauthorized` si el header no empieza con "Bearer ".
- Confirmar el `403 Forbidden` en las rutas protegidas por roles.

## 4. Manejo de Errores Centralizado
Implementamos `errorHandler.js` en Express como último middleware. Esto garantiza que cualquier error no capturado formalmente pase por el `next(err)` o los bloques `catch` de Express y termine siendo un `json` limpio con el status `500` e imprimible en los logs de producción de Render. Sumamos a esto una trampa `404` para peticiones sin ruta ("Route not found").
