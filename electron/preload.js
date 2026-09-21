const {
  contextBridge,
  ipcRenderer
} = require('electron');

/**
 * API segura que Angular podrá utilizar.
 *
 * Angular NO tendrá acceso completo a Node.
 * Solamente exponemos las operaciones
 * que necesitamos.
 */
contextBridge.exposeInMainWorld(
  'electronAPI',
  {
    /**
     * Consultar grupo SISBÉN
     */
    consultarGrupoSisben:
      (pNumDoc, pTipDoc) => {
        return ipcRenderer.invoke(
          'dnp:consultar-grupo-sisben',
          {
            pNumDoc,
            pTipDoc
          }
        );
      },

    /**
     * Obtener datos RUI
     */
    obtenerDatosRUI:
      (pNumDoc, pTipDoc) => {
        return ipcRenderer.invoke(
          'dnp:obtener-datos-rui',
          {
            pNumDoc,
            pTipDoc
          }
        );
      }
  }
);