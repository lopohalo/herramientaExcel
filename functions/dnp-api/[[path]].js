const DNP_ORIGIN = 'https://ventanillasocial.dnp.gov.co';
const ALLOWED_PATHS = new Set([
  'Home/ConsultarGrupoSisben',
  'Home/ObtenerDatosRUI',
]);

export async function onRequest(context) {
  const request = context.request;
  const cors = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
  };

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (request.method !== 'POST') return json({ ok: false, msg: 'Método no permitido.' }, 405, cors);

  const rawPath = context.params.path;
  const path = Array.isArray(rawPath) ? rawPath.join('/') : String(rawPath || '');
  if (!ALLOWED_PATHS.has(path)) return json({ ok: false, msg: 'Servicio DNP no permitido.' }, 404, cors);

  const incomingUrl = new URL(request.url);
  const target = `${DNP_ORIGIN}/${path}${incomingUrl.search}`;
  const headers = new Headers();
  headers.set('Accept', 'application/json, text/plain, */*');
  headers.set('Origin', DNP_ORIGIN);
  headers.set('Referer', `${DNP_ORIGIN}/`);
  const contentType = request.headers.get('Content-Type');
  if (contentType) headers.set('Content-Type', contentType);

  try {
    const upstream = await fetch(target, {
      method: 'POST',
      headers,
      body: await request.arrayBuffer(),
      redirect: 'follow',
    });
    const responseHeaders = new Headers(cors);
    responseHeaders.set('Content-Type', upstream.headers.get('Content-Type') || 'application/json; charset=utf-8');
    return new Response(await upstream.arrayBuffer(), { status: upstream.status, headers: responseHeaders });
  } catch (error) {
    return json({ ok: false, msg: 'No fue posible conectar con DNP.', detail: String(error) }, 502, cors);
  }
}

function json(value, status, headers) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' },
  });
}
