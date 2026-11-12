// node scripts/verificar-cuentas-orden.cjs '/ruta/Libros Oficiales Orden 09302025.txt'
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ts = require('typescript');
const assert = require('assert/strict');
const XLSX = require('xlsx-js-style');
const raiz = path.resolve(__dirname, '../src/app/component/prueba');
function cargar(nombre) {
  const contexto = { exports: {}, TextDecoder, require: ruta => ruta.startsWith('.') ? cargar(path.relative(raiz, path.resolve(raiz, path.dirname(nombre), ruta + '.ts'))) : require(ruta) };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(raiz, nombre), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, contexto);
  return contexto.exports;
}
const orden = cargar('cuentas-orden.ts');
const fuente = cargar('fuente-balance.ts');
const notas = cargar('notas-financieras.ts');
const institucional = cargar('estados-institucionales.ts');
const { leerBalanceOficialTxt } = cargar('importar-balance.ts');
const archivo = (name, bytes) => ({ name, arrayBuffer: async () => Uint8Array.from(bytes).buffer });
const cerca = (a, b, mensaje) => assert(Math.abs(a - b) < 0.005, `${mensaje}: ${a} != ${b}`);
const tabla = (libro, hoja) => XLSX.utils.sheet_to_json(libro.Sheets[hoja], { header: 1, defval: null });
let exportado;
const entorno = { ...orden, ...fuente, ...notas, ...institucional, XLSX, XLSXStyle: { ...XLSX, writeFile: libro => exportado = libro }, Swal: { fire: async () => ({ isConfirmed: true }) } };
const rutaComponente = path.join(raiz, 'prueba.component.ts');
const source = ts.createSourceFile(rutaComponente, fs.readFileSync(rutaComponente, 'utf8'), ts.ScriptTarget.Latest, true);
const clase = source.statements.find(ts.isClassDeclaration);
const metodos = clase.members.filter(n => ts.isMethodDeclaration(n) || ts.isGetAccessorDeclaration(n)).map(n => n.getText(source)).join('\n');
vm.runInNewContext(ts.transpile(`class Componente {${metodos}}; globalThis.Componente = Componente;`, { target: ts.ScriptTarget.ES2022 }), entorno);
function componente(filas) {
  const c = new entorno.Componente();
  Object.assign(c, { tablaInicialGuardada: filas, datosTabla: filas, asegurarTablaInicial() {}, limpiarSeleccionTabla() {}, mostrarInformacionOriginal() { this.datosTabla = this.tablaInicialGuardada; }, guardarFuenteOriginal(f) { this.tablaInicialGuardada = f; } });
  return c;
}
(async () => {
  assert(process.argv[2], 'Indica la ruta al ejemplo oficial de septiembre de 2025.');
  const bytes = fs.readFileSync(process.argv[2]);
  const carga = await orden.leerArchivoCuentasOrden(archivo(path.basename(process.argv[2]), bytes));
  assert.equal(carga.cantidad, 41);
  assert.equal(orden.hayCuentasOrden([{ codigo: '8', nuevoSaldo: 0 }, { codigo: '8.1', nuevoSaldo: 0 }], '8'), false, 'El catálogo vacío no acredita una carga');
  assert.equal(carga.periodo.mes, 9); assert.equal(carga.periodo.anio, 2025);
  const leer = fuente.crearLectorBalance(carga.cuentas);
  cerca(leer('8.1', 'nuevoSaldo'), 101065217070.27, 'Activos contingentes');
  cerca(leer('8.3', 'nuevoSaldo'), 3146068364.04, 'Deudoras de control');
  cerca(leer('8.9', 'nuevoSaldo'), -104211285434.31, 'Por contra CR conserva signo');
  cerca(leer('9.1', 'nuevoSaldo'), 24315571696.64, 'Pasivos contingentes');
  cerca(leer('9.3', 'nuevoSaldo'), 13102821910.38, 'Acreedoras de control');
  cerca(leer('9.9', 'nuevoSaldo'), -37418393607.02, 'Por contra DB conserva signo');
  cerca(leer('8', 'nuevoSaldo'), 0, 'Control neto clase 8');
  cerca(leer('9', 'nuevoSaldo'), 0, 'Control neto clase 9');
  assert(carga.cuentas.some(c => /SOLUCIÓN/.test(c.nombre)), 'Decodificar texto Windows-1252');
  const financieras = [{ codigo: '1.1.05.01.01', nombre: 'CAJA', nuevoSaldo: 100, saldoAnterior: 100, debito: 0, credito: 0, tipoDeCuenta: 60, compartidoTipo: 40 }, { codigo: '3.1.05.01.01', nuevoSaldo: 100 }];
  const inicial = JSON.stringify(financieras);
  const integrada = orden.integrarCuentasOrden(financieras, carga.cuentas);
  assert.equal(JSON.stringify(financieras), inicial, 'No mutar el balance al preparar');
  assert.equal(JSON.stringify(orden.integrarCuentasOrden(integrada, carga.cuentas)), JSON.stringify(integrada), 'Recargar no duplica saldos');
  const normalizada = fuente.normalizarFuenteBalance(integrada);
  assert(normalizada.filter(c => /^[89]/.test(c.codigo)).every(c => c.tipoDeCuenta === 0 && c.compartidoTipo === 0));
  const c = componente(integrada), sinOrden = componente(financieras);
  const situacion = c.construirEstadoSituacionFinanciera();
  const anterior = sinOrden.construirEstadoSituacionFinanciera();
  for (const f of anterior.filter(f => !/^[89]|^NETO-/.test(f.codigo))) cerca(situacion.find(x => x.codigo === f.codigo && x.seccion === f.seccion).nuevoSaldo, f.nuevoSaldo, `Conservar ${f.codigo}`);
  c.exportarEstadoSituacionFinanciera();
  assert.equal(exportado.SheetNames.length, 35, '4 hojas principales + 30 notas + índice');
  const n25 = tabla(exportado, 'Nota 25 AyP Contingentes'), n26 = tabla(exportado, 'Nota 26 Ctas de Orden');
  cerca(n25.find(f => f[0] === '81')[4], 101065217070.27, 'Nota 25: activos contingentes');
  cerca(n25.find(f => f[0] === '91')[4], 24315571696.64, 'Nota 25: pasivos contingentes');
  cerca(n26.find(f => f[0] === '8')[4], 104211285434.31, 'Nota 26: importe deudor sin contrapartida');
  cerca(n26.find(f => f[0] === '9')[4], 37418393607.02, 'Nota 26: importe acreedor sin contrapartida');
  assert(n26.filter(f => /^[89]/.test(String(f[0]))).every(f => f[2] == null && f[3] == null), 'Sin clasificación por plazo');
  notas.validarNotasFinancieras(exportado, situacion);
  // Volver a leer el XLSX real, sin depender de los objetos en memoria.
  const reabierto = XLSX.read(XLSX.write(exportado, { type: 'buffer', bookType: 'xlsx' }), { type: 'buffer' });
  cerca(tabla(reabierto, 'Nota 26 Ctas de Orden').find(f => f[0] === '89')[4], -104211285434.31, 'XLSX conserva centavos y signo');
  const comparativo = XLSX.utils.book_new();
  notas.agregarNotasFinancieras(comparativo, integrada, 'Septiembre 2026', situacion, { cuentas: integrada, completa: true }, 'Septiembre 2025');
  for (const nombre of ['Nota 25 AyP Contingentes', 'Nota 26 Ctas de Orden']) {
    for (const f of tabla(comparativo, nombre).filter(f => typeof f[4] === 'number' && typeof f[7] === 'number')) cerca(f[8], 0, 'Comparar mismo archivo da variación cero');
  }
  const recuperada = notas.leerFuenteNotasBase(comparativo, 2025);
  const recuperado = fuente.crearLectorBalance(recuperada.cuentas);
  cerca(recuperado('8', 'nuevoSaldo'), 0, 'Recuperar neto, no importe bruto, desde notas anteriores');
  cerca(recuperado('9.9', 'nuevoSaldo'), -37418393607.02, 'Recuperar cuenta por contra histórica');
  const incompleto = XLSX.utils.book_new();
  notas.agregarNotasFinancieras(incompleto, financieras, '2026', anterior, { cuentas: integrada, completa: true }, '2025');
  const faltante = tabla(incompleto, 'Nota 26 Ctas de Orden').find(f => f[0] === '8');
  assert.equal(faltante[4], null); assert.equal(faltante[8], null); cerca(faltante[7], 104211285434.31, 'Dato base disponible sin inventar actual');
  // Archivo Excel preparado con las mismas columnas del importador existente.
  const texto = new TextDecoder('windows-1252').decode(bytes);
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(leerBalanceOficialTxt(texto)), 'Orden');
  const desdeExcel = await orden.leerArchivoCuentasOrden(archivo('orden.xlsx', XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })));
  cerca(fuente.crearLectorBalance(desdeExcel.cuentas)('8.9', 'nuevoSaldo'), -104211285434.31, 'Importar Excel');
  const linea = texto.split(/\r?\n/).find(l => /81200401/.test(l));
  await assert.rejects(orden.leerArchivoCuentasOrden(archivo('orden.txt', Buffer.from(texto + '\n' + linea))), /repetida/);
  await assert.rejects(orden.leerArchivoCuentasOrden(archivo('orden.txt', Buffer.from(texto.replace('81200401', '71200401')))), /clases 8 y 9/);
  await assert.rejects(orden.leerArchivoCuentasOrden(archivo('orden.txt', Buffer.from(texto.replace('8,849,214,951.00 DB', '8,849,214,952.00 DB')))), /no coinciden/);
  // Cancelar la carga actual conserva todo; confirmar incorpora el archivo.
  entorno.Swal.fire = async () => ({ isConfirmed: false });
  const evento = { target: { files: [archivo('orden.txt', bytes)], value: 'seleccionado' } };
  await sinOrden.cargarCuentasOrden(evento);
  assert.equal(JSON.stringify(sinOrden.tablaInicialGuardada), inicial);
  entorno.Swal.fire = async () => ({ isConfirmed: true });
  await sinOrden.cargarCuentasOrden(evento);
  assert.equal(sinOrden.tablaInicialGuardada.length, integrada.length);
  assert.equal(evento.target.value, '');
  console.log('OK: 41 cuentas oficiales, signos DB/CR, controles netos, carga idempotente TXT/Excel, notas 25/26, 35 hojas, comparativo, datos ausentes y cancelación.');
})().catch(error => { console.error(error); process.exitCode = 1; });
