const DNP_ORIGIN = 'https://ventanillasocial.dnp.gov.co';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/dnp-api/')) {
      try {
        const dnpPath = url.pathname.replace(/^\/dnp-api/, '');

        const targetUrl = new URL(
          `${DNP_ORIGIN}${dnpPath}${url.search}`
        );

        console.log('DNP REQUEST:', request.method, targetUrl.toString());

        const headers = new Headers(request.headers);

        headers.set('Origin', DNP_ORIGIN);
        headers.set('Referer', `${DNP_ORIGIN}/`);
        headers.delete('host');

        const options = {
          method: request.method,
          headers,
          redirect: 'follow'
        };

        if (
          request.method !== 'GET' &&
          request.method !== 'HEAD'
        ) {
          options.body = request.body;
        }

        console.log('Enviando petición al DNP...');

        const response = await fetch(targetUrl, options);

        console.log(
          'DNP RESPONSE:',
          response.status,
          response.statusText
        );

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });

      } catch (error) {
        console.error('ERROR DNP:', error);

        return Response.json(
          {
            ok: false,
            error: 'Error consultando DNP',
            detalle:
              error instanceof Error
                ? error.message
                : String(error)
          },
          { status: 502 }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};