const DNP_ORIGIN = 'https://ventanillasocial.dnp.gov.co';

function parseDnpResponse(body, service) {
  let data;
  try { data = JSON.parse(body); } catch { throw new Error(`${service}: el DNP no devolvió JSON válido. Puede ser una página de error o de acceso; no equivale a «No registra».`); }
  if (!data || typeof data !== 'object' || Array.isArray(data) || typeof data.ok !== 'boolean') throw new Error(`${service}: formato de respuesta no reconocido; no se puede determinar si hay registro.`);
  const message = String(data.msg || data.mensaje || data.message || data.error || '').trim();
  if (!data.ok && message && !/no\s+(?:se\s+)?(?:encontr|registr|existe|hay\s+(?:datos|informaci[oó]n))/i.test(message)) throw new Error(`${service}: DNP respondió: ${message.replace(/<[^>]*>/g, "").replace(/\d{5,}/g, "[dato omitido]").slice(0, 400)}. No se pudo verificar el registro.`);
  if (data.ok && service === 'SISBÉN' && (typeof data.grupo !== 'string' || !data.grupo.trim())) throw new Error('SISBÉN: respuesta exitosa sin grupo de clasificación; revisa el servicio.');
  return data;
}
function createDnpClient(fetchRequest, { timeoutMs = 30000 } = {}) {
  // Session state is held only in memory and shared by the two requests.
  let sessionPromise;
  async function openSession(signal) {
    const response = await fetchRequest(DNP_ORIGIN + '/', {
      headers: { 'User-Agent': 'Mozilla/5.0' }, signal, cache: 'no-store'
    });
    if (!response.ok) throw new Error('No fue posible abrir la página de consulta DNP.');
    const html = await response.text();
    const nonce = html.match(/var\s+_ruiPubNonce\s*=\s*['"]([^'"]+)['"]/)?.[1];
    if (!nonce) throw new Error('La página DNP no proporcionó el identificador de sesión de consulta.');
    const cookies = response.headers.getSetCookie();
    return { nonce, cookie: cookies.map(value => value.split(';')[0]).join('; ') };
  }
  async function request(service, path, document, type) {
    if (!/^\d+$/.test(String(document || '')) || !Number.isInteger(Number(type)) || Number(type) <= 0) throw new Error('Faltan datos válidos de tipo y número de documento.');
    const controller = new AbortController();
    let timer;
    try {
      return await Promise.race([
        (async () => {
          if (!sessionPromise) {
            sessionPromise = openSession(controller.signal).catch(error => { sessionPromise = undefined; throw error; });
          }
          const session = await sessionPromise;
          const body = new URLSearchParams({ pNumDoc: String(document), pTipDoc: String(type) });
          const response = await fetchRequest(DNP_ORIGIN + path, {
            method: 'POST', signal: controller.signal,
            headers: {
              Origin: DNP_ORIGIN, Referer: DNP_ORIGIN + '/',
              Accept: 'application/json, text/plain, */*', 'User-Agent': 'Mozilla/5.0',
              'Content-Type': 'application/x-www-form-urlencoded',
              'X-Rui-Nonce': session.nonce, Cookie: session.cookie
            }, body: body.toString()
          });
          if (!response.ok) throw new Error(`${service}: DNP respondió HTTP ${response.status}. No se pudo verificar el registro.`);
          return parseDnpResponse(await response.text(), service);
        })(),
        new Promise((_, reject) => { timer = setTimeout(() => { controller.abort(); reject(new Error(`${service}: se agotó el tiempo de espera. Reintenta la consulta.`)); }, timeoutMs); })
      ]);
    } catch (error) {
      // A new manual attempt obtains a fresh session after any failure.
      sessionPromise = undefined;
      if (error.message?.startsWith(service)) throw error;
      throw new Error(`${service}: ${error.message || 'No fue posible conectar con DNP.'}`);
    } finally { clearTimeout(timer); }
  }
  return {
    consultarGrupoSisben: (document, type) => request('SISBÉN', '/Home/ConsultarGrupoSisben', document, type),
    obtenerDatosRui: (document, type) => request('RUI', '/Home/ObtenerDatosRUI', document, type)
  };
}
module.exports = { createDnpClient, parseDnpResponse };
