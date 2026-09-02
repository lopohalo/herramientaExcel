import { Component } from '@angular/core';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';
import * as XLSXStyle from 'xlsx-js-style';

GlobalWorkerOptions.workerSrc = 'assets/pdfjs/pdf.worker.min.js';

interface PdfAnalysis {
  archivo: Record<string, any>;
  documento: Record<string, any>;
  paginas: Record<string, any>;
  recursos: Record<string, any>;
  contenido: Record<string, any>;
  seguridad: Record<string, any>;
  metadatos: Record<string, any>;
}

@Component({
  selector: 'app-pdf-analyzer',
  templateUrl: './pdf-analyzer.component.html',
  styleUrls: ['./pdf-analyzer.component.scss'],
})
export class PdfAnalyzerComponent {
  analizando = false;
  error = '';
  resultado: PdfAnalysis | null = null;
  resultados: PdfAnalysis[] = [];
  progreso = '';
  progresoPorcentaje = 0;
  modoVariasCarpetas = false;
  resultadosPorCarpeta: Array<{ nombre: string; documentos: PdfAnalysis[] }> = [];
  private trabajadorOcr: any = null;

  async seleccionarArchivo(event: Event, variasCarpetas = false): Promise<void> {
    const input = event.target as HTMLInputElement;
    const seleccionados = Array.from(input.files || []);
    let archivos = seleccionados.filter(
      (archivo) => archivo.type === 'application/pdf' || archivo.name.toLowerCase().endsWith('.pdf')
    );
    if (!archivos.length) return;

    const agregarALote = variasCarpetas && this.modoVariasCarpetas && this.resultados.length > 0;
    if (agregarALote) {
      const existentes = new Set(this.resultados.map((pdf) =>
        `${pdf.archivo['rutaRelativa']}|${pdf.archivo['bytes']}`
      ));
      archivos = archivos.filter((archivo) => !existentes.has(
        `${(archivo as any).webkitRelativePath || archivo.name}|${archivo.size}`
      ));
      if (!archivos.length) {
        this.progreso = 'Esa carpeta ya estaba agregada al lote.';
        input.value = '';
        return;
      }
    }
    this.error = '';
    this.modoVariasCarpetas = variasCarpetas;
    if (!agregarALote) {
      this.resultado = null;
      this.resultados = [];
      this.resultadosPorCarpeta = [];
    }
    const ignorados = seleccionados.length - archivos.length;
    if (ignorados > 0) this.progreso = `${ignorados} archivo(s) no PDF serán ignorados.`;

    this.analizando = true;
    try {
      for (let indice = 0; indice < archivos.length; indice++) {
        const archivo = archivos[indice];
        this.progreso = `Procesando ${indice + 1} de ${archivos.length}: ${archivo.name}`;
        this.progresoPorcentaje = Math.round((indice / archivos.length) * 100);
        const buffer = await archivo.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        const contenidoBinario = new TextDecoder('latin1').decode(bytes);
        if (!contenidoBinario.startsWith('%PDF-')) {
          throw new Error(`${archivo.name} no contiene una cabecera PDF válida.`);
        }
        const resultado = await this.analizarPdf(archivo, bytes, contenidoBinario);
        this.resultados.push(resultado);
        console.group(`Análisis completo: ${archivo.name}`);
        console.log(resultado);
        console.log('Objeto JSON:', JSON.stringify(resultado, null, 2));
        console.groupEnd();
      }
      this.resultado = this.resultados[0] || null;
      this.resultadosPorCarpeta = Array.from(this.agruparPorExpediente(this.resultados).entries()).map(
        ([nombre, documentos]) => ({ nombre, documentos })
      );
      this.progresoPorcentaje = 100;
      this.progreso = `${this.resultados.length} archivo(s) procesado(s) en ${this.resultadosPorCarpeta.length} carpeta(s)`;
      console.log('Resultado conjunto de PDFs:', this.resultados);
    } catch (error: any) {
      this.error = error?.message || 'No fue posible analizar el PDF.';
      console.error('Error analizando PDF:', error);
    } finally {
      if (this.trabajadorOcr) {
        await this.trabajadorOcr.terminate();
        this.trabajadorOcr = null;
      }
      this.analizando = false;
      input.value = '';
    }
  }

  private async analizarPdf(
    archivo: File,
    bytes: Uint8Array,
    pdf: string
  ): Promise<PdfAnalysis> {
    const coincidencias = (expresion: RegExp): RegExpMatchArray[] =>
      Array.from(pdf.matchAll(expresion));
    const valoresUnicos = (expresion: RegExp, grupo = 1): string[] =>
      [...new Set(coincidencias(expresion).map((item) => item[grupo]?.trim()).filter(Boolean))];
    const paginaObjetos = coincidencias(/\/Type\s*\/Page(?!s)\b/g).length;
    const conteosArbol = valoresUnicos(/\/Count\s+(\d+)/g).map(Number);
    const totalPaginas = Math.max(paginaObjetos, ...conteosArbol, 0);
    const cajas = valoresUnicos(/\/MediaBox\s*\[([^\]]+)\]/g);
    const dimensiones = cajas.map((caja) => this.interpretarCaja(caja));
    const textos = this.extraerTextosSimples(pdf);
    const fuentes = coincidencias(/\/Type\s*\/Font\b/g).length;
    const imagenes = coincidencias(/\/Subtype\s*\/Image\b/g).length;
    const operadoresTexto = /(?:^|\s)BT(?:\s|$)[\s\S]*?(?:^|\s)ET(?:\s|$)/m.test(pdf);
    const tieneTextoDetectable = textos.length > 0 || fuentes > 0 || operadoresTexto;

    const extraccion = await this.extraerContenidoCompleto(bytes, archivo.name);
    const textoCompleto = extraccion.paginas.map((pagina: any) => pagina.texto).join('\n\n');
    const camposDetectados = this.detectarCampos(textoCompleto);

    return {
      archivo: {
        nombre: archivo.name,
        rutaRelativa: (archivo as any).webkitRelativePath || archivo.name,
        extension: archivo.name.split('.').pop()?.toLowerCase(),
        tipoMime: archivo.type || 'desconocido',
        bytes: archivo.size,
        kilobytes: Number((archivo.size / 1024).toFixed(2)),
        megabytes: Number((archivo.size / 1024 / 1024).toFixed(3)),
        ultimaModificacion: new Date(archivo.lastModified).toISOString(),
        sha256: await this.calcularSha256(bytes),
      },
      documento: {
        versionPdf: pdf.match(/%PDF-([\d.]+)/)?.[1] || null,
        encabezadoValido: pdf.startsWith('%PDF-'),
        estaLinearizado: /\/Linearized\b/.test(pdf),
        estaEtiquetado: /\/Marked\s+true\b/.test(pdf),
        productorEstructural: this.valorLiteral(pdf, 'Producer'),
      },
      paginas: {
        total: totalPaginas,
        objetosPaginaDetectados: paginaObjetos,
        conteosArbolPaginas: conteosArbol,
        cajasPagina: cajas,
        dimensiones,
      },
      recursos: {
        imagenesDetectadas: imagenes,
        fuentesDetectadas: fuentes,
        formularios: /\/AcroForm\b/.test(pdf),
        firmasDigitalesDeclaradas: coincidencias(/\/Type\s*\/Sig\b/g).length,
        archivosAdjuntos: /\/EmbeddedFiles\b/.test(pdf),
        filtrosCompresion: valoresUnicos(/\/Filter\s*\/?([A-Za-z0-9]+)/g),
        flujosDeObjetos: coincidencias(/\/Type\s*\/ObjStm\b/g).length,
      },
      contenido: {
        tieneSeñalesDeTexto: tieneTextoDetectable || textoCompleto.trim().length > 0,
        operadoresTextoDetectados: operadoresTexto,
        fragmentosTextoSimple: textos.slice(0, 200),
        cantidadFragmentos: textos.length,
        pareceEscaneado: extraccion.paginas.some((pagina: any) => pagina.metodo === 'OCR'),
        recomiendaOcr: extraccion.paginas.some((pagina: any) => pagina.metodo === 'OCR'),
        textoCompleto,
        paginas: extraccion.paginas,
        camposDetectados,
        observacion: textos.length
          ? 'Se encontraron fragmentos sin descomprimir. Para extracción completa conviene usar un motor PDF.'
          : 'No se encontró texto simple. El contenido puede estar comprimido o ser un escaneo y requerir OCR.',
      },
      seguridad: {
        cifrado: /\/Encrypt\b/.test(pdf),
        contieneJavaScript: /\/JavaScript\b|\/JS\b/.test(pdf),
        contieneAccionesDeApertura: /\/OpenAction\b/.test(pdf),
      },
      metadatos: {
        titulo: this.valorLiteral(pdf, 'Title'),
        autor: this.valorLiteral(pdf, 'Author'),
        asunto: this.valorLiteral(pdf, 'Subject'),
        palabrasClave: this.valorLiteral(pdf, 'Keywords'),
        creador: this.valorLiteral(pdf, 'Creator'),
        productor: this.valorLiteral(pdf, 'Producer'),
        fechaCreacion: this.valorLiteral(pdf, 'CreationDate'),
        fechaModificacion: this.valorLiteral(pdf, 'ModDate'),
      },
    };
  }

  exportarInventarioArchivistico(): void {
    if (!this.resultados.length || this.analizando) return;
    const grupos = this.modoVariasCarpetas
      ? this.agruparPorExpediente(this.resultados)
      : new Map<string, PdfAnalysis[]>([['seleccion_actual', this.resultados]]);
    if (this.modoVariasCarpetas && grupos.size > 1) {
      this.generarInventarioConsolidado(grupos);
      return;
    }
    const [nombreCarpeta, documentos] = Array.from(grupos.entries())[0];
    this.generarInventarioExpediente(documentos, nombreCarpeta);
  }

  private generarInventarioExpediente(documentosGrupo: PdfAnalysis[], nombreCarpeta: string): void {
    const documentos = [...documentosGrupo].sort(
      (a, b) => this.ordenArchivo(a.archivo['nombre']) - this.ordenArchivo(b.archivo['nombre'])
    );
    let paginaAcumulada = 1;
    let fechaAnterior: string | null = null;
    const filasDocumentales = documentos.map((pdf, indice) => {
      const nombre = String(pdf.archivo['nombre'] || '');
      const totalPaginas = Number(pdf.paginas['total']) ||
        Number(pdf.contenido['paginas']?.length) || 0;
      const paginaInicio = paginaAcumulada;
      const paginaFin = totalPaginas ? paginaInicio + totalPaginas - 1 : paginaInicio;
      paginaAcumulada = paginaFin + 1;
      const fechaDirecta = this.fechaDesdeNombre(nombre);
      const fecha = fechaDirecta || fechaAnterior;
      if (fechaDirecta) fechaAnterior = fechaDirecta;
      const codigoCalidad = nombre.match(/\b(F[A-Z]{1,3}[._-]?\d+(?:\.\d+)?)\b/i)?.[1]
        ?.replace('_', '.') || null;
      return [
        nombre,
        this.nombreDocumentoDesdeArchivo(nombre),
        this.clasificarTipologia(nombre),
        fecha,
        fecha,
        this.ordenArchivo(nombre) || indice + 1,
        paginaInicio,
        paginaFin,
        'Electrónico',
        'Pública',
        'Español',
        this.autorDetectado(pdf),
        codigoCalidad,
        null,
        fecha ? fecha.slice(0, 4) : null,
        null,
        null,
      ];
    });

    const expediente = this.construirMetadatosExpediente(documentos, paginaAcumulada - 1);
    const encabezadosExpediente = [
      'Código unidad', 'Nombre unidad', 'Código serie', 'Nombre serie',
      'Código subserie', 'Nombre subserie', 'Nombre del expediente',
      'Descripción del contenido 1', 'Descripción del contenido 2',
      'Descripción del contenido 3', 'Fecha cierre expediente',
      'Orden de expediente', 'Total páginas', 'Objeto inventario',
      'Fecha inicial', 'Fecha final', 'Frecuencia consulta', 'Soporte',
      'Nombre responsable entrega', 'Cargo responsable Entrega', 'Fecha entrega',
      'Nombre responsable recibido', 'Cargo responsable recibido', 'Fecha de recibido',
      'Nombre unidad que recibe', 'Tipo de expediente', 'Acceso', 'Observaciones',
    ];
    const encabezadosDocumentos = [
      'Nombre del archivo', 'Nombre del documento', 'Tipología documental',
      'Fecha de creación del documento', 'Fecha incorporación expediente',
      'Orden documento expediente', 'Página inicio', 'Página fin', 'Origen',
      'Acceso', 'Idioma', 'Autor', 'Código calidad', 'Numero', 'Año',
      'Metadato 1', 'Metadato 2',
    ];
    const listas = this.construirListasArchivisticas();
    const persona = String(expediente[8] || '').replace(/^Nombre\s+/i, '').trim() || 'Contratista no identificado';
    const tituloContratista = `CONTRATISTA: ${persona}`;
    const libro = XLSXStyle.utils.book_new();
    const hojaExpediente = XLSXStyle.utils.aoa_to_sheet([encabezadosExpediente, expediente]);
    const hojaDocumentos = XLSXStyle.utils.aoa_to_sheet([[tituloContratista], encabezadosDocumentos, ...filasDocumentales]);
    const hojaListas = XLSXStyle.utils.aoa_to_sheet([[tituloContratista], ...listas]);
    hojaDocumentos['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }];
    hojaListas['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }];
    this.estilizarHoja(hojaExpediente, encabezadosExpediente.length, 2, 24);
    this.estilizarHoja(hojaDocumentos, encabezadosDocumentos.length, filasDocumentales.length + 2, 25, 1, tituloContratista);
    this.estilizarHoja(hojaListas, 7, listas.length + 1, 24, 1, tituloContratista);
    XLSXStyle.utils.book_append_sheet(libro, hojaExpediente, 'metadatos_expediente');
    XLSXStyle.utils.book_append_sheet(libro, hojaDocumentos, 'metadatos_tipos_documentales');
    XLSXStyle.utils.book_append_sheet(libro, hojaListas, 'Listas');
    const nombreExpediente = String(expediente[6] || nombreCarpeta || 'inventario_expediente').replace(/[^\w.-]+/g, '_');
    XLSXStyle.writeFile(libro, `${nombreExpediente}.xlsx`, { bookType: 'xlsx' });
  }

  private generarInventarioConsolidado(grupos: Map<string, PdfAnalysis[]>): void {
    const encabezadosExpediente = [
      'Código unidad', 'Nombre unidad', 'Código serie', 'Nombre serie', 'Código subserie',
      'Nombre subserie', 'Nombre del expediente', 'Descripción del contenido 1',
      'Descripción del contenido 2', 'Descripción del contenido 3', 'Fecha cierre expediente',
      'Orden de expediente', 'Total páginas', 'Objeto inventario', 'Fecha inicial', 'Fecha final',
      'Frecuencia consulta', 'Soporte', 'Nombre responsable entrega', 'Cargo responsable Entrega',
      'Fecha entrega', 'Nombre responsable recibido', 'Cargo responsable recibido',
      'Fecha de recibido', 'Nombre unidad que recibe', 'Tipo de expediente', 'Acceso', 'Observaciones',
    ];
    const encabezadosDocumentos = [
      'Nombre del archivo', 'Nombre del documento', 'Tipología documental',
      'Fecha de creación del documento', 'Fecha incorporación expediente',
      'Orden documento expediente', 'Página inicio', 'Página fin', 'Origen', 'Acceso',
      'Idioma', 'Autor', 'Código calidad', 'Numero', 'Año', 'Metadato 1', 'Metadato 2',
    ];
    const filasExpedientes: any[][] = [];
    const filasDocumentos: any[][] = [];
    const filasListas: any[][] = [];
    const mergesDocumentos: any[] = [];
    const mergesListas: any[] = [];
    const encabezadosDocumentales: number[] = [];
    const encabezadosListas: number[] = [];
    const titulosDocumentales: number[] = [];
    const titulosListas: number[] = [];

    Array.from(grupos.entries()).forEach(([nombreCarpeta, documentosGrupo]) => {
      const documentos = [...documentosGrupo].sort(
        (a, b) => this.ordenArchivo(a.archivo['nombre']) - this.ordenArchivo(b.archivo['nombre'])
      );
      let paginaAcumulada = 1;
      let fechaAnterior: string | null = null;
      const detalle = documentos.map((pdf, indice) => {
        const nombre = String(pdf.archivo['nombre'] || '');
        const totalPaginas = Number(pdf.paginas['total']) || Number(pdf.contenido['paginas']?.length) || 0;
        const paginaInicio = paginaAcumulada;
        const paginaFin = totalPaginas ? paginaInicio + totalPaginas - 1 : paginaInicio;
        paginaAcumulada = paginaFin + 1;
        const fechaDirecta = this.fechaDesdeNombre(nombre);
        const fecha = fechaDirecta || fechaAnterior;
        if (fechaDirecta) fechaAnterior = fechaDirecta;
        const codigoCalidad = nombre.match(/\b(F[A-Z]{1,3}[._-]?\d+(?:\.\d+)?)\b/i)?.[1]?.replace('_', '.') || null;
        return [nombre, this.nombreDocumentoDesdeArchivo(nombre), this.clasificarTipologia(nombre), fecha, fecha,
          this.ordenArchivo(nombre) || indice + 1, paginaInicio, paginaFin, 'Electrónico', 'Pública',
          'Español', this.autorDetectado(pdf), codigoCalidad, null, fecha ? fecha.slice(0, 4) : null, null, null];
      });
      const expediente = this.construirMetadatosExpediente(documentos, paginaAcumulada - 1);
      filasExpedientes.push(expediente);
      const persona = String(expediente[8] || '').replace(/^Nombre\s+/i, '').trim() || 'Contratista no identificado';
      const titulo = `CONTRATISTA: ${persona} — EXPEDIENTE: ${nombreCarpeta}`;

      const filaTituloDocumento = filasDocumentos.length;
      titulosDocumentales.push(filaTituloDocumento);
      filasDocumentos.push([titulo]);
      mergesDocumentos.push({ s: { r: filaTituloDocumento, c: 0 }, e: { r: filaTituloDocumento, c: 5 } });
      encabezadosDocumentales.push(filasDocumentos.length);
      filasDocumentos.push(encabezadosDocumentos, ...detalle, []);

      const lista = this.construirListasArchivisticas();
      const filaTituloLista = filasListas.length;
      titulosListas.push(filaTituloLista);
      filasListas.push([titulo]);
      mergesListas.push({ s: { r: filaTituloLista, c: 0 }, e: { r: filaTituloLista, c: 5 } });
      encabezadosListas.push(filasListas.length);
      filasListas.push(['Frecuencia consulta', 'Soporte', 'Tipo expediente', 'Acceso', 'Tipología', 'Origen', 'Idioma'], ...lista, []);
    });

    const libro = XLSXStyle.utils.book_new();
    const hojaExpediente = XLSXStyle.utils.aoa_to_sheet([encabezadosExpediente, ...filasExpedientes]);
    const hojaDocumentos = XLSXStyle.utils.aoa_to_sheet(filasDocumentos);
    const hojaListas = XLSXStyle.utils.aoa_to_sheet(filasListas);
    hojaDocumentos['!merges'] = mergesDocumentos;
    hojaListas['!merges'] = mergesListas;
    this.estilizarHoja(hojaExpediente, encabezadosExpediente.length, filasExpedientes.length + 1, 24);
    hojaDocumentos['!cols'] = Array.from({ length: encabezadosDocumentos.length }, () => ({ wch: 25 }));
    hojaListas['!cols'] = Array.from({ length: 7 }, () => ({ wch: 24 }));
    titulosDocumentales.forEach((fila) => this.estilizarFilaTitulo(hojaDocumentos, fila));
    titulosListas.forEach((fila) => this.estilizarFilaTitulo(hojaListas, fila));
    encabezadosDocumentales.forEach((fila) => this.estilizarFilaEncabezado(hojaDocumentos, fila, encabezadosDocumentos.length));
    encabezadosListas.forEach((fila) => this.estilizarFilaEncabezado(hojaListas, fila, 7));
    XLSXStyle.utils.book_append_sheet(libro, hojaExpediente, 'metadatos_expediente');
    XLSXStyle.utils.book_append_sheet(libro, hojaDocumentos, 'metadatos_tipos_documentales');
    XLSXStyle.utils.book_append_sheet(libro, hojaListas, 'Listas');
    XLSXStyle.writeFile(libro, `inventario_consolidado_${grupos.size}_contratos.xlsx`, { bookType: 'xlsx' });
  }

  private estilizarFilaTitulo(hoja: any, fila: number): void {
    const celda = hoja[XLSXStyle.utils.encode_cell({ r: fila, c: 0 })];
    if (!celda) return;
    celda.s = {
      font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 13 },
      fill: { fgColor: { rgb: '174A35' } },
      alignment: { horizontal: 'left', vertical: 'center' },
    };
    hoja['!rows'] = hoja['!rows'] || [];
    hoja['!rows'][fila] = { hpt: 26 };
  }

  private estilizarFilaEncabezado(hoja: any, fila: number, columnas: number): void {
    for (let columna = 0; columna < columnas; columna++) {
      const celda = hoja[XLSXStyle.utils.encode_cell({ r: fila, c: columna })];
      if (celda) celda.s = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '176B55' } },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      };
    }
  }

  private agruparPorExpediente(documentos: PdfAnalysis[]): Map<string, PdfAnalysis[]> {
    const grupos = new Map<string, PdfAnalysis[]>();
    documentos.forEach((pdf) => {
      const ruta = String(pdf.archivo['rutaRelativa'] || pdf.archivo['nombre'] || '');
      const segmentos = ruta.split(/[\\/]/).filter(Boolean);
      // webkitRelativePath tiene la forma carpetaMadre/contrato/archivo.pdf.
      // En modo lote se debe separar por el hijo directo de la carpeta madre,
      // incluso cuando la propia carpeta madre parece tener código de contrato.
      const carpetaContrato = this.modoVariasCarpetas
        ? (segmentos.length >= 3 ? segmentos[1] : segmentos.length >= 2 ? segmentos[0] : 'seleccion_manual')
        : (segmentos.find((segmento) => /^\d{6,}_\d{2,6}$/i.test(segmento)) ||
          (segmentos.length >= 2 ? segmentos[0] : 'seleccion_manual'));
      if (!grupos.has(carpetaContrato)) grupos.set(carpetaContrato, []);
      grupos.get(carpetaContrato)!.push(pdf);
    });
    return grupos;
  }

  private construirMetadatosExpediente(documentos: PdfAnalysis[], totalPaginas: number): any[] {
    const todosLosTextos = documentos.map((pdf) => String(pdf.contenido['textoCompleto'] || '')).join('\n');
    const documentoFocal = (codigo: string): PdfAnalysis | undefined => documentos.find(
      (pdf) => new RegExp(`FCO[._\\s-]*${codigo}\\b`, 'i').test(
        `${pdf.archivo['nombre']} ${pdf.contenido['textoCompleto'] || ''}`
      )
    );
    const texto55 = String(documentoFocal('55')?.contenido['textoCompleto'] || '');
    const texto66 = String(documentoFocal('66')?.contenido['textoCompleto'] || '');
    const texto67 = String(documentoFocal('67')?.contenido['textoCompleto'] || '');
    const texto70 = String(documentoFocal('70')?.contenido['textoCompleto'] || '');
    const textosPrioritarios = [texto55, texto66, texto67, texto70].filter(Boolean).join('\n');
    const buscar = (texto: string, expresion: RegExp): string =>
      (texto.match(expresion)?.[1] || '').replace(/\s+/g, ' ').trim();
    const soloDigitos = (valor: string): string => valor.replace(/\D/g, '');
    const fechaNumerica = (texto: string, etiqueta: string): string => {
      const patron = new RegExp(`${etiqueta}[\\s\\S]{0,90}?D[ií]a(?:/Mes/Año)?\\s*(\\d{1,2})\\s*(?:Mes\\s*)?(\\d{1,2})\\s*(?:Año\\s*)?(\\d{4})`, 'i');
      const partes = texto.match(patron);
      return partes ? `${partes[3]}${partes[2].padStart(2, '0')}${partes[1].padStart(2, '0')}` : '';
    };
    const moneda = (texto: string, etiqueta: string): number | null => {
      const valor = buscar(texto, new RegExp(`${etiqueta}\\s*\\$?\\s*([\\d.,]+)`, 'i'));
      const numero = Number(valor.replace(/\D/g, ''));
      return valor && Number.isFinite(numero) ? numero : null;
    };
    const rutas = documentos.map((pdf) => String(pdf.archivo['rutaRelativa'] || ''));
    const expedienteRuta = rutas.flatMap((ruta) => ruta.split(/[\\/]/))
      .find((valor) => /^\d{6,}_\d{2,6}$/i.test(valor));
    const contrato = textosPrioritarios.match(/\b(20\d{8})\b/)?.[1] ||
      todosLosTextos.match(/\b(20\d{8})\b/)?.[1] ||
      expedienteRuta?.match(/\d{6,}/)?.[0] || '';
    const centroCosto = buscar(texto55, /Centro\s+de\s+Costo\s+(\d{3,6})/i);
    const unidad = centroCosto || expedienteRuta?.match(/_(\d{3,5})\b/)?.[1] || '';
    const nombreUnidad = buscar(texto55, /Proyecto\s+(.+?)\s+Centro\s+de\s+Costo/i);
    const cedula = soloDigitos(
      buscar(`${texto55}\n${texto66}\n${texto67}`, /(?:Identificaci[oó]n|C\.C\.\s*o\s*Nit\.)\s*([\d.]+)/i)
    );
    const contratista = buscar(texto55, /Nombre\s+o\s+Raz[oó]n\s+Social\s+(.+?)\s+Identificaci[oó]n/i) ||
      buscar(`${texto66}\n${texto67}`, /Nombre\s+Completo\s+(Willman.+?)\s+(?:Cargo|C\.C\.)/i) ||
      buscar(texto70, /([A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚÑáéíóúñ ]{8,80})\s+Proveedor/i);
    const valorEjecutado = moneda(`${texto66}\n${texto67}`, 'VALOR\\s+TOTAL\\s+EJECUTADO');
    const valorInicial = moneda(`${texto55}\n${texto66}\n${texto67}`, '(?:Valor\\s+del\\s+Contrato|VALOR\\s+INICIAL)');
    const valorContrato = valorEjecutado ?? valorInicial;
    const objeto = buscar(texto55, /Objeto\s+del\s+Contrato\s+([\s\S]{20,700}?)\s+Valor\s+del\s+Contrato/i) ||
      buscar(`${texto66}\n${texto67}`, /OBJETO\s+([\s\S]{20,700}?)\s+FECHA\s+DE/i);
    const fechaInicio = fechaNumerica(texto66, 'FECHA\\s+DE\\s+INICIO\\s+DEL\\s+CONTRATO') ||
      buscar(texto67, /FECHA\s+DE\s+INICIO[\s\S]{0,50}?(\d{1,2}\s+Febrero\s+\d{4})/i);
    const fechaFinal = fechaNumerica(texto66, 'FECHA\\s+TERMINACI[ÓO]N\\s+DEL\\s+CONTRATO') ||
      buscar(texto67, /FECHA\s+DE\s+TERMINACI[ÓO]N[\s\S]{0,50}?(\d{1,2}\s+Julio\s+\d{4})/i);
    const fechaCierre = fechaNumerica(texto66, 'FECHA\\s+DEL\\s+ACTA') ||
      this.fechaTextoACompacta(buscar(texto67, /FECHA\s+DEL\s+ACTA:\s*Bucaramanga\s+([^\n]+)/i));
    const responsableEntrega = buscar(`${texto66}\n${texto67}`, /(Efra[ií]n\s+Alberto\s+Sanmiguel\s+Acevedo)/i);
    const cargoEntrega = responsableEntrega ? 'Jefe División Financiera' : '';
    const fechas = documentos.map((pdf) => this.fechaDesdeNombre(pdf.archivo['nombre'])).filter(Boolean) as string[];
    fechas.sort();
    const nombreExpediente = expedienteRuta || [contrato, unidad].filter(Boolean).join('_') || 'expediente_contratos';
    return [
      unidad, nombreUnidad, 'C09', 'Contratos', 'C09.06', 'Contrato de Prestación de Servicios',
      nombreExpediente, cedula ? `CC ${cedula}` : '', contratista ? `Nombre ${contratista}` : '',
      valorContrato !== null ? `Valor contrato $ ${Number(valorContrato).toLocaleString('es-CO')}` : '',
      fechaCierre || fechaFinal || fechas.at(-1) || '', '', totalPaginas, 'Inventario Archivo de Gestión',
      this.fechaTextoACompacta(fechaInicio) || fechaInicio || fechas[0] || '',
      this.fechaTextoACompacta(fechaFinal) || fechaFinal || fechas.at(-1) || '',
      'Media', 'Electrónico', responsableEntrega, cargoEntrega, '', '', '', '', '',
      'Electrónico', 'Pública',
      `Datos contractuales priorizados desde FCO.55, FCO.66, FCO.67 y FCO.70. Objeto detectado: ${objeto || 'pendiente de revisión'}`,
    ];
  }

  private fechaTextoACompacta(valor: string): string {
    if (!valor) return '';
    if (/^\d{8}$/.test(valor)) return valor;
    const meses: Record<string, string> = {
      enero: '01', febrero: '02', marzo: '03', abril: '04', mayo: '05', junio: '06',
      julio: '07', agosto: '08', septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12',
    };
    const partes = valor.toLowerCase().match(/(\d{1,2})\s+(?:de\s+)?([a-záéíóúñ]+)\s+(?:de\s+)?(\d{4})/i);
    if (!partes) return '';
    const mes = meses[partes[2].normalize('NFD').replace(/[\u0300-\u036f]/g, '')];
    return mes ? `${partes[3]}${mes}${partes[1].padStart(2, '0')}` : '';
  }

  private construirListasArchivisticas(): any[][] {
    const tipologias = [
      'Acta', 'Acuerdo', 'Anexo', 'Auto', 'Autorización', 'Certificado',
      'Circular', 'Citación', 'Comunicación', 'Comunicación Oficial Despachada',
      'Comunicación Oficial Recibida', 'Concepto', 'Consentimiento Informado',
      'Contrato', 'Convenio', 'Correo Electrónico', 'Documento Contractual',
      'Documento Financiero o Contable', 'Documento Identificación', 'Informe',
      'Instrumento de Control o Revisión', 'Soporte',
    ];
    const filas = Math.max(3, tipologias.length);
    return Array.from({ length: filas }, (_x, indice) => [
      ['Alta', 'Media', 'Baja'][indice] || null,
      ['Electrónico'][indice] || null,
      ['Híbrido', 'Electrónico', 'Físico'][indice] || null,
      ['Pública', 'Clasificada', 'Reservada'][indice] || null,
      tipologias[indice] || null,
      ['Electrónico', 'Digitalizado', 'Físico'][indice] || null,
      ['Español', 'Inglés'][indice] || null,
    ]);
  }

  private estilizarHoja(
    hoja: any,
    columnas: number,
    filas: number,
    ancho: number,
    filaEncabezado = 0,
    titulo = ''
  ): void {
    hoja['!cols'] = Array.from({ length: columnas }, () => ({ wch: ancho }));
    const numeroFilaEncabezado = filaEncabezado + 1;
    hoja['!autofilter'] = { ref: `A${numeroFilaEncabezado}:${XLSXStyle.utils.encode_col(columnas - 1)}${filas}` };
    hoja['!freeze'] = { xSplit: 0, ySplit: filaEncabezado + 1, topLeftCell: `A${filaEncabezado + 2}` };
    if (titulo && hoja['A1']) {
      hoja['A1'].s = {
        font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 14 },
        fill: { fgColor: { rgb: '174A35' } },
        alignment: { horizontal: 'left', vertical: 'center' },
      };
      hoja['!rows'] = [{ hpt: 28 }];
    }
    for (let columna = 0; columna < columnas; columna++) {
      const celda = hoja[XLSXStyle.utils.encode_cell({ r: filaEncabezado, c: columna })];
      if (celda) celda.s = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '176B55' } },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
        border: { bottom: { style: 'thin', color: { rgb: 'D4E3DC' } } },
      };
    }
  }

  private ordenArchivo(nombre: string): number {
    return Number(nombre.match(/^(\d{1,6})/)?.[1]) || 0;
  }

  private fechaDesdeNombre(nombre: string): string | null {
    const fecha = nombre.match(/(?:^|_)((?:19|20)\d{6})(?:_|\.)/)?.[1];
    return fecha || null;
  }

  private nombreDocumentoDesdeArchivo(nombre: string): string {
    return nombre.replace(/\.pdf$/i, '').replace(/^\d+_/, '')
      .replace(/^(?:19|20)\d{6}_/, '').replace(/F[A-Z]{1,3}[._-]?\d+(?:\.\d+)?_/i, '')
      .replace(/_+/g, ' ').trim();
  }

  private clasificarTipologia(nombre: string): string {
    const valor = nombre.toLowerCase();
    if (valor.includes('acta')) return 'Acta';
    if (valor.includes('contrato')) return 'Contrato';
    if (valor.includes('convenio') || valor.includes('minuta')) return 'Convenio';
    if (valor.includes('informe')) return 'Informe';
    if (valor.includes('certifica')) return 'Certificado';
    if (valor.includes('correo') || valor.includes('carta') || valor.includes('designacion')) return 'Comunicación';
    if (valor.includes('lista') || valor.includes('verificacion') || valor.includes('evaluacion')) return 'Instrumento de Control o Revisión';
    if (valor.includes('anexo')) return 'Anexo';
    return 'Soporte';
  }

  private autorDetectado(pdf: PdfAnalysis): string | null {
    return pdf.metadatos['autor'] || null;
  }

  private async extraerContenidoCompleto(
    bytes: Uint8Array,
    nombreArchivo: string
  ): Promise<{ paginas: any[] }> {
    const documento: any = await getDocument({ data: bytes.slice() }).promise;
    const paginas: any[] = [];

    for (let numero = 1; numero <= documento.numPages; numero++) {
      this.progreso = `${nombreArchivo}: leyendo página ${numero} de ${documento.numPages}`;
      const pagina: any = await documento.getPage(numero);
      const contenido: any = await pagina.getTextContent();
      const textoDigital = contenido.items
        .map((item: any) => `${item.str || ''}${item.hasEOL ? '\n' : ' '}`)
        .join('')
        .replace(/[ \t]+/g, ' ')
        .replace(/ *\n */g, '\n')
        .trim();

      let texto = textoDigital;
      let metodo = 'texto PDF';
      let confianza: number | null = textoDigital.length ? 100 : null;

      if (textoDigital.replace(/\s/g, '').length < 20) {
        try {
          this.progreso = `${nombreArchivo}: aplicando OCR a página ${numero} de ${documento.numPages}`;
          const resultadoOcr = await this.aplicarOcr(pagina);
          if (resultadoOcr.texto.trim()) {
            texto = resultadoOcr.texto.trim();
            metodo = 'OCR';
            confianza = resultadoOcr.confianza;
          }
        } catch (error: any) {
          metodo = 'OCR no disponible';
          texto = textoDigital;
          console.warn(`No se pudo aplicar OCR en ${nombreArchivo}, página ${numero}:`, error);
        }
      }

      const vista = pagina.getViewport({ scale: 1 });
      paginas.push({
        numero,
        metodo,
        confianza,
        caracteres: texto.length,
        palabras: texto ? texto.split(/\s+/).filter(Boolean).length : 0,
        anchoPuntos: Number(vista.width.toFixed(2)),
        altoPuntos: Number(vista.height.toFixed(2)),
        texto,
      });
    }
    await documento.destroy();
    return { paginas };
  }

  private async aplicarOcr(pagina: any): Promise<{ texto: string; confianza: number }> {
    const viewport = pagina.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const contexto = canvas.getContext('2d', { willReadFrequently: true });
    if (!contexto) throw new Error('El navegador no permitió crear el lienzo para OCR.');
    await pagina.render({ canvasContext: contexto, viewport }).promise;

    if (!this.trabajadorOcr) {
      this.trabajadorOcr = await createWorker('spa', 1, {
        workerPath: 'assets/tesseract/worker.min.js',
        corePath: 'assets/tesseract/core',
        langPath: 'assets/tesseract/lang',
        logger: (mensaje: any) => {
          if (typeof mensaje.progress === 'number') {
            this.progresoPorcentaje = Math.round(mensaje.progress * 100);
          }
        },
      });
    }
    const reconocimiento = await this.trabajadorOcr.recognize(canvas);
    canvas.width = 0;
    canvas.height = 0;
    return {
      texto: reconocimiento.data.text || '',
      confianza: Number((reconocimiento.data.confidence || 0).toFixed(2)),
    };
  }

  private detectarCampos(texto: string): Record<string, any> {
    const limpiar = (valor: string | undefined): string | null =>
      valor ? valor.replace(/\s+/g, ' ').trim() : null;
    const coincidencias = (expresion: RegExp): string[] =>
      [...new Set(Array.from(texto.matchAll(expresion)).map((item) => limpiar(item[0])).filter(Boolean) as string[])];
    const buscar = (expresion: RegExp): string | null => limpiar(texto.match(expresion)?.[1]);
    const monedaNumero = (valor: string | null): number | null => {
      if (!valor) return null;
      const limpio = valor.replace(/[^\d,-]/g, '').replace(/\./g, '').replace(',', '.');
      const numero = Number(limpio);
      return Number.isFinite(numero) ? numero : null;
    };

    const valorInicialTexto = buscar(/VALOR\s+INICIAL\s*:?[ \t]*\$?[ \t]*([\d.,]+)/i);
    const valorAdicionalTexto = buscar(/VALOR\s+ADICIONAL\s*:?[ \t]*\$?[ \t]*([\d.,]+)/i);
    const valorContratadoTexto = buscar(/VALOR\s+TOTAL\s+CONTRATADO\s*:?[ \t]*\$?[ \t]*([\d.,]+)/i);
    const valorEjecutadoTexto = buscar(/VALOR\s+TOTAL\s+EJECUTADO\s*:?[ \t]*\$?[ \t]*([\d.,]+)/i);

    return {
      contrato: buscar(/(?:CONTRATO|CONTRACTUAL)\s*:?[ \t]*([A-Z0-9][A-Z0-9._\/-]*(?:\s+DE\s+\d{4})?)/i),
      objetoContrato: buscar(/OBJETO\s*:?[ \t]*([^\n]{8,500})/i),
      valorInicial: monedaNumero(valorInicialTexto),
      valorInicialTexto,
      valorAdicional: monedaNumero(valorAdicionalTexto),
      valorTotalContratado: monedaNumero(valorContratadoTexto),
      valorTotalEjecutado: monedaNumero(valorEjecutadoTexto),
      plazoInicial: buscar(/PLAZO\s+INICIAL\s*:?[ \t]*([^\n]+)/i),
      correos: coincidencias(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi),
      valoresMonetariosEncontrados: coincidencias(/\$\s*\d{1,3}(?:[.,]\d{3})+(?:[.,]\d{1,2})?/g),
      fechasEncontradas: coincidencias(/\b(?:\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}|\d{4}[\/-]\d{1,2}[\/-]\d{1,2})\b/g),
      posiblesDocumentos: coincidencias(/\b\d{6,12}\b/g),
      posiblesNit: coincidencias(/\b\d{3}(?:\.\d{3}){2}-\d\b/g),
      etiquetasConValor: Array.from(texto.matchAll(/^\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ0-9 /()._-]{2,50})\s*:\s*(.+)$/gim))
        .slice(0, 100)
        .map((item) => ({ etiqueta: limpiar(item[1]), valor: limpiar(item[2]) })),
    };
  }

  private interpretarCaja(caja: string): Record<string, any> {
    const numeros = caja.split(/\s+/).map(Number).filter(Number.isFinite);
    const ancho = numeros.length >= 4 ? Math.abs(numeros[2] - numeros[0]) : null;
    const alto = numeros.length >= 4 ? Math.abs(numeros[3] - numeros[1]) : null;
    return {
      puntos: caja,
      ancho,
      alto,
      pulgadas: ancho && alto ? { ancho: Number((ancho / 72).toFixed(2)), alto: Number((alto / 72).toFixed(2)) } : null,
      orientacion: ancho && alto ? (ancho > alto ? 'horizontal' : 'vertical') : null,
      tamañoAproximado: ancho === 612 && alto === 792 ? 'Carta' : ancho === 595 && alto === 842 ? 'A4' : 'Otro',
    };
  }

  private valorLiteral(pdf: string, clave: string): string | null {
    const valor = pdf.match(new RegExp(`/${clave}\\s*\\(([^)]*)\\)`))?.[1];
    return valor ? this.decodificarCadenaPdf(valor) : null;
  }

  private extraerTextosSimples(pdf: string): string[] {
    const textos: string[] = [];
    for (const match of pdf.matchAll(/\(([^()]*(?:\\.[^()]*)*)\)\s*(?:Tj|'|")/g)) {
      const texto = this.decodificarCadenaPdf(match[1]).trim();
      if (texto.length > 1) textos.push(texto);
    }
    return [...new Set(textos)];
  }

  private decodificarCadenaPdf(valor: string): string {
    const escapes: Record<string, string> = {
      n: '\n', r: '\r', t: '\t', b: '\b', f: '\f',
      '(': '(', ')': ')', '\\': '\\',
    };
    return valor
      .replace(/\\([nrtbf()\\])/g, (_x, caracter: string) => escapes[caracter] || caracter)
      .replace(/\\([0-7]{1,3})/g, (_x, octal) => String.fromCharCode(parseInt(octal, 8)));
  }

  private async calcularSha256(bytes: Uint8Array): Promise<string | null> {
    if (!globalThis.crypto?.subtle) return null;
    const hash = await globalThis.crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(hash)).map((valor) => valor.toString(16).padStart(2, '0')).join('');
  }
}
