# Auditoría del histórico y la proyección de indicadores

Revisión: 22 de octubre de 2026. Se inspeccionó la versión del componente en HEAD,
antes de las mejoras actuales, sin restaurarla ni modificar el cálculo de TIR.

## Indicador encontrado

El código tenía una lista `lista` con propiedades `mes` e `ipc`, desde enero de
2009 hasta junio de 2025. El formulario llamaba `tasaDFT` al valor rotulado como
IPC. No había una descarga de datos ni un servicio externo de DTF o IPC.
`data.ts` contiene una serie de valores para gráficos; no es un histórico oficial
identificado de indicadores económicos.

La rama indexada aplicaba:

    tasa = tasaFacial - tasaDFT + IPC_del_mes_del_pago
    pago = nominal × tasa / 4 / 10

La resta parece intentar aislar un margen sobre un índice inicial, pero eso es
una inferencia del código, no evidencia de la fórmula contractual del título.

## Hallazgos verificables

1. La lista mezcla medidas. En febrero de 2024 almacena 2,01 (año corrido),
   mientras que la variación anual oficial era 7,74. En febrero de 2025 almacena
   2,08 (año corrido), frente a 5,28 anual. En enero de 2024 usa 8,35 (anual).
   No se puede tratar toda la lista como una única tasa anual.
2. Diciembre de 2024 figura como 4,94 en la lista; el cierre anual oficial es
   5,20. La tabla necesita sustitución y trazabilidad, no solo ampliación.
3. Un dato ausente se convierte en cero. No distingue dato aún no publicado,
   hueco histórico, error de lectura y proyección.
4. El `if` de fecha futura y su `else` contienen la misma fórmula. No existe
   una trayectoria futura independiente ni una fuente de pronóstico identificada.
5. La división por 4 se aplica a cualquier periodicidad. Además `/4/10` equivale
   a dividir por 40: para una tasa porcentual anual simple trimestral se dividiría
   por 400. La rama no documenta otra convención que justifique ese factor.
6. Selecciona IPC por mes del pago sin justificar si el contrato usa IPC al inicio,
   al cierre, rezagado o último publicado. Un indicador del mismo mes puede no
   haber estado disponible aún en la fecha de fijación.

## Fuentes oficiales localizadas

- DANE, información técnica e históricos:
  https://www.dane.gov.co/index.php/estadisticas-por-tema/precios-y-costos/indice-de-precios-al-consumidor-ipc/ipc-informacion-tecnica
  https://www.dane.gov.co/index.php/estadisticas-por-tema/precios-y-costos/indice-de-precios-al-consumidor-ipc/ipc-historico
- DANE, contraste de febrero 2024 y 2025 (mensual, año corrido y anual):
  https://www.dane.gov.co/files/operaciones/IPC/feb2025/graf-IPC-feb2025.html
- DANE, cierre 2024:
  https://www.dane.gov.co/files/operaciones/IPC/dic2024/cp-IPC-dic2024.pdf
- Banco de la República, metodología DTF: tasa efectiva anual base 365 calculada
  semanalmente, con vigencia de lunes a domingo de la semana siguiente:
  https://www.banrep.gov.co/es/cual-metodologia-calculo-dtf-y-normativa-relacionada
- Banco de la República, IBR: existen varios plazos y tasas nominales y efectivas;
  no se debe elegir solo por el nombre IBR:
  https://www.banrep.gov.co/es/glosario/indicador-bancario-referencia-ibr
- Catálogo de series e históricos del Banco:
  https://totoro.banrep.gov.co/estadisticas-economicas/faces/pages/Buscador.xhtml
  https://suameca.banrep.gov.co/estadisticas-economicas/

Se verificaron las páginas y se descargaron archivos directamente del DANE.
El portal Suameca falló en la herramienta de navegación (502); no se afirma
haber probado una API estable, una autenticación ni una conexión CORS del navegador.
No se usa una API de terceros como sustituto de la fuente oficial.

## Datos ya preparados

`src/assets/indicadores/ipc-dane.json` contiene un snapshot, no una conexión en vivo:

- `IPC_MONTHLY_CHANGE`: 285 observaciones oficiales, enero 2003–septiembre 2026.
- `IPC_ANNUAL_CHANGE`: 9 observaciones oficiales, enero–septiembre 2026.
  Ese anexo anual solo contiene 2026; el histórico anual anterior sigue pendiente
  de extracción de los anexos por año. No se completa con ceros ni se confunde
  con los 285 datos de variación mensual.

Cada serie incluye unidad, cobertura, URL y SHA-256 del archivo descargado.
Los campos ausentes no se convierten en observaciones. Los datos mensuales
negativos se conservan. La publicación de este corte es del 7 de octubre de 2026;
no se han reconstruido las fechas de publicación individuales de todos los años.
No se debe usar el corte como si todos los valores hubieran sido conocidos en
cada fecha histórica.

Para reproducir la preparación, descargar ambos archivos oficiales y ejecutar:

    node scripts/prepare-ipc-snapshot.cjs mensual.xls anual.xls src/assets/indicadores/ipc-dane.json

Los enlaces del script son del corte septiembre 2026. Para otro corte hay que
actualizar las URLs y verificar estructura/cobertura: no es una actualización
automática. Los archivos XLS originales no se añaden al repositorio.

## Integración que corresponde a este sistema

Separar explícitamente:

- Indicador: IPC anual, IPC mensual, DTF u otra serie identificada.
- Regla contractual: tipo de tasa, margen/spread, fórmula aditiva o compuesta,
  fecha de fijación y rezago, base de días y frecuencia de revisión.
- Histórico observado: valor y periodo oficiales, con publicación/disponibilidad.
- Proyección: supuesto del usuario o escenario identificado, con fecha de corte;
  nunca rotularlo como dato publicado ni poner cero por faltar un dato.
- Evidencia por cupón: indicador usado, periodo de referencia, origen observado
  o proyectado, tasa final, interés bruto y neto. Esos flujos alimentan la TIR
  existente sin modificar su algoritmo.

La regla de fijación y la fórmula exacta IPC + margen deben confirmarse con el
certificado o las condiciones de emisión. El programa no debe asumir que todos
los títulos IPC funcionan igual. La serie mensual preparada NO se conecta como
si fuera una tasa anual de inversión. Por eso esta auditoría deja datos y fuentes
listos, pero no altera silenciosamente los resultados registrados ni los cálculos.
