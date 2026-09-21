const DNP_ORIGIN = 'https://ventanillasocial.dnp.gov.co';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ============================
    // PROXY DNP
    // ============================
    if (url.pathname.startsWith('/dnp-api/')) {
      try {
        // Quita /dnp-api, igual que pathRewrite del proxy Angular
        const dnpPath = url.pathname.replace(/^\/dnp-api/, '');

        const targetUrl = new URL(
          `${DNP_ORIGIN}${dnpPath}${url.search}`
        );

        const headers = new Headers(request.headers);

        // Equivalente a tu proxy.conf.json
        headers.set('Origin', DNP_ORIGIN);
        headers.set('Referer', `${DNP_ORIGIN}/`);

        // No debemos reenviar el host de Cloudflare.
        headers.delete('host');

        const init = {
          method: request.method,
          headers,
          redirect: 'follow'
        };

        // POST de ConsultarGrupoSisben tiene body null.
        // ObtenerDatosRUI lleva FormData.
        if (
          request.method !== 'GET' &&
          request.method !== 'HEAD'
        ) {
          init.body = request.body;
        }

        const response = await fetch(targetUrl, init);

        // Construimos una nueva respuesta para poder
        // controlar los headers enviados al navegador.
        const responseHeaders = new Headers(response.headers);

        responseHeaders.set(
          'Access-Control-Allow-Origin',
          url.origin
        );

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders
        });

      } catch (error) {
        return Response.json(
          {
            ok: false,
            error: 'Error consultando DNP',
            detalle: String(error)
          },
          {
            status: 502
          }
        );
      }
    }

    // ============================
    // ANGULAR
    // ============================
    return env.ASSETS.fetch(request);
  }
};