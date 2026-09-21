const DNP_ORIGIN = 'https://ventanillasocial.dnp.gov.co';
const ALLOWED_PATHS = new Set([
  '/Home/ConsultarGrupoSisben',
  '/Home/ObtenerDatosRUI',
]);

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders(),
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, msg: 'Método no permitido.' });
  }

  const requestedPath = event.path
    .replace(/^\/\.netlify\/functions\/dnp-proxy/, '')
    .replace(/^\/dnp-api/, '');

  if (!ALLOWED_PATHS.has(requestedPath)) {
    return json(404, { ok: false, msg: 'Servicio DNP no permitido.' });
  }

  const query = event.rawQuery || new URLSearchParams(event.queryStringParameters || {}).toString();
  const target = `${DNP_ORIGIN}${requestedPath}${query ? `?${query}` : ''}`;
  const headers = {
    accept: 'application/json, text/plain, */*',
    origin: DNP_ORIGIN,
    referer: `${DNP_ORIGIN}/`,
    'user-agent': 'UIS-Auditoria-Liquidaciones/1.0',
  };
  const contentType = event.headers?.['content-type'] || event.headers?.['Content-Type'];
  if (contentType) headers['content-type'] = contentType;

  try {
    const response = await fetch(target, {
      method: 'POST',
      headers,
      body: event.body
        ? Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8')
        : undefined,
      redirect: 'follow',
    });
    const body = await response.text();
    return {
      statusCode: response.status,
      headers: {
        ...corsHeaders(),
        'content-type': response.headers.get('content-type') || 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      },
      body,
    };
  } catch (error) {
    return json(502, {
      ok: false,
      msg: 'No fue posible conectar con el servicio de DNP.',
      detail: error instanceof Error ? error.message : String(error),
    });
  }
};

function corsHeaders() {
  return {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'Content-Type',
  };
}

function json(statusCode, value) {
  return {
    statusCode,
    headers: { ...corsHeaders(), 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
    body: JSON.stringify(value),
  };
}
