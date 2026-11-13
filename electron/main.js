const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const { createDnpClient } = require("./dnp-client");
// Preserve the transport used by the original working integration.
const dnpClient = createDnpClient((url, options) => fetch(url, options));

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

  mainWindow.webContents.on("preload-error", (_event, _path, error) => {
    console.error("No se cargó el puente Electron para consultar DNP:", error.message);
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

  // Works in the source checkout and in the packaged desktop app.
  const indexPath = path.join(
    app.getAppPath(),
    "dist",
    "herramienta-excel",
    "index.html"
  );

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
ipcMain.handle("dnp:consultar-grupo-sisben", (_event, datos) =>
  dnpClient.consultarGrupoSisben(datos?.pNumDoc, datos?.pTipDoc)
);
ipcMain.handle("dnp:obtener-datos-rui", (_event, datos) =>
  dnpClient.obtenerDatosRui(datos?.pNumDoc, datos?.pTipDoc)
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