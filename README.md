# HerramientaExcel

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Aplicación de escritorio

La ruta inicial abre Auditoría de liquidaciones. La calculadora sigue disponible
en `/#/calculadora`. Se mantienen las rutas hash para la carga con Electron.

Usar Node 20.18.1, según la configuración del proyecto.

```sh
npm install
```

Para probar con Angular y Electron en desarrollo:

```sh
npm run electron:dev
```

Para generar un ZIP de escritorio para Windows de 64 bits:

```sh
npm run electron:zip
```

El paquete aparece en `release/`. Extraer todo el ZIP y ejecutar
`HerramientaExcel.exe` dentro de la carpeta extraída, conservando los recursos
y las subcarpetas. No se ejecuta el EXE desde el archivo comprimido.

Para generar un ZIP para macOS, desde un Mac:

```sh
npm run electron:zip:mac
```

Para abrir localmente el build compilado sin empaquetarlo:

```sh
npm run build:desktop
npm run electron
```

Los comandos ZIP compilan Angular con `base-href ./`, necesario para cargar
los archivos del escritorio. Las consultas al DNP requieren conexión a internet.

### Dependencias al empaquetar desde macOS

Electron se empaqueta desde `electron/package.json`, que no tiene dependencias
nativas. Angular, PDF.js y OCR se compilan en los archivos de `dist/`; no se
reconstruye el `canvas` opcional de PDF.js para Windows. El proceso principal y
preload usan únicamente Electron y módulos integrados de Node. Se incluye la
interfaz compilada dentro de `app.asar/dist/herramienta-excel`.
