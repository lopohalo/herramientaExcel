# Despliegue en Cloudflare Pages

1. En Cloudflare, abre **Workers & Pages → Create → Pages → Connect to Git**.
2. Selecciona el repositorio `lopohalo/herramientaExcel` y la rama `master`.
3. Configura:
   - Build command: `npm install --legacy-peer-deps && npm run build`
   - Build output directory: `dist/herramienta-excel`
   - Root directory: `/`
4. Agrega la variable de entorno `NODE_VERSION` con valor `18.20.8`.
5. Despliega.

Cloudflare detecta automáticamente la carpeta `functions/`. La aplicación y el
proxy DNP quedan bajo el mismo dominio `*.pages.dev`, evitando CORS.
