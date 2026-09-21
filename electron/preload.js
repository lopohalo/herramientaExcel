const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {

  consultarGrupoSisben: (pNumDoc, pTipDoc) => {
    return ipcRenderer.invoke(
      "dnp:consultar-grupo-sisben",
      {
        pNumDoc,
        pTipDoc
      }
    );
  },

  obtenerDatosRui: (pNumDoc, pTipDoc) => {
    return ipcRenderer.invoke(
      "dnp:obtener-datos-rui",
      {
        pNumDoc,
        pTipDoc
      }
    );
  }

});