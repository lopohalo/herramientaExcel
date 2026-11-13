# Cruce de direcciones en auditoría de liquidaciones

El reporte admite Dirección/Direccion, Barrio/Vereda, Ciudad/Municipio y
Departamento, además de sus encabezados de residencia. Los datos originales
permanecen en cada fila y en la exportación. Las columnas de ubicación son
opcionales para que los archivos anteriores sigan siendo legibles.

Se muestran tres controles independientes de la criticidad económica:

- Calidad: faltantes, marcadores sin dato y direcciones que solo contienen el
  municipio u otra descripción insuficiente. Una dirección rural con vereda,
  finca, corregimiento o kilómetro no necesita nomenclatura urbana.
- Sisbén/RUI: comparación del municipio y departamento disponibles después de
  una consulta válida. Sin consulta, con errores o con datos incompletos no se
  certifica coincidencia. No se supone que el servicio entregue calle/barrio.
- Otra base: carga opcional de Excel relacionado por tipo y número de documento;
  no se relacionan personas solo por nombre. Se comparan los cuatro campos.
  Varias direcciones distintas para la misma identidad se marcan ambiguas.

La normalización ignora tildes, mayúsculas, puntuación de nomenclatura y algunas
abreviaturas (CL/CLL, CRA/CR/KR, APTO/APARTAMENTO). No concatena números separados,
no elimina apartamentos y no transforma aproximaciones en residencia verificada.
Los registros compartidos se agrupan por dirección normalizada + ciudad +
departamento, contando identidades distintas, no cantidad de recibos. Coincidir
no acredita pertenencia al mismo hogar. Ningún control de dirección agrega puntos
ni determina beneficios o estrato.

La búsqueda incluye la ubicación y los filtros permiten revisar incompletos,
ubicaciones distintas, direcciones compartidas y diferencias con otra base.
La descarga conserva las columnas originales y agrega estados, notas y datos de
referencia usados en el cruce. Recalcular conserva la base cargada y los resultados
geográficos. Los datos se mantienen en memoria durante la sesión; el Excel de
estudiantes no se añade a los assets ni a los datos iniciales publicados.

Pruebas:

    npm test -- --watch=false --browsers=ChromeHeadless --include='src/app/component/auditoria-liquidaciones/*.spec.ts'

## Comparación principal con Sisbén

La dirección del servicio Sisbén se conserva separada del municipio/departamento
combinados de Sisbén/RUI. Se extraen los campos de ubicación reconocidos de la
respuesta exitosa de ConsultarGrupoSisben. No se atribuye una dirección del RUI
a Sisbén ni se infiere una vivienda a partir del municipio.

La comparación principal muestra Direcciones coinciden, Dirección diferente,
Coincidencia parcial, Estudiante sin dirección, Sisbén no informa dirección o
Pendiente de consulta. Si el servicio no incluye la calle/domicilio, no se puede
confirmar ni descartar su igualdad: solo se muestra el cruce geográfico parcial.
La base adicional sigue siendo complementaria, con procedencia independiente.

El botón de consulta por direcciones procesa los estudiantes filtrados pendientes
sin restringirse a alertas económicas. Solo se ejecuta al pulsarlo; omite tipos y
números ya consultados en ese lote y estados Consultado/No encontrado. Se conservan
la concurrencia de dos consultas y el timeout del flujo existente. Las pruebas
utilizan respuestas simuladas, no datos reales consultados al DNP.
