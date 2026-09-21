const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron');

const path = require('path');

const DNP_ORIGIN =
  'https://ventanillasocial.dnp.gov.co';

let mainWindow;

/**
 * Crea la ventana principal.
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,

    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (process.env.ELECTRON_DEV === 'true') {
    console.log('Electron ejecutándose en DESARROLLO');

    mainWindow.loadURL(
      'http://localhost:4200'
    );
  } else {
    console.log('Electron ejecutándose en PRODUCCIÓN');

    mainWindow.loadFile(
      path.join(
        __dirname,
        '../dist/herramienta-excel/index.html'
      )
    );
  }

  // TEMPORAL para encontrar errores
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * ============================================================
 * CONSULTAR GRUPO SISBÉN
 * ============================================================
 */
ipcMain.handle(
  'dnp:consultar-grupo-sisben',

  async (event, datos) => {
    try {
      const {
        pNumDoc,
        pTipDoc
      } = datos || {};

      if (!pNumDoc || !pTipDoc) {
        throw new Error(
          'Faltan pNumDoc o pTipDoc'
        );
      }

      const target = new URL(
        '/Home/ConsultarGrupoSisben',
        DNP_ORIGIN
      );

      target.searchParams.set(
        'pNumDoc',
        String(pNumDoc)
      );

      target.searchParams.set(
        'pTipDoc',
        String(pTipDoc)
      );

      console.log(
        'Consultando grupo SISBÉN desde Electron...'
      );

      const response = await fetch(
        target.toString(),
        {
          method: 'POST',

          headers: {
            Origin: DNP_ORIGIN,

            Referer:
              `${DNP_ORIGIN}/`,

            Accept:
              'application/json, text/plain, */*',

            'User-Agent':
              'Mozilla/5.0'
          }
        }
      );

      const body =
        await response.text();

      console.log(
        'SISBÉN:',
        response.status
      );

      if (!response.ok) {
        throw new Error(
          `DNP respondió ${response.status}: ${body}`
        );
      }

      /**
       * Intentamos devolver JSON.
       *
       * Si DNP devuelve texto, devolvemos
       * directamente el texto.
       */
      try {
        return JSON.parse(body);
      } catch {
        return body;
      }

    } catch (error) {
      console.error(
        'Error consultando SISBÉN:',
        error
      );

      throw new Error(
        error?.message ||
        'No fue posible consultar SISBÉN'
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
  'dnp:obtener-datos-rui',

  async (event, datos) => {
    try {
      const {
        pNumDoc,
        pTipDoc
      } = datos || {};

      if (!pNumDoc || !pTipDoc) {
        throw new Error(
          'Faltan pNumDoc o pTipDoc'
        );
      }

      console.log(
        'Consultando RUI desde Electron...'
      );

      /**
       * Creamos FormData desde Node/Electron.
       *
       * Esto replica lo que actualmente
       * hace Angular.
       */
      const formData =
        new FormData();

      formData.append(
        'pNumDoc',
        String(pNumDoc)
      );

      formData.append(
        'pTipDoc',
        String(pTipDoc)
      );

      const response = await fetch(
        `${DNP_ORIGIN}/Home/ObtenerDatosRUI`,
        {
          method: 'POST',

          headers: {
            Origin: DNP_ORIGIN,

            Referer:
              `${DNP_ORIGIN}/`,

            Accept:
              'application/json, text/plain, */*',

            'User-Agent':
              'Mozilla/5.0'
          },

          body: formData
        }
      );

      const body =
        await response.text();

      console.log(
        'RUI:',
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
        'Error consultando RUI:',
        error
      );

      throw new Error(
        error?.message ||
        'No fue posible consultar RUI'
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

  app.on('activate', () => {
    if (
      BrowserWindow.getAllWindows().length === 0
    ) {
      createWindow();
    }
  });
});

app.on(
  'window-all-closed',
  () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }
);