import { StudentAddress, AddressReference, AddressCheck, readStudentAddress, addressField, identityKey, addressQuality, compareLocality, sameAddressKey, compareAddressReference, compareSisbenAddress } from './address-audit';
import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom, timeout } from 'rxjs';
import * as XLSX from 'xlsx';
import * as XLSXStyle from 'xlsx-js-style';
import Swal from 'sweetalert2';

/**
 * API expuesta por electron/preload.js
 */
declare global {
  interface Window {
    electronAPI?: {
      consultarGrupoSisben(pNumDoc: string, pTipDoc: number): Promise<any>;

      obtenerDatosRui(pNumDoc: string, pTipDoc: number): Promise<any>;
    };
  }
}

type Criticidad = 'Crítica' | 'Alta' | 'Media' | 'Sin alerta';

interface CasoAuditoria {
  original: Record<string, any>;
  direccion: StudentAddress;
  calidadDireccion: AddressCheck;
  cruceUbicacion: AddressCheck;
  direccionSisben?: StudentAddress;
  cruceDireccionSisben: AddressCheck;
  cruceDireccionBase: AddressCheck;
  referenciaDireccion?: StudentAddress;
  estudiantesMismaDireccion: number;
  codigo: string;
  nombre: string;
  tipoInstitucion: string;
  colegio: string;
  pension: number;
  estrato: number;
  sisbenExcel: string;
  tipoDocumento: string;
  documento: string;
  valorPagado: number;
  criticidad: Criticidad;
  puntaje: number;
  observaciones: string[];

  errorConsulta?: string;
  sisbenConsultado?: string;
  descripcionSisben?: string;
  grupoIngresos?: string;
  grupoRui?: string;
  nivelRui?: string;
  municipioSisben?: string;
  departamentoSisben?: string;
  codigoMunicipio?: string;
  nombreRui?: string;
  sexoRui?: string;
  edadRui?: number | string;

  estadoConsulta?:
    | 'Pendiente'
    | 'Consultando'
    | 'Consultado'
    | 'No encontrado'
    | 'Error';
}

@Component({
  selector: 'app-auditoria-liquidaciones',
  templateUrl: './auditoria-liquidaciones.component.html',
  styleUrls: ['./auditoria-liquidaciones.component.scss'],
})
export class AuditoriaLiquidacionesComponent {
  /**
   * ============================================================
   * PROXY WEB
   * ============================================================
   *
   * Esto SOLO se utiliza cuando la aplicación se abre
   * desde un navegador.
   *
   * En Electron NO se utiliza.
   */
  private readonly dnpBaseUrl =
    ['localhost', '127.0.0.1'].includes(window.location.hostname) ||
    window.location.hostname.endsWith('.pages.dev') ||
    window.location.hostname.endsWith('.workers.dev')
      ? '/dnp-api'
      : window.location.hostname.endsWith('.netlify.app')
        ? '/.netlify/functions/dnp-proxy'
        : 'https://peaceful-sfogliatella-30e3e6.netlify.app/.netlify/functions/dnp-proxy';

  private readonly cacheSisben = new Map<
    string,
    {
      grupo: any;
      rui: any;
    }
  >();

  readonly salarioMinimo2026 = 1750905;

  umbralPension = this.salarioMinimo2026 / 2;

  registros: CasoAuditoria[] = [];

  nombreArchivo = '';

  cargando = false;

  consultandoSisben = false;

  progresoSisben = 0;

  filtro: 'Todos' | Criticidad = 'Todos';

  busqueda = '';

  pagina = 0;

  tamanoPagina = 25;

  baseDirecciones = new Map<string, AddressReference[]>();
  nombreBaseDirecciones = '';
  filtroDireccion = 'Todos';
  get direccionesPorRevisar(): number { return this.registros.filter(c=>c.calidadDireccion.estado!=='Datos completos').length; }
  get diferenciasDireccionSisben(): number { return this.registros.filter(c=>c.cruceDireccionSisben.estado === 'Dirección diferente').length; }
  get sinDireccionSisben(): number { return this.registros.filter(c=>c.cruceDireccionSisben.estado === 'Sisbén no informa dirección').length; }
  get ubicacionesDiferentes(): number { return this.registros.filter(c=>c.cruceUbicacion.estado==='Ubicación diferente').length; }
  get direccionesCompartidas(): number { return new Set(this.registros.filter(c=>c.estudiantesMismaDireccion>1).map(c=>identityKey(c.tipoDocumento,c.documento)).filter(Boolean)).size; }
  private actualizarDirecciones(): void {
    const households=new Map<string, Set<string>>();
    this.registros.forEach(c=>{const key=sameAddressKey(c.direccion),id=identityKey(c.tipoDocumento,c.documento);if(key&&id){if(!households.has(key))households.set(key,new Set());households.get(key)!.add(id);}});
    this.registros.forEach(c=>{
      c.calidadDireccion=addressQuality(c.direccion);
      c.cruceDireccionSisben=compareSisbenAddress(c.direccion,c.direccionSisben,['Consultado','No encontrado'].includes(c.estadoConsulta||''));
      c.cruceUbicacion=compareLocality(c.direccion,c.municipioSisben||'',c.departamentoSisben||'',c.estadoConsulta==='Consultado');
      c.estudiantesMismaDireccion=households.get(sameAddressKey(c.direccion))?.size||0;
      const references=this.baseDirecciones.get(identityKey(c.tipoDocumento,c.documento))||[];
      c.cruceDireccionBase=compareAddressReference(c.direccion,references);
      c.referenciaDireccion=references.length===1?references[0].address:undefined;
    });
  }
  async cargarBaseDirecciones(event: Event): Promise<void> {
    const input=event.target as HTMLInputElement,file=input.files?.[0];if(!file)return;
    try {
      if(file.size>10000000)throw new Error('La base supera 10 MB.');
      const book=XLSX.read(await file.arrayBuffer(),{type:'array'});
      const rows=XLSX.utils.sheet_to_json<Record<string,unknown>>(book.Sheets[book.SheetNames[0]],{defval:''});
      if(!rows.length)throw new Error('La base no tiene registros.');
      const entries=new Map<string,AddressReference[]>();
      for(const [index,row] of rows.entries()) {
        const tipoDocumento=addressField(row,['Tipo de documento','Tipo documento']);
        const documento=addressField(row,['Número de documento','Documento','Identificación']);
        const key=identityKey(tipoDocumento,documento),address=readStudentAddress(row);
        if(!key)throw new Error(`Falta tipo o número de documento en la fila ${index+2}.`);
        if(Object.values(address).every(v=>!v.trim()))throw new Error(`No hay datos de ubicación en la fila ${index+2}.`);
        const ref={tipoDocumento,documento,address};entries.set(key,[...(entries.get(key)||[]),ref]);
      }
      this.baseDirecciones=entries;this.nombreBaseDirecciones=file.name;this.actualizarDirecciones();this.pagina=0;
      Swal.fire('Base cruzada',`${rows.length} filas relacionadas por tipo y número de documento. Las diferencias requieren revisión.`, 'success');
    } catch(error:any){Swal.fire('No se pudo cruzar la base',error?.message||'Revisa los encabezados y documentos.','error');}
    finally{input.value='';}
  }
  quitarBaseDirecciones(): void {this.baseDirecciones.clear();this.nombreBaseDirecciones='';this.actualizarDirecciones();this.pagina=0;}
  constructor(private http: HttpClient) {}

  /**
   * ============================================================
   * FILTROS
   * ============================================================
   */

  get casosFiltrados(): CasoAuditoria[] {
    const texto = this.normalizar(this.busqueda);

    return this.registros.filter(
      (caso) =>
        (this.filtro === 'Todos' || caso.criticidad === this.filtro) &&
        (this.filtroDireccion === 'Todos' ||
          this.filtroDireccion === 'Diferencia SISBEN' && caso.cruceDireccionSisben.estado === 'Dirección diferente' ||
          this.filtroDireccion === 'Sin dirección SISBEN' && caso.cruceDireccionSisben.estado === 'Sisbén no informa dirección' ||
          this.filtroDireccion === 'Incompletas' && caso.calidadDireccion.estado !== 'Datos completos' ||
          this.filtroDireccion === 'Ubicación diferente' && caso.cruceUbicacion.estado === 'Ubicación diferente' ||
          this.filtroDireccion === 'Compartidas' && caso.estudiantesMismaDireccion > 1 ||
          this.filtroDireccion === 'Diferencia base' && ['Diferencia con base','Referencia ambigua'].includes(caso.cruceDireccionBase.estado)) &&
        (!texto ||
          this.normalizar(
            `${caso.codigo} ${caso.nombre} ${caso.documento} ${caso.colegio} ${caso.direccion.direccion} ${caso.direccion.barrio} ${caso.direccion.ciudad} ${caso.direccion.departamento}`,
          ).includes(texto)),
    );
  }

  get casosPagina(): CasoAuditoria[] {
    const inicio = this.pagina * this.tamanoPagina;

    return this.casosFiltrados.slice(inicio, inicio + this.tamanoPagina);
  }

  get totalPaginas(): number {
    return Math.max(
      1,
      Math.ceil(this.casosFiltrados.length / this.tamanoPagina),
    );
  }

  get totalAlertas(): number {
    return this.registros.filter((x) => x.criticidad !== 'Sin alerta').length;
  }

  get criticos(): number {
    return this.registros.filter((x) => x.criticidad === 'Crítica').length;
  }

  get altos(): number {
    return this.registros.filter((x) => x.criticidad === 'Alta').length;
  }

  get medios(): number {
    return this.registros.filter((x) => x.criticidad === 'Media').length;
  }

  /**
   * ============================================================
   * CARGAR EXCEL
   * ============================================================
   */

  async cargarExcel(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;

    const archivo = input.files?.[0];

    if (!archivo) {
      return;
    }

    this.cargando = true;

    try {
      const libro = XLSX.read(await archivo.arrayBuffer(), {
        type: 'array',
        raw: true,
      });

      const hoja = libro.Sheets[libro.SheetNames[0]];

      const datos = XLSX.utils.sheet_to_json<Record<string, any>>(hoja, {
        defval: '',
        raw: true,
      });

      const requeridas = [
        'Estrato',
        'Tipo Institución',
        'Valor pensión',
        'Valor pagado',
        'Número de documento',
      ];

      const disponibles = datos.length ? Object.keys(datos[0]) : [];

      const faltantes = requeridas.filter(
        (x) =>
          !disponibles.some((y) => this.normalizar(y) === this.normalizar(x)),
      );

      if (faltantes.length) {
        throw new Error(`Faltan columnas requeridas: ${faltantes.join(', ')}`);
      }

      this.registros = this.aplicarReglasDeConjunto(
        datos.map((fila) => this.construirCaso(fila)),
      );

      this.actualizarDirecciones(); this.filtroDireccion = 'Todos';
      this.nombreArchivo = archivo.name;

      this.pagina = 0;

      Swal.fire(
        'Archivo analizado',
        `${this.registros.length} registros procesados y ${this.totalAlertas} casos enviados a revisión.`,
        'success',
      );
    } catch (error: any) {
      this.registros = [];

      Swal.fire(
        'No se pudo leer el archivo',
        error?.message || 'Verifica la estructura del Excel.',
        'error',
      );
    } finally {
      this.cargando = false;

      input.value = '';
    }
  }

  recalcular(): void {
    this.registros = this.aplicarReglasDeConjunto(
      this.registros.map((x) => this.construirCaso(x.original, x)),
    );

    this.actualizarDirecciones();
    this.pagina = 0;
  }

  cambiarFiltro(filtro: 'Todos' | Criticidad): void {
    this.filtro = filtro;

    this.pagina = 0;
  }

  cambiarPagina(delta: number): void {
    this.pagina = Math.min(
      this.totalPaginas - 1,
      Math.max(0, this.pagina + delta),
    );
  }

  /**
   * ============================================================
   * CONSULTA MASIVA SISBÉN
   * ============================================================
   */

  async consultarAlertasSisben(direcciones = false): Promise<void> {
    const documentosVistos = new Set<string>();

    const casos = (direcciones ? this.casosFiltrados : this.registros).filter((x) => {
      if (
        (!direcciones && !['Crítica', 'Alta'].includes(x.criticidad)) ||
        (direcciones && ['Consultado','No encontrado'].includes(x.estadoConsulta||'')) ||
        !x.documento ||
        documentosVistos.has(identityKey(x.tipoDocumento,x.documento))
      ) {
        return false;
      }

      documentosVistos.add(identityKey(x.tipoDocumento,x.documento));

      return true;
    });

    if (!casos.length || this.consultandoSisben) {
      return;
    }

    this.consultandoSisben = true;

    this.progresoSisben = 0;

    for (let i = 0; i < casos.length; i += 2) {
      await Promise.all(
        casos
          .slice(i, i + 2)
          .map((caso) => this.consultarCasoSisben(caso, false)),
      );

      this.progresoSisben = Math.round(
        (Math.min(casos.length, i + 2) * 100) / casos.length,
      );

      if (i + 2 < casos.length) {
        await new Promise((resolve) => setTimeout(resolve, 180));
      }
    }

    this.consultandoSisben = false;
  }

  /**
   * ============================================================
   * CONSULTAR UN CASO SISBÉN
   * ============================================================
   */

  async consultarCasoSisben(
    caso: CasoAuditoria,
    mostrarModal = true,
  ): Promise<void> {
    caso.estadoConsulta = 'Consultando';
    caso.errorConsulta = '';

    const tipo = this.codigoTipoDocumento(caso.tipoDocumento);

    if (!tipo) {
      caso.estadoConsulta = 'Error';

      caso.observaciones = [
        ...caso.observaciones,

        `Tipo de documento ${
          caso.tipoDocumento || 'vacío'
        } no parametrizado para SISBÉN.`,
      ];

      return;
    }

    try {
      const cacheKey = `${tipo}:${caso.documento}`;

      const cache = mostrarModal ? undefined : this.cacheSisben.get(cacheKey);

      let grupo: any;

      let rui: any;

      /**
       * ==========================================
       * CACHE
       * ==========================================
       */

      if (cache) {
        console.log('Consulta obtenida desde cache');

        grupo = cache.grupo;

        rui = cache.rui;
      } else if (window.electronAPI) {

      /**
       * ==========================================
       * ELECTRON
       * ==========================================
       *
       * IMPORTANTE:
       *
       * Cuando estamos dentro del .exe,
       * NO usamos Netlify.
       *
       * Angular
       *    ↓
       * preload.js
       *    ↓
       * ipcMain
       *    ↓
       * DNP
       */
        console.log('================================');

        console.log('Consultando SISBÉN mediante ELECTRON');

        console.log('================================');

        [grupo, rui] = await Promise.all([
          window.electronAPI.consultarGrupoSisben(caso.documento, tipo),

          window.electronAPI.obtenerDatosRui(caso.documento, tipo),
        ]);
      } else {
        if (window.location.protocol === 'file:') {
          throw new Error('No se cargó el puente de consultas de Electron. Abre la aplicación desde la carpeta completa del ZIP extraído.');
        }

      /**
       * ==========================================
       * NAVEGADOR / WEB
       * ==========================================
       *
       * Solamente entra aquí si NO existe
       * window.electronAPI.
       */
        console.log('================================');

        console.log('Consultando SISBÉN mediante WEB/PROXY');

        console.log('Host:', window.location.hostname);

        console.log('Proxy:', this.dnpBaseUrl);

        console.log('================================');

        const params = new HttpParams()
          .set('pNumDoc', caso.documento)
          .set('pTipDoc', String(tipo));

        const formulario = new FormData();

        formulario.append('pNumDoc', caso.documento);

        formulario.append('pTipDoc', String(tipo));

        [grupo, rui] = await Promise.all([
          firstValueFrom(
            this.http
              .post(`${this.dnpBaseUrl}/Home/ConsultarGrupoSisben`, null, {
                params,
              })
              .pipe(timeout(30000)),
          ),

          firstValueFrom(
            this.http
              .post(`${this.dnpBaseUrl}/Home/ObtenerDatosRUI`, formulario)
              .pipe(timeout(30000)),
          ),
        ]);
      }

      /**
       * ==========================================
       * CACHE
       * ==========================================
       */

      for (const [servicio, respuesta] of [['SISBÉN', grupo], ['RUI', rui]] as const) {
        if (!respuesta || typeof respuesta !== 'object' || typeof respuesta.ok !== 'boolean') {
          throw new Error(`${servicio}: respuesta no reconocida. No se pudo verificar el registro.`);
        }
        if (!respuesta.ok && (respuesta.error || respuesta.msg || respuesta.mensaje || respuesta.message)) {
          const mensaje = String(respuesta.error || respuesta.msg || respuesta.mensaje || respuesta.message);
          if (!/no\s+(?:se\s+)?(?:encontr|registr|existe|hay\s+(?:datos|informaci[oó]n))/i.test(mensaje)) {
            throw new Error(`${servicio}: DNP respondió: ${mensaje.replace(/<[^>]*>/g, "").replace(/\d{5,}/g, "[dato omitido]").slice(0, 400)}. No se pudo verificar el registro.`);
          }
        }
      }
      if (grupo.ok && (typeof grupo.grupo !== 'string' || !grupo.grupo.trim())) {
        throw new Error('SISBÉN: respuesta sin grupo de clasificación.');
      }
      if (!cache) {
        this.cacheSisben.set(cacheKey, {
          grupo,
          rui,
        });
      }

      /**
       * ==========================================
       * DATOS SISBÉN
       * ==========================================
       */

      caso.sisbenConsultado = grupo?.grupo || 'NO REGISTRA';

      caso.descripcionSisben = grupo?.descripcion || '';

      /**
       * ==========================================
       * DATOS RUI
       * ==========================================
       */

      caso.grupoIngresos = rui?.grupoIngresos || '';

      caso.grupoRui = rui?.grupRui || '';

      caso.nivelRui = rui?.nivelRui || '';

      caso.direccionSisben = grupo?.ok ? readStudentAddress(grupo) : undefined;
      caso.municipioSisben = grupo?.municipio || rui?.municipio || '';

      caso.departamentoSisben = grupo?.departamento || rui?.departamento || '';

      caso.codigoMunicipio = rui?.codMpio || '';

      caso.nombreRui = rui?.nombre || '';

      caso.sexoRui = rui?.sexo || '';

      caso.edadRui = rui?.edad ?? '';

      /**
       * ==========================================
       * ESTADO CONSULTA
       * ==========================================
       */

      caso.estadoConsulta =
        grupo?.ok || rui?.ok ? 'Consultado' : 'No encontrado';

      /**
       * ==========================================
       * DIFERENCIA SISBÉN
       * ==========================================
       */

      if (
        !caso.observaciones.some(o => o.startsWith('Diferencia SISBÉN:')) &&
        caso.sisbenConsultado !== 'NO REGISTRA' &&
        this.normalizar(caso.sisbenExcel) !==
          this.normalizar(caso.sisbenConsultado)
      ) {
        caso.observaciones = [
          ...caso.observaciones,

          `Diferencia SISBÉN: Excel ${
            caso.sisbenExcel || 'NO REGISTRA'
          } / consulta ${caso.sisbenConsultado}.`,
        ];

        caso.puntaje += 25;

        caso.criticidad = this.criticidadDesdePuntaje(caso.puntaje);
      }

      /**
       * ==========================================
       * DIFERENCIA NOMBRE
       * ==========================================
       */

      if (
        !caso.observaciones.includes('El nombre del RUI no coincide exactamente con el nombre del Excel.') &&
        caso.nombreRui &&
        this.normalizar(caso.nombre) !== this.normalizar(caso.nombreRui)
      ) {
        caso.observaciones = [
          ...caso.observaciones,

          'El nombre del RUI no coincide exactamente con el nombre del Excel.',
        ];

        caso.puntaje += 25;

        caso.criticidad = this.criticidadDesdePuntaje(caso.puntaje);
      }

      /**
       * ==========================================
       * MOSTRAR RESULTADO
       * ==========================================
       */

      this.actualizarDirecciones();
      if (mostrarModal) {
        this.mostrarResultadoSisben(caso, grupo, rui);
      }
    } catch (error) {
      console.error('Error consultando SISBÉN:', error);

      caso.estadoConsulta = 'Error';
      caso.sisbenConsultado = undefined;
      caso.errorConsulta = error instanceof Error ? error.message : 'No se pudo verificar el registro.';
      this.actualizarDirecciones();
      if (mostrarModal) {
        Swal.fire(
          'No fue posible consultar SISBÉN',
          caso.errorConsulta,
          'error',
        );
      }
    }
  }

  /**
   * ============================================================
   * EXPORTAR EXCEL
   * ============================================================
   */

  exportarExcel(): void {
    if (!this.registros.length) {
      return;
    }

    const encabezadosOriginales = Object.keys(this.registros[0].original);

    const encabezadosAuditoria = [
      'Criticidad',
      'Puntaje auditoría',
      'Observaciones',
      'SISBÉN consultado',
      'Descripción SISBÉN',
      'Grupo ingresos RUI',
      'Grupo RUI',
      'Nivel RUI',
      'Municipio SISBÉN',
      'Departamento SISBÉN',
      'Código municipio',
      'Nombre RUI',
      'Sexo RUI',
      'Edad RUI',
      'Estado consulta',
      'Dirección SISBÉN', 'Barrio SISBÉN', 'Ciudad dirección SISBÉN', 'Departamento dirección SISBÉN', 'Comparación dirección estudiante-SISBÉN', 'Diferencias dirección SISBÉN',
      'Calidad dirección', 'Cruce geográfico SISBÉN', 'Observaciones ubicación', 'Estudiantes distintos misma dirección',
      'Base de direcciones', 'Cruce dirección base', 'Observaciones cruce base', 'Dirección base', 'Barrio base', 'Ciudad base', 'Departamento base',
    ];

    const filas = this.registros.map((caso) => [
      ...encabezadosOriginales.map((x) => caso.original[x]),

      caso.criticidad,

      caso.puntaje,

      caso.observaciones.join(' | '),

      caso.sisbenConsultado || '',

      caso.descripcionSisben || '',

      caso.grupoIngresos || '',

      caso.grupoRui || '',

      caso.nivelRui || '',

      caso.municipioSisben || '',

      caso.departamentoSisben || '',

      caso.codigoMunicipio || '',

      caso.nombreRui || '',

      caso.sexoRui || '',

      caso.edadRui ?? '',

      caso.estadoConsulta || 'Pendiente',
      caso.direccionSisben?.direccion||'', caso.direccionSisben?.barrio||'', caso.direccionSisben?.ciudad||'', caso.direccionSisben?.departamento||'', caso.cruceDireccionSisben.estado, caso.cruceDireccionSisben.notas.join(' | '),
      caso.calidadDireccion.estado, caso.cruceUbicacion.estado,
      [...caso.calidadDireccion.notas,...caso.cruceUbicacion.notas].join(' | '), caso.estudiantesMismaDireccion,
      this.nombreBaseDirecciones, caso.cruceDireccionBase.estado, caso.cruceDireccionBase.notas.join(' | '),
      caso.referenciaDireccion?.direccion||'', caso.referenciaDireccion?.barrio||'', caso.referenciaDireccion?.ciudad||'', caso.referenciaDireccion?.departamento||'',
    ]);

    const contenido = [
      [...encabezadosOriginales, ...encabezadosAuditoria],
      ...filas,
    ];

    const hoja: any = XLSXStyle.utils.aoa_to_sheet(contenido);

    hoja['!freeze'] = {
      xSplit: 2,
      ySplit: 1,
      topLeftCell: 'C2',
    };

    hoja['!autofilter'] = {
      ref: `A1:${XLSX.utils.encode_col(
        contenido[0].length - 1,
      )}${contenido.length}`,
    };

    hoja['!cols'] = contenido[0].map((_, i) => ({
      wch: i === 1 || i === encabezadosOriginales.length + 2 ? 36 : 18,
    }));

    const rellenos: Record<Criticidad, string> = {
      Crítica: 'F4CCCC',

      Alta: 'FCE5CD',

      Media: 'FFF2CC',

      'Sin alerta': 'EAF4EC',
    };

    for (let c = 0; c < contenido[0].length; c++) {
      const celda =
        hoja[
          XLSX.utils.encode_cell({
            r: 0,
            c,
          })
        ];

      celda.s = {
        fill: {
          patternType: 'solid',

          fgColor: {
            rgb: '176B4D',
          },
        },

        font: {
          bold: true,

          color: {
            rgb: 'FFFFFF',
          },
        },

        alignment: {
          horizontal: 'center',

          vertical: 'center',

          wrapText: true,
        },
      };
    }

    this.registros.forEach((caso, indice) => {
      for (let c = 0; c < contenido[0].length; c++) {
        const celda =
          hoja[
            XLSX.utils.encode_cell({
              r: indice + 1,

              c,
            })
          ];

        if (celda) {
          celda.s = {
            fill: {
              patternType: 'solid',

              fgColor: {
                rgb: rellenos[caso.criticidad],
              },
            },

            alignment: {
              vertical: 'top',

              wrapText: c === encabezadosOriginales.length + 2 || c >= encabezadosOriginales.length + 15,
            },
          };
        }
      }
    });

    const libro = XLSXStyle.utils.book_new();

    XLSXStyle.utils.book_append_sheet(libro, hoja, 'Auditoría liquidaciones');

    XLSXStyle.writeFile(
      libro,

      `Auditoria_liquidaciones_${new Date().toISOString().slice(0, 10)}.xlsx`,

      {
        compression: true,

        cellStyles: true,
      },
    );
  }

  colorCriticidad(caso: CasoAuditoria): string {
    return `nivel-${this.normalizar(caso.criticidad).replace(/\s/g, '-')}`;
  }

  formatoMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',

      currency: 'COP',

      maximumFractionDigits: 0,
    }).format(valor);
  }

  /**
   * ============================================================
   * CONSTRUIR CASO
   * ============================================================
   */

  private construirCaso(
    fila: Record<string, any>,

    previo?: CasoAuditoria,
  ): CasoAuditoria {
    const valor = (nombre: string) =>
      fila[
        Object.keys(fila).find(
          (x) => this.normalizar(x) === this.normalizar(nombre),
        ) || nombre
      ];

    const estrato =
      Number(String(valor('Estrato') || 0).replace(/[^0-9]/g, '')) || 0;

    const pension = this.numero(valor('Valor pensión'));

    const valorPagado = this.numero(valor('Valor pagado'));

    const privada = this.normalizar(valor('Tipo Institución')).includes(
      'privada',
    );

    const tipoPago = this.normalizar(valor('Tipo pago'));

    const sisben = String(valor('Sisbén') || '');

    const grupoSisben = this.normalizar(sisben).charAt(0).toUpperCase();

    const pagoCero = Math.abs(valorPagado) < 1;

    const pensionAlta = pension > this.umbralPension;

    let puntaje = 0;

    const observaciones: string[] = [];

    if (estrato === 4 && pagoCero) {
      puntaje += 65;

      observaciones.push(
        'Estrato 4 con valor pagado en cero; validar soporte del beneficio.',
      );
    }

    if (estrato >= 5 && pagoCero) {
      puntaje += 85;

      observaciones.push(
        `Estrato ${estrato} con valor pagado en cero; requiere revisión prioritaria.`,
      );
    }

    if (privada && pensionAlta && pagoCero) {
      puntaje += estrato >= 4 ? 35 : 55;

      observaciones.push(
        'Colegio privado con pensión superior al 50 % del SMLMV y valor pagado en cero.',
      );
    }

    if (
      pagoCero &&
      tipoPago.includes('pgmsisben') &&
      this.normalizar(sisben) === 'noregistra'
    ) {
      puntaje += 35;

      observaciones.push(
        'Beneficio PGM-SISBÉN sin grupo SISBÉN registrado; consultar DNP.',
      );
    }

    if (pagoCero && tipoPago.includes('pgmsisben') && grupoSisben === 'D') {
      puntaje += 35;

      observaciones.push(
        'Pago cero con grupo SISBÉN D; validar la regla de elegibilidad vigente.',
      );
    }

    if (pagoCero && !tipoPago.includes('pgmsisben')) {
      puntaje += 80;

      observaciones.push('Valor pagado en cero sin tipo de pago PGM-SISBÉN.');
    }

    if (!pagoCero && valorPagado < 0) {
      puntaje += 20;

      observaciones.push('El valor pagado es negativo.');
    }

    return {
      original: fila,
      direccion: readStudentAddress(fila),
      calidadDireccion: addressQuality(readStudentAddress(fila)),
      cruceUbicacion: {estado:'Pendiente de consulta',notas:[]},
      direccionSisben: previo?.direccionSisben,
      cruceDireccionSisben: {estado:'Pendiente de consulta',notas:[]},
      cruceDireccionBase: {estado:'Sin referencia',notas:[]},
      estudiantesMismaDireccion: 0,

      codigo: String(valor('Código estudiante') || ''),

      nombre: String(valor('Nombre') || valor('Estudiante') || ''),

      tipoInstitucion: String(valor('Tipo Institución') || ''),

      colegio: String(valor('COLEGIO') || ''),

      pension,

      estrato,

      sisbenExcel: String(valor('Sisbén') || ''),

      tipoDocumento: String(valor('Tipo de documento') || ''),

      documento: String(valor('Número de documento') || '').replace(/\D/g, ''),

      valorPagado,

      criticidad: this.criticidadDesdePuntaje(puntaje),

      puntaje,

      observaciones,

      sisbenConsultado: previo?.sisbenConsultado,

      grupoIngresos: previo?.grupoIngresos,

      nivelRui: previo?.nivelRui,

      descripcionSisben: previo?.descripcionSisben,

      grupoRui: previo?.grupoRui,

      municipioSisben: previo?.municipioSisben,

      departamentoSisben: previo?.departamentoSisben,

      codigoMunicipio: previo?.codigoMunicipio,

      nombreRui: previo?.nombreRui,

      sexoRui: previo?.sexoRui,

      edadRui: previo?.edadRui,

      estadoConsulta: previo?.estadoConsulta || 'Pendiente',
      errorConsulta: previo?.errorConsulta,
    };
  }

  /**
   * ============================================================
   * REGLAS DE CONJUNTO
   * ============================================================
   */

  private aplicarReglasDeConjunto(casos: CasoAuditoria[]): CasoAuditoria[] {
    const documentos = new Map<string, CasoAuditoria[]>();

    const recibos = new Map<string, CasoAuditoria[]>();

    casos.forEach((caso) => {
      if (caso.documento) {
        documentos.set(
          caso.documento,

          [...(documentos.get(caso.documento) || []), caso],
        );
      }

      const recibo = String(caso.original['Número recibo'] || '').trim();

      if (recibo) {
        recibos.set(
          recibo,

          [...(recibos.get(recibo) || []), caso],
        );
      }
    });

    documentos.forEach((grupo) => {
      if (grupo.length < 2) {
        return;
      }

      grupo.forEach((caso) => {
        caso.puntaje += 25;

        caso.observaciones.push(
          `Documento repetido en ${grupo.length} registros; verificar duplicidad.`,
        );

        caso.criticidad = this.criticidadDesdePuntaje(caso.puntaje);
      });
    });

    recibos.forEach((grupo) => {
      if (grupo.length < 2) {
        return;
      }

      grupo.forEach((caso) => {
        caso.puntaje += 25;

        caso.observaciones.push(
          `Número de recibo repetido en ${grupo.length} registros; verificar soporte.`,
        );

        caso.criticidad = this.criticidadDesdePuntaje(caso.puntaje);
      });
    });

    return casos;
  }

  /**
   * ============================================================
   * CRITICIDAD
   * ============================================================
   */

  private criticidadDesdePuntaje(puntaje: number): Criticidad {
    if (puntaje >= 90) {
      return 'Crítica';
    }

    if (puntaje >= 60) {
      return 'Alta';
    }

    if (puntaje >= 25) {
      return 'Media';
    }

    return 'Sin alerta';
  }

  /**
   * ============================================================
   * TIPO DOCUMENTO
   * ============================================================
   */

  private codigoTipoDocumento(tipo: string): number | null {
    const mapa: Record<string, number> = {
      cc: 3,
      ti: 2,
      ppt: 8,
      rc: 4,
    };

    return mapa[this.normalizar(tipo)] || null;
  }

  /**
   * ============================================================
   * MODAL SISBÉN
   * ============================================================
   */

  private mostrarResultadoSisben(
    caso: CasoAuditoria,

    grupo: any,

    rui: any,
  ): void {
    const diferencias: string[] = [];

    const grupoExcel = this.normalizar(caso.sisbenExcel);

    const grupoConsultado = this.normalizar(grupo?.grupo);

    if (!grupo?.ok) {
      diferencias.push(
        'El servicio SISBÉN no encontró una clasificación vigente para el documento.',
      );
    } else if (!grupoExcel || grupoExcel === 'noregistra') {
      diferencias.push(
        `El Excel no registra SISBÉN, pero el servicio devuelve ${grupo?.grupo}.`,
      );
    } else if (grupoExcel !== grupoConsultado) {
      diferencias.push(
        `Grupo diferente: Excel ${caso.sisbenExcel} / SISBÉN ${grupo?.grupo}.`,
      );
    }

    if (
      rui?.nombre &&
      this.normalizar(caso.nombre) !== this.normalizar(rui.nombre)
    ) {
      diferencias.push(
        'El nombre del Excel no coincide exactamente con el nombre del RUI.',
      );
    }

    if (
      grupo?.grupo &&
      rui?.grupRui &&
      String(grupo.grupo).charAt(0).toUpperCase() !==
        String(rui.grupRui).charAt(0).toUpperCase()
    ) {
      diferencias.push(
        `La categoría SISBÉN (${grupo.grupo}) y el grupo RUI (${rui.grupRui}) pertenecen a grupos distintos.`,
      );
    }

    const fila = (
      etiqueta: string,

      valor: any,
    ) =>
      `<div style="padding:8px 10px;border-bottom:1px solid #e6ece9">
          <small style="display:block;color:#718078">
            ${this.escaparHtml(etiqueta)}
          </small>
          <strong>
            ${this.escaparHtml(valor || 'NO REGISTRA')}
          </strong>
        </div>`;

    Swal.fire({
      title: 'Consulta SISBÉN y RUI',

      width: 900,

      confirmButtonText: 'Cerrar',

      confirmButtonColor: '#176f51',

      html: `<div style="text-align:left">

          <div style="
            padding:12px 14px;
            margin-bottom:14px;
            border-radius:10px;
            background:${diferencias.length ? '#fff3e8' : '#eaf7f0'}">

            <strong>
              ${
                diferencias.length
                  ? 'Se encontraron diferencias para revisión'
                  : 'Información consistente con el Excel'
              }
            </strong>

            ${
              diferencias.length
                ? `<ul style="margin:8px 0 0;padding-left:20px">
                    ${diferencias
                      .map((x) => `<li>${this.escaparHtml(x)}</li>`)
                      .join('')}
                   </ul>`
                : ''
            }

          </div>

          <div style="
            display:grid;
            grid-template-columns:repeat(3,1fr);
            gap:12px
          ">

            <section style="
              border:1px solid #dce6e1;
              border-radius:10px;
              overflow:hidden
            ">

              <h4 style="
                margin:0;
                padding:11px;
                background:#edf5f1
              ">
                Datos del Excel
              </h4>

              ${fila('Nombre', caso.nombre)}

              ${fila('Documento', `${caso.tipoDocumento} ${caso.documento}`)}

              ${fila('Estrato', caso.estrato)}

              ${fila('SISBÉN reportado', caso.sisbenExcel)}
              ${fila('Dirección', caso.direccion.direccion)}
              ${fila('Barrio / vereda', caso.direccion.barrio)}
              ${fila('Ciudad', caso.direccion.ciudad)}
              ${fila('Departamento', caso.direccion.departamento)}
              ${fila('Cruce geográfico', caso.cruceUbicacion.estado)}
              ${fila('Observaciones de ubicación', caso.cruceUbicacion.notas.join(' | '))}

            </section>

            <section style="
              border:1px solid #dce6e1;
              border-radius:10px;
              overflow:hidden
            ">

              <h4 style="
                margin:0;
                padding:11px;
                background:#edf5f1
              ">
                Servicio SISBÉN
              </h4>

              ${fila('Grupo', grupo?.grupo)}

              ${fila('Descripción', grupo?.descripcion)}

              ${fila('Municipio', grupo?.municipio)}

              ${fila('Departamento', grupo?.departamento)}
              ${fila('Dirección SISBÉN', caso.direccionSisben?.direccion || 'No informada por el servicio')}
              ${fila('Barrio SISBÉN', caso.direccionSisben?.barrio || 'No informado')}
              ${fila('Cruce de dirección', caso.cruceDireccionSisben.estado)}
              ${fila('Diferencias de dirección', caso.cruceDireccionSisben.notas.join(' | '))}

            </section>

            <section style="
              border:1px solid #dce6e1;
              border-radius:10px;
              overflow:hidden
            ">

              <h4 style="
                margin:0;
                padding:11px;
                background:#edf5f1
              ">
                Registro Único de Ingresos
              </h4>

              ${fila('Grupo de ingresos', rui?.grupoIngresos)}

              ${fila('Grupo RUI', rui?.grupRui)}

              ${fila('Nivel RUI', rui?.nivelRui)}

              ${fila('Nombre', rui?.nombre)}

              ${fila('Sexo', rui?.sexo)}

              ${fila('Edad', rui?.edad)}

              ${fila('Municipio', rui?.municipio)}

              ${fila('Departamento', rui?.departamento)}

              ${fila('Código municipio', rui?.codMpio)}

            </section>

          </div>

        </div>`,
    });
  }

  /**
   * ============================================================
   * ESCAPAR HTML
   * ============================================================
   */

  private escaparHtml(valor: any): string {
    return String(valor ?? '').replace(
      /[&<>'"]/g,

      (caracter) =>
        ({
          '&': '&amp;',

          '<': '&lt;',

          '>': '&gt;',

          "'": '&#39;',

          '"': '&quot;',
        })[caracter] || caracter,
    );
  }

  /**
   * ============================================================
   * NÚMEROS
   * ============================================================
   */

  private numero(valor: any): number {
    if (typeof valor === 'number') {
      return Number.isFinite(valor) ? valor : 0;
    }

    let texto = String(valor ?? '').replace(/[^0-9,.-]/g, '');

    if (texto.includes(',') && texto.includes('.')) {
      texto = texto.replace(/\./g, '').replace(',', '.');
    } else if (texto.includes(',')) {
      texto = texto.replace(',', '.');
    }

    const numero = Number(texto);

    return Number.isFinite(numero) ? numero : 0;
  }

  /**
   * ============================================================
   * NORMALIZAR
   * ============================================================
   */

  private normalizar(valor: any): string {
    return String(valor ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  }
}
