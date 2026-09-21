const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const DNP_ORIGIN = "https://ventanillasocial.dnp.gov.co";

let mainWindow;

/**
 * ============================================================
 * CREAR VENTANA
 * ============================================================
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    show: false,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  /**
   * ==========================================================
   * DESARROLLO
   * ==========================================================
   */
  if (process.env.ELECTRON_DEV === "true") {
    console.log("=================================");
    console.log("Electron ejecutándose en DESARROLLO");
    console.log("=================================");

    mainWindow.loadURL("http://localhost:4200")
      .then(() => {
        console.log("Angular DEV cargado correctamente");
      })
      .catch((error) => {
        console.error("Error cargando Angular DEV:", error);
      });

    mainWindow.webContents.openDevTools();

    mainWindow.once("ready-to-show", () => {
      mainWindow.show();
    });

    return;
  }

  /**
   * ==========================================================
   * PRODUCCIÓN
   * ==========================================================
   */

  console.log("=================================");
  console.log("Electron ejecutándose en PRODUCCIÓN");
  console.log("app.isPackaged:", app.isPackaged);
  console.log("__dirname:", __dirname);
  console.log("process.resourcesPath:", process.resourcesPath);
  console.log("=================================");

  let indexPath;

  /**
   * Cuando ejecutamos:
   *
   * npx electron .
   *
   * Angular está en:
   *
   * proyecto/dist/herramienta-excel/index.html
   */
  if (!app.isPackaged) {
    indexPath = path.join(
      __dirname,
      "..",
      "dist",
      "herramienta-excel",
      "index.html"
    );
  }

  /**
   * Cuando ejecutamos el .exe instalado,
   * electron-builder mete la aplicación dentro de app.asar.
   *
   * __dirname ya apunta a:
   *
   * resources/app.asar/electron
   *
   * por lo tanto:
   *
   * ../dist/herramienta-excel/index.html
   *
   * sigue siendo la ruta correcta.
   */
  else {
    indexPath = path.join(
      __dirname,
      "..",
      "dist",
      "herramienta-excel",
      "index.html"
    );
  }

  console.log("Buscando Angular en:");
  console.log(indexPath);
  console.log("¿Existe?:", fs.existsSync(indexPath));
  console.log("=================================");

  /**
   * Capturar errores de carga.
   */
  mainWindow.webContents.on(
    "did-fail-load",
    (
      event,
      errorCode,
      errorDescription,
      validatedURL
    ) => {
      console.error("=================================");
      console.error("ERROR CARGANDO ANGULAR");
      console.error("Código:", errorCode);
      console.error("Descripción:", errorDescription);
      console.error("URL:", validatedURL);
      console.error("=================================");
    }
  );

  mainWindow.webContents.on(
    "did-finish-load",
    () => {
      console.log("Angular terminó de cargar");
    }
  );

  mainWindow.loadFile(indexPath)
    .then(() => {
      console.log("loadFile OK");
    })
    .catch((error) => {
      console.error("ERROR EN loadFile:", error);
    });

  /**
   * Mostrar la ventana únicamente cuando
   * Electron tenga algo listo para mostrar.
   */
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  /**
   * IMPORTANTE:
   *
   * Dejamos DevTools solamente mientras
   * comprobamos el instalador.
   *
   * Después puedes quitar esta línea.
   */
  mainWindow.webContents.openDevTools();
}

/**
 * ============================================================
 * CONSULTAR GRUPO SISBÉN
 * ============================================================
 */
ipcMain.handle(
  "dnp:consultar-grupo-sisben",
  async (event, datos) => {
    try {
      const { pNumDoc, pTipDoc } = datos || {};

      if (!pNumDoc || !pTipDoc) {
        throw new Error(
          "Faltan pNumDoc o pTipDoc"
        );
      }

      const target = new URL(
        "/Home/ConsultarGrupoSisben",
        DNP_ORIGIN
      );

      target.searchParams.set(
        "pNumDoc",
        String(pNumDoc)
      );

      target.searchParams.set(
        "pTipDoc",
        String(pTipDoc)
      );

      console.log(
        "Consultando grupo SISBÉN desde Electron..."
      );

      const response = await fetch(
        target.toString(),
        {
          method: "POST",

          headers: {
            Origin: DNP_ORIGIN,

            Referer: `${DNP_ORIGIN}/`,

            Accept:
              "application/json, text/plain, */*",

            "User-Agent":
              "Mozilla/5.0"
          }
        }
      );

      const body = await response.text();

      console.log(
        "SISBÉN status:",
        response.status
      );

      if (!response.ok) {
        throw new Error(
          `DNP respondió ${response.status}: ${body}`
        );
      }

      try {
        return JSON.parse(body);
      } catch {
        return body;
      }

    } catch (error) {

      console.error(
        "Error consultando SISBÉN:",
        error
      );

      throw new Error(
        error?.message ||
        "No fue posible consultar SISBÉN"
      );
    }
  }
);

/**
 * ============================================================
 * OBTENER DATOS RUI
 * ============================================================
 */
ipcMain.handle(
  "dnp:obtener-datos-rui",
  async (event, datos) => {
    try {
      const { pNumDoc, pTipDoc } =
        datos || {};

      if (!pNumDoc || !pTipDoc) {
        throw new Error(
          "Faltan pNumDoc o pTipDoc"
        );
      }

      console.log(
        "Consultando RUI desde Electron..."
      );

      const formData = new FormData();

      formData.append(
        "pNumDoc",
        String(pNumDoc)
      );

      formData.append(
        "pTipDoc",
        String(pTipDoc)
      );

      const response = await fetch(
        `${DNP_ORIGIN}/Home/ObtenerDatosRUI`,
        {
          method: "POST",

          headers: {
            Origin: DNP_ORIGIN,

            Referer:
              `${DNP_ORIGIN}/`,

            Accept:
              "application/json, text/plain, */*",

            "User-Agent":
              "Mozilla/5.0"
          },

          body: formData
        }
      );

      const body =
        await response.text();

      console.log(
        "RUI status:",
        response.status
      );

      if (!response.ok) {
        throw new Error(
          `DNP respondió ${response.status}: ${body}`
        );
      }

      try {
        return JSON.parse(body);
      } catch {
        return body;
      }

    } catch (error) {

      console.error(
        "Error consultando RUI:",
        error
      );

      throw new Error(
        error?.message ||
        "No fue posible consultar RUI"
      );
    }
  }
);

/**
 * ============================================================
 * ELECTRON
 * ============================================================
 */

app.whenReady().then(() => {

  createWindow();

  app.on(
    "activate",
    () => {

      if (
        BrowserWindow.getAllWindows().length === 0
      ) {
        createWindow();
      }

    }
  );

});

app.on(
  "window-all-closed",
  () => {

    if (
      process.platform !== "darwin"
    ) {
      app.quit();
    }

  }
);