// Ejecutar: node scripts/verificar-reportes-contables.cjs [reporte.txt] [balance.xlsx]
// Prueba los métodos reales y vuelve a leer los XLSX generados, sin abrir Angular.
const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const vm = require('vm');
const assert = require('assert/strict');
const XLSX = require('xlsx-js-style');
const base = path.resolve(__dirname, '../src/app/component/prueba');
function cargar(nombre) {
  const contexto = { exports: {}, require: ruta => ruta.startsWith('.') ? cargar(path.relative(base, path.resolve(base, path.dirname(nombre), ruta + '.ts'))) : require(ruta) };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(base, nombre), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, contexto);
  return contexto.exports;
}
const { crearLectorBalance, normalizarFuenteBalance } = cargar('fuente-balance.ts');
const { crearEstadosInstitucionales } = cargar('estados-institucionales.ts');
const { agregarNotasFinancieras, leerFuenteNotasBase, validarNotasFinancieras } = cargar('notas-financieras.ts');
const { prepararDetalleHistorico, agruparDetalleHistorico } = cargar('balance-historico.ts');
const { interpretarImportePegado } = cargar('modall/importe-pegado.ts');
const { leerBalanceOficialTxt, limpiarFilasBalance } = cargar('importar-balance.ts');
const { leerSaldosCiclo, revisarSaldosCiclo } = cargar('saldos-ciclo.ts');
const source = ts.createSourceFile('component.ts', fs.readFileSync(path.join(base, 'prueba.component.ts'), 'utf8'), ts.ScriptTarget.Latest, true);
const clase = source.statements.find(ts.isClassDeclaration);
let exportado;
const contexto = {
  XLSX, leerBalanceOficialTxt, limpiarFilasBalance, TextDecoder, prepararDetalleHistorico, agruparDetalleHistorico, interpretarImportePegado, agregarNotasFinancieras, leerFuenteNotasBase, validarNotasFinancieras, crearEstadosInstitucionales, normalizarFuenteBalance, crearLectorBalance, leerSaldosCiclo, revisarSaldosCiclo,
  XLSXStyle: { ...XLSX, writeFile: libro => { exportado = libro; } },
  Swal: { fire() {} },
};
const metodos = clase.members.filter(n => ts.isMethodDeclaration(n) || ts.isGetAccessorDeclaration(n)).map(n => n.getText(source)).join('\n');
vm.runInNewContext(ts.transpile(`class Componente {${metodos}};globalThis.Componente=Componente;`, { target: ts.ScriptTarget.ES2022 }), contexto);
function propiedad(nombre) {
  const nodo = clase.members.find(n => n.name?.getText(source) === nombre);
  return vm.runInNewContext('(' + nodo.initializer.getText(source) + ')');
}
function componente(fuente) {
  const c = new contexto.Componente();
  Object.assign(c, {
    tablaInicialGuardada: fuente, datosTabla: fuente, datosReporteActual: [],
    modeloDatosReporte: propiedad('modeloDatosReporte'), reporteChipGuardado: [],
    asegurarTablaInicial() {}, consultarTabla() {}, mostrarReporteGenerado() {},
    prepararVistaReporte(tipo) { this.reporteActivo = tipo; this.datosReporteActual = this.datosTabla; },
  });
  return c;
}
function cerca(actual, esperado, mensaje) {
  assert(Math.abs(actual - esperado) < 0.05, `${mensaje}: ${actual} != ${esperado}`);
}
function releerHoja(nombre) {
  const bytes = XLSX.write(exportado, { bookType: 'xlsx', type: 'buffer' });
  const libro = XLSX.read(bytes, { type: 'buffer' });
  return XLSX.utils.sheet_to_json(libro.Sheets[nombre], { header: 1 });
}
function validarNotasExportadas(libro, situacion) {
  let verificadas = 0;
  for (const nombre of libro.SheetNames.filter(n => /^Nota /.test(n))) {
    const filas = XLSX.utils.sheet_to_json(libro.Sheets[nombre], { header: 1 });
    filas.forEach((fila, indice) => {
      if (/^[12]\d+$/.test(String(fila[0])) && fila.slice(2, 5).length === 3 && fila.slice(2, 5).every(v => typeof v === 'number')) {
        cerca(fila[2] + fila[3], fila[4], `${nombre} fila ${indice + 1}: corriente + no corriente = saldo`);
        verificadas++;
      }
      if (/^[3-7]\d+$/.test(String(fila[0]))) assert(fila[2] == null && fila[3] == null, 'No inventar clasificación corriente en patrimonio/resultados');
    });
  }
  for (const [nombre, codigo, cuenta] of [['Nota 13 P Inversión', '1.9.51', '19'], ['Nota 14 Intangibles', '1.9.70', '19'], ['Nota 16 Otros Derechos', '1.9', '19']]) {
    const nota = XLSX.utils.sheet_to_json(libro.Sheets[nombre], { header: 1 }).find(f => f[0] === cuenta);
    const estado = situacion.find(f => f.codigo === codigo && f.seccion === 'Activo no corriente');
    cerca(nota[3], estado.nuevoSaldo, `${nombre} concilia con el estado`);
  }
  for (const nombre of ['Nota 6 Inversiones', 'Nota 7 C x C']) {
    const filas = XLSX.utils.sheet_to_json(libro.Sheets[nombre], { header: 1 });
    const raiz = filas.find(f => f[0] === (nombre.startsWith('Nota 6') ? '12' : '13'));
    const grupos = filas.filter(f => /^\d{3}$/.test(String(f[0])) || f[0] === 'SIN-AGRUPACION');
    for (const col of [2, 3, 4]) cerca(grupos.reduce((s, f) => s + f[col], 0), raiz[col], `${nombre}: agrupaciones completas sin repetir cuentas`);
  }
  return verificadas;
}
function verificar(fuente, esperado, etiqueta) {
  const c = componente(fuente);
  const situacion = c.construirEstadoSituacionFinanciera();
  const porCodigo = codigo => situacion.find(fila => fila.codigo === codigo).nuevoSaldo;
  for (const [codigo, valor] of Object.entries(esperado)) cerca(porCodigo(codigo), valor, `${etiqueta} ${codigo}`);
  cerca(porCodigo('TOTAL-PP'), porCodigo('TOTAL-P') + porCodigo('TOTAL-PAT-R'), 'Pasivo y patrimonio');
  cerca(porCodigo('DIFERENCIA'), porCodigo('TOTAL-A') - porCodigo('TOTAL-PP'), 'Diferencia real');
  for (const [seccion, codigo] of [['Activo corriente', 'TOTAL-AC'], ['Activo no corriente', 'TOTAL-ANC'], ['Pasivo corriente', 'TOTAL-PC'], ['Pasivo no corriente', 'TOTAL-PNC'], ['Patrimonio', 'TOTAL-PAT']]) {
    cerca(situacion.filter(f => f.seccion === seccion && !f.esTotal).reduce((n, f) => n + f.nuevoSaldo, 0), porCodigo(codigo), `${etiqueta} suma ${seccion}`);
  }
  c.exportarEstadoSituacionFinanciera();
  assert.deepEqual(Array.from(exportado.SheetNames.slice(0, 4)), ['Balance institucional', 'Resultados institucionales', 'Situacion financiera', 'Estado de resultados']);
  assert.equal(exportado.SheetNames.filter(n => /^Nota /.test(n)).length, 28);
  assert(!exportado.SheetNames.some(n => /^Nota (25|26)\b/.test(n)));
  assert(exportado.SheetNames.includes('Indice de notas'));
  validarNotasExportadas(exportado, situacion);

  const nota5 = releerHoja('Nota 5 EF y Eq');
  const efectivo = nota5.find(f => f[0] === '11');
  cerca(efectivo[4], crearLectorBalance(fuente)('1.1', 'nuevoSaldo'), 'Nota 5: efectivo desde la fuente');
  assert(nota5.some(f => String(f.at(-1)).includes('Pendiente')), 'Información complementaria explícitamente pendiente');
  const institucional = releerHoja('Balance institucional');
  const totalInstitucional = nombre => institucional.find(f => f[1] === nombre)?.[3];
  for (const [nombre, codigo] of [['Total Activos', 'TOTAL-A'], ['Total Pasivo ', 'TOTAL-P'], ['Total Patrimonio', 'TOTAL-PAT'], ['Patrimonio + Resultado del periodo', 'TOTAL-PAT-R'], ['Total Pasivo + Patrimonio + Resultado del periodo', 'TOTAL-PP']]) {
    cerca(totalInstitucional(nombre), porCodigo(codigo), `${etiqueta} primera hoja ${nombre}`);
  }
  const institucionalResultados = releerHoja('Resultados institucionales');
  for (const [nombre, codigo] of [['TOTAL INGRESOS', 'TOTAL-I'], ['TOTAL COSTOS Y GASTOS', 'TOTAL-CG'], ['RESULTADO DEL EJERCICIO', 'RESULTADO']]) {
    cerca(institucionalResultados.find(f => f[1] === nombre)[3], c.construirEstadoResultadosFinancieros().find(f => f.codigo === codigo).valor, `${etiqueta} segunda hoja ${nombre}`);
  }
  for (const nombre of exportado.SheetNames.slice(0, 2)) {
    assert.equal(XLSX.utils.decode_range(exportado.Sheets[nombre]['!ref']).e.c, 3);
    const textos = Object.values(exportado.Sheets[nombre]).filter(v => v && v.t === 's').map(v => v.v).join(' ');
    assert(!/2025|2024|VARIACI[ÓO]N|Junio 30 2016/.test(textos), 'Sin comparativo ni fechas del ejemplo');
    assert(exportado.Sheets[nombre]['!merges'].length >= 4);
  }
  const filas = releerHoja('Situacion financiera').slice(6);
  assert.equal(filas.length, situacion.length);
  situacion.forEach((fila, i) => {
    assert.equal(filas[i][1], fila.codigo);
    for (const [columna, campo] of [[3, 'tipoDeCuenta'], [4, 'compartidoTipo'], [5, 'nuevoSaldo']]) cerca(filas[i][columna], fila[campo], `${etiqueta} Excel ${fila.codigo} ${campo}`);
  });
  const resultados = c.construirEstadoResultadosFinancieros();
  const hojasFuente = fuente.filter(f => /^\d/.test(f.codigo) && !fuente.some(otra => otra.codigo.startsWith(f.codigo + '.')));
  const sumaClase = clase => hojasFuente.filter(f => f.codigo.startsWith(clase + '.')).reduce((s, f) => s + c.valorNumerico(f.nuevoSaldo), 0);
  for (const [codigo, valor] of [['TOTAL-I', sumaClase('4')], ['TOTAL-G', sumaClase('5')], ['TOTAL-CV', sumaClase('6')], ['TOTAL-CT', sumaClase('7')], ['RESULTADO', sumaClase('4') - sumaClase('5') - sumaClase('6') - sumaClase('7')]]) {
    cerca(resultados.find(f => f.codigo === codigo).valor, valor, `${etiqueta} suma independiente ${codigo}`);
  }
  const excelResultados = releerHoja('Estado de resultados').slice(6);
  resultados.forEach((fila, i) => cerca(excelResultados[i][3], fila.valor, `${etiqueta} resultados ${fila.codigo}`));
  c.generarReporteGeneral();
  for (const [codigo, valor] of Object.entries(esperado)) {
    const fila = c.datosTabla.find(f => f.codigo === codigo);
    if (fila) cerca(fila.nuevoSaldo, valor, `${etiqueta} balance ${codigo}`);
  }
  c.exportarLibroInstitucional();
  const resumen = releerHoja('Resumen');
  for (const [codigo, valor] of Object.entries(esperado)) {
    const total = situacion.find(f => f.codigo === codigo);
    if (total?.esTotal) cerca(resumen.find(f => f[0] === total.nombre)[1], valor, `${etiqueta} resumen ${codigo}`);
  }
  const reporte = releerHoja('Reporte').slice(5);
  c.datosTabla.forEach((fila, i) => {
    assert.equal(reporte[i][0], fila.codigo);
    for (const [col, campo] of [[2, 'saldoAnterior'], [3, 'debito'], [4, 'credito'], [5, 'nuevoSaldo'], [8, 'tipoDeCuenta'], [9, 'compartidoTipo']]) {
      cerca(reporte[i][col], c.valorNumerico(fila[campo]), `${etiqueta} balance Excel ${fila.codigo} ${campo}`);
    }
  });
  console.log(`OK ${etiqueta}: ${situacion.length} filas, subtotales, activos/pasivos/patrimonio, resultado y XLSX.`);
}
// Padres cero, saldos negativos, grupos fuera de la plantilla, y separación de otros activos.
const detalle = [
  ['1.1.05', 100, 70, 30], ['1.4.01', 20, 5, 15], ['1.9.51', 8, 0, 8],
  ['1.9.52', 2, 0, 2], ['1.9.70', 5, 0, 5], ['1.9.90', 15, 10, 5],
  ['2.3.01', 10, 4, 6], ['2.5.11', 20, 10, 10], ['2.5.99', 5, 0, 5],
  ['2.7.01', -3, 0, -3], ['3.1.05', 100, 0, 100], ['3.1.51.01.02', -10, 0, -10],
  ['3.2.01', 28, 0, 28], ['4.3.05', 20, 0, 20], ['5.1.01', 2, 0, 2],
].map(([codigo, nuevoSaldo, tipoDeCuenta, compartidoTipo]) => ({ codigo, nombre: codigo, nuevoSaldo, tipoDeCuenta, compartidoTipo }));
verificar([...detalle, { codigo: '3.1.51', nuevoSaldo: 0 }], { 'TOTAL-A': 150, 'TOTAL-AC': 85, 'TOTAL-ANC': 65, 'TOTAL-P': 32, 'TOTAL-PC': 14, 'TOTAL-PNC': 18, 'TOTAL-PAT': 118, 'DIFERENCIA': -18 }, 'Casos de regresión');
const leer = crearLectorBalance([{ codigo: '1.1', nuevoSaldo: 100, tipoDeCuenta: 0, compartidoTipo: 100 }, { codigo: '1.1.05', nuevoSaldo: 100, tipoDeCuenta: 100, compartidoTipo: 0 }]);
assert.equal(leer('1.1', 'tipoDeCuenta'), 0, 'Conservar cero corriente explícito');
assert.equal(leer('1.1', 'nuevoSaldo'), 100, 'No duplicar padre y detalle');
verificar([{ codigo: '3.1.10', nuevoSaldo: 50 }], { 'TOTAL-PAT': 50, 'TOTAL-PAT-R': 50, 'RESULTADO-PENDIENTE': 0 }, 'Resultado ya registrado sin duplicarlo');
verificar([{ codigo: '3.1.10', nuevoSaldo: 50 }, { codigo: '4.3', nuevoSaldo: 20 }, { codigo: '5.1', nuevoSaldo: 2 }], { 'TOTAL-PAT': 50, 'TOTAL-PAT-R': 68, 'RESULTADO-PENDIENTE': 18 }, 'Patrimonio separado del resultado abierto');
// Valores de la captura: la pérdida actuarial debe aparecer tanto en detalle como en el total.
verificar([{ codigo: '3.1.05', nuevoSaldo: 515159303922 }, { codigo: '3.1.09', nuevoSaldo: 1645807655101 }, { codigo: '3.1.51', nuevoSaldo: 0 }, { codigo: '3.1.51.01.02', nuevoSaldo: -218529918399 }], { 'TOTAL-PAT': 1942437040624 }, 'Captura patrimonio');
// Varias ediciones sucesivas deben conservar el total y actualizar todos los padres.
const editables = detalle.filter(f => /^[12]\./.test(f.codigo)).map(f => ({ ...f }));
const arbol = new Map(editables.map(f => [f.codigo, f]));
editables.forEach(f => {
  const partes = f.codigo.split('.');
  for (let n = 1; n < partes.length; n++) {
    const codigo = partes.slice(0, n).join('.');
    if (!arbol.has(codigo)) arbol.set(codigo, { codigo });
  }
});
const lectorInicial = crearLectorBalance(Array.from(arbol.values(), fila => ({ ...fila })));
arbol.forEach(f => {
  for (const campo of ['nuevoSaldo', 'tipoDeCuenta', 'compartidoTipo']) f[campo] = lectorInicial(f.codigo, campo);
});
const editado = componente(Array.from(arbol.values()));
editado.reporteActivo = 'original';
for (let vuelta = 0; vuelta < 4; vuelta++) {
  editables.forEach(f => {
    const actual = editado.datosTabla.find(cuenta => cuenta.codigo === f.codigo);
    const corriente = actual.tipoDeCuenta * 0.25;
    editado.aplicarAjustesDirectosAlReporte([{ ...actual, tipoDeCuenta: corriente, compartidoTipo: actual.nuevoSaldo - corriente }]);
  });
}
const esperadoEditado = {};
for (const [clase, corriente, noCorriente, total] of [['1', 'TOTAL-AC', 'TOTAL-ANC', 'TOTAL-A'], ['2', 'TOTAL-PC', 'TOTAL-PNC', 'TOTAL-P']]) {
  const hojas = editado.datosTabla.filter(f => f.codigo.startsWith(clase + '.') && !editado.datosTabla.some(otra => otra.codigo.startsWith(f.codigo + '.')));
  esperadoEditado[corriente] = hojas.reduce((s, f) => s + f.tipoDeCuenta, 0);
  esperadoEditado[noCorriente] = hojas.reduce((s, f) => s + f.compartidoTipo, 0);
  esperadoEditado[total] = hojas.reduce((s, f) => s + f.nuevoSaldo, 0);
}
verificar(editado.datosTabla, esperadoEditado, '40 redistribuciones sucesivas');
const argumentos = process.argv.slice(2);
const indiceCiclos = argumentos.indexOf('--ciclos');
const archivoCiclos = indiceCiclos < 0 ? null : argumentos.splice(indiceCiclos, 2)[1];
let ultimaFuente;
// Captura real: un cero contable NO se reemplaza por el resultado auxiliar.
verificar([
  { codigo: '3', nuevoSaldo: 1942437040624 },
  { codigo: '3.1.05', nuevoSaldo: 515159303922 },
  { codigo: '3.1.09', nuevoSaldo: 1645807655101 },
  { codigo: '3.1.10', nuevoSaldo: 0, saldoAnterior: 0, debito: 0, credito: 0 },
  { codigo: '3.1.10.01', nuevoSaldo: 1072773892276, tipoSaldoNuevo: 'CR' },
  { codigo: '3.1.51', nuevoSaldo: 0 },
  { codigo: '3.1.51.01', nuevoSaldo: 0 },
  { codigo: '3.1.51.01.02', nuevoSaldo: 218529918399, tipoSaldoNuevo: 'DB' },
], { 'TOTAL-PAT': 1942437040624 }, 'Cero explícito y pérdida DB de la captura');
const ceroValido = crearLectorBalance([{ codigo: '3.1.10', nuevoSaldo: 0 }, { codigo: '3.1.10.01', nuevoSaldo: 1072773892276 }]);
assert.equal(ceroValido('3.1.10', 'nuevoSaldo'), 0);
for (const archivo of argumentos) {
  const txt = /\.txt$/i.test(archivo);
  const libro = txt ? null : XLSX.readFile(archivo);
  const filas = txt ? leerBalanceOficialTxt(fs.readFileSync(archivo).toString('latin1')) : limpiarFilasBalance(XLSX.utils.sheet_to_json(libro.Sheets[libro.SheetNames[0]]));
  const valor = texto => {
    const n = Number(String(texto).replace(/[^0-9.-]/g, ''));
    return /DB/.test(String(texto)) ? n : -n;
  };
  const cuentas = filas.map(fila => {
    const raw = fila.nombre.match(/^\d+/)[0];
    const codigo = [raw[0], raw[1], ...raw.slice(2).match(/.{2}/g)].join('.');
    const natural = ['1', '5', '6', '7', '8'].includes(raw[0]) ? 1 : -1;
    const nuevoSaldo = natural * valor(fila.nuevoSaldo);
    // Distribución de prueba: importa comparar la exportación con la misma fuente,
    // no sustituir las clasificaciones/ediciones de la sesión del usuario.
    return { codigo, nombre: fila.nombre, nuevoSaldo, tipoDeCuenta: Math.round(nuevoSaldo * 0.4 * 100) / 100, compartidoTipo: Math.round((nuevoSaldo - Math.round(nuevoSaldo * 0.4 * 100) / 100) * 100) / 100 };
  });
  ultimaFuente = cuentas;
  const suma = (clase, campo) => cuentas.filter(f => f.codigo.startsWith(clase + '.')).reduce((n, f) => n + f[campo], 0);
  verificar(cuentas, { 'TOTAL-A': suma('1', 'nuevoSaldo'), 'TOTAL-AC': suma('1', 'tipoDeCuenta'), 'TOTAL-ANC': suma('1', 'compartidoTipo'), 'TOTAL-P': suma('2', 'nuevoSaldo'), 'TOTAL-PC': suma('2', 'tipoDeCuenta'), 'TOTAL-PNC': suma('2', 'compartidoTipo'), 'TOTAL-PAT': suma('3', 'nuevoSaldo'), 'DIFERENCIA': 0 }, `${path.basename(archivo)} (${cuentas.length} cuentas)`);
}

// El auxiliar solo redistribuye: conserva saldos y movimientos y es idempotente.
const ceros = leerSaldosCiclo([[['Rubro', 'SC Año Vigente', 'SC Año Anterior'], ['13840802', 0, 999]]]);
assert.equal(ceros[0].corriente, 0);
assert.throws(() => leerSaldosCiclo([[['Rubro', 'SC Año Anterior'], ['13840802', 1]]]));
assert.throws(() => leerSaldosCiclo([[['Rubro', 'SC Año Vigente'], ['13840802', 'error']]]));
assert.throws(() => leerSaldosCiclo([[['Rubro', 'SC Año Vigente'], ['13840802', 1], ['13840802', 2]]]));
const formato = leerSaldosCiclo([[[' Rubro ', ' SC Año Vigente '], ['1.3.84.08.02', '1.739.891.084,50']]]);
assert.equal(formato[0].corriente, 1739891084.5);
if (archivoCiclos && ultimaFuente) {
  const libro = XLSX.readFile(archivoCiclos);
  const registros = leerSaldosCiclo(libro.SheetNames.map(n => XLSX.utils.sheet_to_json(libro.Sheets[n], { header: 1, defval: null })));
  const c = componente(ultimaFuente.map(f => ({ ...f, debito: 10, credito: 20, saldoAnterior: 30 })));
  const previos = JSON.parse(JSON.stringify(c.tablaInicialGuardada));
  c.clonarDatos = datos => JSON.parse(JSON.stringify(datos));
  c.limpiarSeleccionTabla = () => {};
  c.guardarFuenteOriginal = datos => { c.tablaInicialGuardada = c.clonarDatos(datos); };
  c.mostrarInformacionOriginal = () => { c.datosTabla = c.clonarDatos(c.tablaInicialGuardada); };
  for (let vuelta = 0; vuelta < 2; vuelta++) {
    c.revisionSaldosCiclo = revisarSaldosCiclo(registros, c.tablaInicialGuardada);
    c.fuenteRevisionSaldosCiclo = JSON.stringify(c.tablaInicialGuardada);
    const aplicables = c.revisionSaldosCiclo.filter(f => !f.motivo);
    const omitidas = c.revisionSaldosCiclo.filter(f => f.motivo);
    assert(omitidas.every(f => f.corriente === 0), 'En este auxiliar los rubros no encontrados tienen cero');
    c.aplicarSaldosCiclo();
    aplicables.forEach(f => {
      const actual = c.tablaInicialGuardada.find(cuenta => cuenta.codigo === f.codigo);
      cerca(actual.tipoDeCuenta, f.corriente, 'Corriente desde SC Año Vigente');
      cerca(actual.compartidoTipo, actual.nuevoSaldo - f.corriente, 'Resta no corriente');
    });
    c.tablaInicialGuardada.forEach((f, i) => {
      for (const campo of ['nuevoSaldo', 'saldoAnterior', 'debito', 'credito']) assert.equal(f[campo], previos[i][campo], `Conservar ${campo}`);
    });
    if (vuelta === 0) console.log(`OK auxiliar real: ${registros.length} rubros, ${aplicables.length} coinciden, ${omitidas.length} no encontrados (todos cero).`);
  }
  const suma = (clase, campo) => c.tablaInicialGuardada.filter(f => f.codigo.startsWith(clase + '.')).reduce((n, f) => n + f[campo], 0);
  verificar(c.tablaInicialGuardada, { 'TOTAL-A': suma('1', 'nuevoSaldo'), 'TOTAL-AC': suma('1', 'tipoDeCuenta'), 'TOTAL-ANC': suma('1', 'compartidoTipo'), 'TOTAL-P': suma('2', 'nuevoSaldo'), 'TOTAL-PC': suma('2', 'tipoDeCuenta'), 'TOTAL-PNC': suma('2', 'compartidoTipo'), 'TOTAL-PAT': suma('3', 'nuevoSaldo') }, 'Después del auxiliar y su segunda carga');
}
// Procesamiento completo del Excel, incluyendo los auxiliares que genera el sistema.
const archivoOficial = argumentos.find(archivo => /\.xlsx$/i.test(archivo));
if (archivoOficial) {
  const almacenamiento = new Map();
  const entorno = {
    ...contexto,
    Subject: require('rxjs').Subject,
    localStorage: {
      getItem: clave => almacenamiento.get(clave) || null,
      setItem: (clave, valor) => almacenamiento.set(clave, valor),
      removeItem: clave => almacenamiento.delete(clave),
    },
    console: { log() {} }, setTimeout() {},
  };
  const miembros = clase.members.filter(n => !ts.isConstructorDeclaration(n) &&
    !(ts.canHaveDecorators(n) && ts.getDecorators(n)?.length)).map(n => n.getText(source)).join('\n');
  vm.runInNewContext(ts.transpile(`class Completo {${miembros}};globalThis.Completo=Completo;`, { target: ts.ScriptTarget.ES2022 }), entorno);
  const actual = new entorno.Completo();
  const libro = XLSX.readFile(archivoOficial);
  const datos = limpiarFilasBalance(XLSX.utils.sheet_to_json(libro.Sheets[libro.SheetNames[0]])).map(fila => {
    const raw = fila.nombre.match(/^\d+/)[0];
    return { ...fila, codigo: [raw[0], raw[1], ...raw.slice(2).match(/.{2}/g)].join('.'), tipoDeCuenta: 0, compartidoTipo: 0, corriente: false, noCorriente: true };
  });
  actual.procesarSaldo(datos);
  actual.datosTabla = datos;
  actual.datosTabla2Recorrido = datos;
  actual.elementosUnificados = datos;
  actual.actualizarTabla = () => {};
  actual.ejecutarModeloDeResumidos(actual.contadormodelo);
  actual.tablaInicialGuardada = actual.clonarDatos(actual.datosTabla);
  const original = actual.datosTabla.find(f => f.codigo === '3').nuevoSaldo;
  const exportadas = actual.construirEstadoSituacionFinanciera();
  cerca(exportadas.find(f => f.codigo === 'TOTAL-PAT').nuevoSaldo, original, 'Procesamiento real: patrimonio pantalla = descarga');
  assert.equal(exportadas.find(f => f.codigo === '3.1.10').nuevoSaldo, actual.datosTabla.find(f => f.codigo === '3.1.10').nuevoSaldo, 'Respetar cero real del resultado del ejercicio');
  const diferenciaReal = exportadas.find(f => f.codigo === 'DIFERENCIA').nuevoSaldo;
  cerca(diferenciaReal, 0, 'Procesamiento real: balance conciliado con el resultado');
  if (/09302026/.test(archivoOficial)) {
    cerca(exportadas.find(f => f.codigo === 'RESULTADO-PENDIENTE').nuevoSaldo, 193866520085.10, 'Resultado con centavos de septiembre');
    cerca(exportadas.find(f => f.codigo === 'TOTAL-PAT-R').nuevoSaldo, 2136303560710.35, 'Patrimonio + resultado de septiembre');
  }
  actual.exportarEstadoSituacionFinanciera();
  if (/09302026/.test(archivoOficial)) {
    const propiedades = releerHoja('Nota 13 P Inversión');
    cerca(propiedades.find(f => f[0] === '1952')[4], -892012537.27, 'Depreciación con signo CR y movimientos correctos');
    cerca(propiedades.find(f => f[0] === '19')[4], 1857966652.86, 'Propiedades de inversión netas');
    cerca(releerHoja('Nota 14 Intangibles').find(f => f[0] === '19')[4], 13688298203.85, 'Intangibles netos de amortización');
    cerca(releerHoja('Nota 22 Benef Empeados').find(f => f[0] === '2512')[4], 8087757691.12, 'Recuperar padre vacío sin perder beneficio');
    const notaPat = releerHoja('Nota 27 Patrimonio');
    assert.equal(notaPat.find(f => f[0] === '3110')[4], 0, 'No incorporar auxiliar sintético de resultado');
    cerca(notaPat.find(f => f[0] === '3151')[4], -218529918398.77, 'Pérdida actuarial negativa en la nota');
  }
  console.log(`OK revisión fila por fila: ${validarNotasExportadas(exportado, exportadas)} filas de notas del procesamiento original.`);
  const hoja = releerHoja('Situacion financiera');
  cerca(hoja.find(f => f[1] === 'TOTAL-PAT')[5], original, 'Excel del procesamiento real');
  console.log(`OK procesamiento completo: patrimonio en aplicación y XLSX = ${original}.`);
  entorno.PruebaComponent = entorno.Completo;
  const antesActual = JSON.stringify(actual.tablaInicialGuardada);
  const antesAlmacenamiento = JSON.stringify(Array.from(almacenamiento));
  const archivoMock = ruta => ({ name: path.basename(ruta), arrayBuffer: async () => { const b = fs.readFileSync(ruta); return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength); } });
  // Swal se simula solo para confirmar/cancelar; se prueban los procesadores y exportadores reales.
  const probarHistorico = async () => {
    entorno.Swal = { fire: async () => ({ isConfirmed: true }) };
    await actual.generarComparativoDesdeOriginal(archivoMock(archivoOficial), archivoCiclos ? archivoMock(archivoCiclos) : undefined, 'Septiembre 2026', 'Septiembre 2025');
    assert.equal(JSON.stringify(actual.tablaInicialGuardada), antesActual, 'Histórico aislado de la fuente actual');
    assert.equal(JSON.stringify(Array.from(almacenamiento)), antesAlmacenamiento, 'Histórico sin escrituras en localStorage');
    const detalleHistorico = releerHoja('Detalle periodo base');
    const pension = detalleHistorico.find(f => f[0] === '1.3.84.08.02');
    if (archivoCiclos) cerca(pension[6], 1739891084, 'Ciclo aplicado solo al periodo base');
    assert.equal(exportado.SheetNames.filter(n => /^Nota /.test(n)).length, 28);
    const exportacionAnterior = exportado;
    entorno.Swal = { fire: async () => ({ isConfirmed: false }) };
    await actual.generarComparativoDesdeOriginal(archivoMock(archivoOficial), undefined, 'Septiembre 2026', 'Septiembre 2025');
    assert.equal(exportado, exportacionAnterior, 'Cancelar no genera descarga');
    assert.equal(JSON.stringify(actual.tablaInicialGuardada), antesActual, 'Cancelar no modifica datos actuales');
    console.log('OK histórico original: ciclo independiente, 28 notas comparativas, detalle de ambos periodos y cancelación sin cambios.');
  };
  // Los siguientes tests son síncronos; diferir la ejecución evita compartir el libro capturado.
  globalThis.pruebaHistoricoCompleto = probarHistorico;

}

const comparativoNotas = XLSX.utils.book_new();
agregarNotasFinancieras(comparativoNotas, [{ codigo: '1.1', nuevoSaldo: 100, tipoDeCuenta: 60, compartidoTipo: 40 }], 'Septiembre 2026', [], { cuentas: [], completa: false }, 'Septiembre 2025');
let tablaNotas = XLSX.utils.sheet_to_json(comparativoNotas.Sheets['Nota 5 EF y Eq'], { header: 1 });
let efectivoNotas = tablaNotas.find(f => f[0] === '11');
assert.equal(efectivoNotas[4], 100);
assert(efectivoNotas[7] == null && efectivoNotas[8] == null, 'No inventar cero ni variación si falta el detalle base');
const baseCompleta = XLSX.utils.book_new();
agregarNotasFinancieras(baseCompleta, [{ codigo: '1.1', nuevoSaldo: 100, tipoDeCuenta: 60, compartidoTipo: 40 }], 'Septiembre 2026', [], { cuentas: [{ codigo: '1.1', nuevoSaldo: 80, tipoDeCuenta: 50, compartidoTipo: 30 }], completa: true }, 'Septiembre 2025');
tablaNotas = XLSX.utils.sheet_to_json(baseCompleta.Sheets['Nota 5 EF y Eq'], { header: 1 });
efectivoNotas = tablaNotas.find(f => f[0] === '11');
assert.equal(efectivoNotas[7], 80); assert.equal(efectivoNotas[8], 20);
const desdeNotas = leerFuenteNotasBase(baseCompleta, 2025);
assert.equal(desdeNotas.cuentas.find(f => f.codigo === '1.1').nuevoSaldo, 80);
console.log('OK notas: 28 hojas automáticas/complementarias, exclusión de 8/9, comparativo con base disponible y base ausente.');

const exportadorComparativo = componente([{ codigo: '1.1', nombre: 'EFECTIVO', nuevoSaldo: 100, tipoDeCuenta: 60, compartidoTipo: 40 }]);
exportadorComparativo.exportarBalanceComparativo(exportadorComparativo.construirEstadoSituacionFinanciera(), [], 'Septiembre 2026', 'Septiembre 2025', [{ nombre: 'INGRESOS', codigo: '4', nuevoSaldo: 0 }], exportadorComparativo.construirEstadoResultadosFinancieros(), { cuentas: [], completa: false });
assert.equal(exportado.SheetNames.filter(n => /^Nota /.test(n)).length, 28);
assert(exportado.SheetNames.includes('Estado situación'));
const comparativoReal = releerHoja('Nota 5 EF y Eq').find(f => f[0] === '11');
assert.equal(comparativoReal[4], 100); assert(comparativoReal[7] == null);
console.log('OK descarga comparativa real: notas incluidas y ausencia de base señalada sin inventar importes.');

const minimoHistorico = prepararDetalleHistorico([{ nombre: '31510102 PERDIDA ACTUARIAL', saldoAnterior: '100.25 DB', nuevoSaldo: '100.25 DB', debito: 0, credito: 0 }], []);
assert.equal(minimoHistorico[0].nuevoSaldo, -100.25);
const arbolHistorico = agruparDetalleHistorico(minimoHistorico, []);
assert.equal(arbolHistorico.find(c => c.codigo === '3').nuevoSaldo, -100.25);
if (globalThis.pruebaHistoricoCompleto) globalThis.pruebaHistoricoCompleto().catch(error => { console.error(error); process.exitCode = 1; });

const libroConError = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(libroConError, XLSX.utils.aoa_to_sheet([['Código', 'Concepto'], ['2512', 'Beneficio', 8087757691, 0.12, 0]]), 'Nota 22 Benef Empeados');
assert.throws(() => validarNotasFinancieras(libroConError, []), /no coincide/, 'Bloquear la inconsistencia real de la nota 22');
