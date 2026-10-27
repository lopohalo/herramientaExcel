# Calculadora de inversiones

Ruta local: http://localhost:4200/#/calculadora (el proyecto usa rutas hash).

## Navegación

La vista inicial es el listado de inversiones. Nueva inversión y Ver / editar
abren el formulario por separado. Calcular abre el resultado; desde allí se pueden
ajustar condiciones o guardar. Guardar regresa al listado. La comparación tiene
su propia vista y se abre al seleccionar al menos dos registros. Los respaldos
y la recuperación anterior quedan dentro de una sección desplegable del listado.

## Stepper y simulación de fechas

El registro muestra un paso a la vez: datos de inversión, pagos, costos y revisión.
Se validan los campos de cada paso antes de avanzar; retroceder conserva los datos.

La comparación admite dos o más inversiones. Cada ficha permite editar el
vencimiento o sumar meses desde la misma vista. Se recalculan los flujos y los
gráficos como escenario temporal, sin modificar el registro hasta pulsar Guardar
fechas simuladas. Restablecer recupera el vencimiento registrado. Los flujos
manuales conservan sus fechas y montos; un plazo mayor no inventa ingresos.
No se presupone renovación del título a la tasa registrada.

## Gráficos y lectura de resultados

El análisis muestra los movimientos de salida y entrada junto a las condiciones,
capital, precio, costos, intereses, retención y resultado neto. El formulario
agrupa datos de la inversión, forma de pago y ajustes opcionales. Copiar compra
al nominal es una acción explícita; no presupone que ambos valores coincidan.

La comparación ofrece barras de TIR, ganancia neta o desembolso inicial, y una
línea escalonada de movimientos acumulados por fechas reales. El saldo empieza
con el desembolso negativo; aumenta con los cobros y termina en ganancia/pérdida.
No representa intereses devengados ni precio de mercado. Las fechas anteriores
a la compra y posteriores al vencimiento no se prolongan artificialmente.
Las fichas laterales incluyen las condiciones y los movimientos desplegables.
Los flujos propios ya son netos y no se descomponen en impuestos estimados.

Guía conceptual: https://www.superfinanciera.gov.co/publicaciones/13243/glosario-t-13243/
La función XIRR/TIR no se modifica al añadir estos gráficos.

## Interés generado frente a cobrado

El análisis y la comparación distinguen interés generado estimado de pagos.
El interés generado se calcula dentro de cada cupón aplicando la tasa simple o
EA a los días transcurridos y tomando diferencias acumuladas en cada cierre de
mes. Los tramos parciales y años bisiestos usan días reales. El total concilia
con el interés pactado de los flujos; no se modifica el calendario ni la TIR.
La retención se distribuye como estimación, no como impuesto ya practicado.
El capital y los cobros netos se muestran en su fecha efectiva programada.
No se presume amortización contable del descuento/prima de compra ni reinversión;
los intereses generados del título no son la ganancia total neta de la inversión.
No se estima generación para flujos manuales sin condiciones suficientes.

## Periodicidad visible en los gráficos

La vista inicial del análisis muestra intereses netos por cada pago pactado:
Mes, Trimestre, Semestre o Año con su fecha real. El modo automático respeta
la agenda del título desde la compra; no reemplaza sus pagos por trimestres de
calendario. En comparación se alinean por fecha real, incluso con frecuencias
diferentes. El usuario puede elegir mes, trimestre, semestre o año de calendario;
esas vistas incluyen periodos sin cobros con cero. La agrupación no cambia
cuándo se paga ni causa intereses que el contrato no tenga.

## Desglose por periodos

El gráfico individual permite ver todos los movimientos, separar capital/interés
neto/retención, aislar intereses sin capital y explicar los componentes de la
ganancia. La comparación añade componentes de la ganancia y pagos agrupados por
mes, trimestre o año. Las tablas por periodo muestran las cifras exactas.

Los componentes de cada pago proyectado se conservan como metadatos del flujo:
interés bruto, retención y capital. No se reconstruyen dividiendo por la tasa de
retención, por lo que también funcionan con retención del 100 %. Los montos de
los flujos y la fórmula de TIR no cambian. Los flujos manuales no se descomponen:
capital, intereses y retención se presentan como desconocidos, no como ceros.
La agrupación usa fechas de cobro, no devengo. Las barras de ganancia incluyen
el total como referencia; no debe sumarse otra vez a sus componentes.

## Corrección de la TIR

La función anterior llamada `calcularTIR` calculaba una rentabilidad total,
`(nominal + cupones - compra) / compra`, sin descontar por fechas. Además,
se calculaba antes de ajustar los pagos y mezclaba tasas anuales y periódicas.
La nueva implementación separa la rentabilidad del plazo de la TIR anual.

El motor `inversion.model.ts` calcula los flujos netos y resuelve:

    Σ flujo_i / (1 + TIR)^((fecha_i - fecha_compra) / 365) = 0

Usa bisección en log(1 + TIR), admite TIR negativas y devuelve `null` cuando
no puede representar una solución dentro del rango numérico admitido.
Referencia: https://support.microsoft.com/en-us/excel/functions/xirr-function?nochrome=true

## Supuestos explícitos

- Moneda COP. Desembolso inicial = compra + costos iniciales.
- Tasa efectiva anual: nominal × ((1 + tasa)^(días/base) − 1).
- Anual simple: nominal × tasa × días/base.
- Indexada: índice anual supuesto + spread, aplicados como anual simple.
  No se consulta una serie histórica ni se atribuye este modelo a todos los títulos indexados.
- La base de causación puede ser real/360 o real/365. La TIR siempre usa real/365.
- Cupones sobre el nominal; devolución del nominal al vencimiento; sin reinversión.
- Agenda anclada al día de compra, ajustada al último día del mes cuando hace falta.
  El último periodo incompleto termina exactamente al vencimiento.
- Retención configurable sobre intereses; se aplica también al interés final.
- Los flujos propios son cobros netos posteriores a la compra, no negativos,
  hasta el vencimiento. Deben incluir capital, impuestos y gastos posteriores.
  No se agrega capital automáticamente. No se admiten aportes posteriores negativos
  ni flujos con múltiples cambios de signo (que pueden tener varias TIR).
- Los resultados son proyecciones; el estado se determina por fecha en Colombia.
  No se lleva conciliación de pagos recibidos ni se calcula una TIR agregada del portafolio.

## Persistencia

`localStorage['inversiones.v2']` guarda las condiciones y los flujos propios.
Los resultados se recalculan al cargar. No hay servidor ni sincronización;
los datos dependen del navegador y el origen (host y puerto).
Se permite descargar/restaurar un respaldo JSON versionado, sin sobrescribir
registros con el mismo identificador. El respaldo no es un informe financiero.

Las claves anteriores `dataTareasCalcular`, `formulario` y `dataTareas` se conservan.
El usuario puede cargar sus registros como borradores. Se exige confirmar la tasa
para no asumir que una tasa antigua era nominal, efectiva o un spread.

## Validación

    npm test -- --watch=false --browsers=ChromeHeadless --include='src/app/component/calculadora/*.spec.ts'
    npm run build

Las pruebas cubren el ejemplo oficial de XIRR, ganancias y pérdidas, costos,
retenciones, años bisiestos, periodos incompletos, fechas y flujos inválidos,
persistencia, edición, comparación y recuperación de registros anteriores.

El informe queda pendiente del formato que suministre el usuario.

## Informes universitarios

La acción Importar informe Excel lee el formato de una hoja con fondos separados,
columnas A–L de posiciones y N–P de cobros mensuales. Muestra una conciliación
antes de guardar. Conserva valores, fórmulas, formatos numéricos, coordenadas de
origen y encabezados. No ejecuta macros ni evalúa fórmulas externas. El cálculo
independiente usa los datos normalizados; las fórmulas se conservan como evidencia.

Los títulos importados usan `couponConvention: fixed-period` y `couponAnchor`
(fecha de emisión). Para un cupón trimestral completo, FS aplica nominal × tasa/4;
IPC aplica nominal × (spread + IPC del corte)/4. Los porcentajes de Excel se
multiplican por 100 al normalizar: 0,0629 → 6,29 %. Los importes monetarios no se
convierten en porcentajes. No cambia el algoritmo XIRR.

La agenda desde emisión concilia los meses del informe observado; el Excel no
indica fechas exactas de cada pago. Fuera de esos meses, la agenda es un escenario
que debe confirmarse con las condiciones del título. El primer cupón posterior a
la compra se recibe completo; su distribución temporal en el gráfico es orientativa,
no una reconstrucción contable de intereses comprados. IPC del corte constante no
reconstruye los cupones históricos ni confirma la regla de fijación del índice.

Los ceros son pagos numéricos informados; una celda vacía queda pendiente. Los
intereses de N–P son brutos: el reporte no acredita pagos recibidos ni informa
retención/costos adicionales. La conciliación compara meses e importes, no certifica
TIR histórica, impuesto aplicable ni valoración de mercado.

El identificador de posición incluye fondo, nemotécnico y compra. No se mezclan
las tenencias del mismo título de fondos distintos. Reimportar conserva las
posiciones existentes; cada archivo se identifica por SHA-256. Los informes y sus
celdas se almacenan en `inversiones.university-reports.v1`, y las posiciones en
`inversiones.v2`. El respaldo versión 2 incluye ambos; al recuperar un informe se
reconstruye desde sus celdas y se recalcula la conciliación.

`localStorage` no es nube. Los datos son de ese navegador y origen, sin sincronización.
Los archivos privados preparados para este usuario quedan en `.local-data/`, excluida
de Git y de los recursos públicos de Angular. No se añaden a `src/assets`.

### Precarga local del informe proporcionado

En desarrollo, Angular sirve el respaldo privado de `.local-data/informes` como
`assets/local-informes/uis-septiembre-2026-respaldo.json`. Al abrir la calculadora
en localhost, se valida y registra automáticamente, sin selector de archivo.
La marca `inversiones.initial-seed.uis-2026-09` evita repetir la carga y respeta
las eliminaciones posteriores. Las posiciones existentes no se sobrescriben.
Si el informe ya estaba importado, se conserva el registro tal como está.

Esta configuración de assets solo existe en `development`; la carga también
comprueba `isDevMode()` y el host local. El respaldo universitario no se copia
a los assets comunes ni a la configuración de producción.

## Exportación en formato universitario

Exportar informe Excel toma todas las inversiones actualmente guardadas (no solo
las seleccionadas para comparar) y permite elegir el mes de corte. La primera
hoja sigue la plantilla original: encabezados, colores, estilos numéricos, fondos,
columnas A–S, tres meses posteriores al corte, subtotales y total general.
Las posiciones sin fondo se incluyen en un bloque propio. La agenda y los
importes se recalculan desde las condiciones actuales. Los cambios sin guardar
no participan. Los vacíos originales sin nuevos pagos calculados se conservan.

Se añaden tres hojas dinámicas: Resumen didáctico, Detalle de inversiones y
Calendario de pagos. Explican los conceptos, muestran composición por tipo y
emisor (sobre nominal), tasas/TIR del escenario, notas y pagos proyectados. Los
cobros manuales no se convierten en intereses ni se descomponen arbitrariamente.
Las tasas se escriben como fracciones con formato de porcentaje; el dinero y los
conteos usan formatos diferentes.

El exportador conserva los estilos de la plantilla y crea el libro con celdas
actuales y fórmulas propias con valores calculados. No arrastra sharedStrings,
referencias externas ni metadatos personales de ubicación del libro de origen;
las filas eliminadas no quedan escondidas en el archivo exportado.

La plantilla original privada está en `.local-data/informes/plantilla-universidad.xlsx`
y solo se sirve en desarrollo local, igual que la precarga de datos. Para un
despliegue distinto se debe configurar una plantilla de esa instalación.
