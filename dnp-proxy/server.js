import express from 'express';
import cors from 'cors';

const app = express();

const PORT = process.env.PORT || 3000;
const DNP_ORIGIN = 'https://ventanillasocial.dnp.gov.co';

/**
 * CORS
 *
 * Por ahora permitimos cualquier origen para realizar las pruebas.
 * Cuando todo funcione, lo restringimos únicamente a tu dominio
 * de Cloudflare.
 */
app.use(
  cors({
    origin: true,
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
  })
);

/**
 * ============================================================
 * CONSULTAR GRUPO SISBÉN
 * ============================================================
 *
 * Angular envía:
 *
 * POST /Home/ConsultarGrupoSisben
 *      ?pNumDoc=...
 *      &pTipDoc=...
 */
app.post('/Home/ConsultarGrupoSisben', async (req, res) => {
  try {
    const { pNumDoc, pTipDoc } = req.query;

    if (!pNumDoc || !pTipDoc) {
      return res.status(400).json({
        error: 'Faltan pNumDoc o pTipDoc'
      });
    }

    const target = new URL(
      '/Home/ConsultarGrupoSisben',
      DNP_ORIGIN
    );

    target.searchParams.set('pNumDoc', pNumDoc);
    target.searchParams.set('pTipDoc', pTipDoc);

    // No imprimimos el documento en los logs.
    console.log('======================================');
    console.log('Consultando grupo SISBÉN');
    console.log('Enviando petición al DNP...');
    console.log('======================================');

    const response = await fetch(target, {
      method: 'POST',

      headers: {
        Origin: DNP_ORIGIN,
        Referer: `${DNP_ORIGIN}/`,
        Accept: 'application/json, text/plain, */*',
        'User-Agent':
          req.get('user-agent') || 'Mozilla/5.0'
      }
    });

    console.log(
      'DNP ConsultarGrupoSisben:',
      response.status,
      response.statusText
    );

    const body = await response.text();

    const contentType =
      response.headers.get('content-type');

    if (contentType) {
      res.set('Content-Type', contentType);
    }

    return res
      .status(response.status)
      .send(body);

  } catch (error) {
    console.error('======================================');
    console.error('ERROR CONSULTAR GRUPO SISBÉN');
    console.error('======================================');

    console.error('Error completo:', error);
    console.error('Mensaje:', error?.message);
    console.error('Cause:', error?.cause);

    if (error?.cause) {
      console.error('Cause code:', error.cause.code);
      console.error('Cause errno:', error.cause.errno);
      console.error('Cause syscall:', error.cause.syscall);
      console.error('Cause address:', error.cause.address);
      console.error('Cause port:', error.cause.port);
      console.error('Cause message:', error.cause.message);
    }

    return res.status(502).json({
      error: 'No fue posible conectar con DNP',

      detalle:
        error?.message ||
        String(error),

      causa: error?.cause
        ? {
            code:
              error.cause.code ?? null,

            errno:
              error.cause.errno ?? null,

            syscall:
              error.cause.syscall ?? null,

            address:
              error.cause.address ?? null,

            port:
              error.cause.port ?? null,

            message:
              error.cause.message ?? null
          }
        : null
    });
  }
});

/**
 * ============================================================
 * OBTENER DATOS RUI
 * ============================================================
 *
 * Angular manda FormData:
 *
 * pNumDoc
 * pTipDoc
 *
 * Recibimos el multipart completo y lo reenviamos al DNP
 * sin reconstruirlo.
 */
app.post(
  '/Home/ObtenerDatosRUI',

  express.raw({
    type: () => true,
    limit: '2mb'
  }),

  async (req, res) => {
    try {
      console.log('======================================');
      console.log('Consultando RUI');
      console.log('Enviando petición al DNP...');
      console.log('======================================');

      const headers = {
        Origin: DNP_ORIGIN,
        Referer: `${DNP_ORIGIN}/`,
        Accept: 'application/json, text/plain, */*',
        'User-Agent':
          req.get('user-agent') || 'Mozilla/5.0'
      };

      /**
       * Es MUY importante conservar Content-Type porque
       * contiene el boundary del multipart/form-data
       * enviado originalmente por Angular.
       */
      const contentType =
        req.get('content-type');

      if (contentType) {
        headers['Content-Type'] = contentType;
      }

      const response = await fetch(
        `${DNP_ORIGIN}/Home/ObtenerDatosRUI`,
        {
          method: 'POST',
          headers,
          body: req.body
        }
      );

      console.log(
        'DNP ObtenerDatosRUI:',
        response.status,
        response.statusText
      );

      const body =
        await response.text();

      const responseContentType =
        response.headers.get('content-type');

      if (responseContentType) {
        res.set(
          'Content-Type',
          responseContentType
        );
      }

      return res
        .status(response.status)
        .send(body);

    } catch (error) {
      console.error('======================================');
      console.error('ERROR OBTENER DATOS RUI');
      console.error('======================================');

      console.error('Error completo:', error);
      console.error('Mensaje:', error?.message);
      console.error('Cause:', error?.cause);

      if (error?.cause) {
        console.error(
          'Cause code:',
          error.cause.code
        );

        console.error(
          'Cause errno:',
          error.cause.errno
        );

        console.error(
          'Cause syscall:',
          error.cause.syscall
        );

        console.error(
          'Cause address:',
          error.cause.address
        );

        console.error(
          'Cause port:',
          error.cause.port
        );

        console.error(
          'Cause message:',
          error.cause.message
        );
      }

      return res.status(502).json({
        error: 'No fue posible conectar con DNP',

        detalle:
          error?.message ||
          String(error),

        causa: error?.cause
          ? {
              code:
                error.cause.code ?? null,

              errno:
                error.cause.errno ?? null,

              syscall:
                error.cause.syscall ?? null,

              address:
                error.cause.address ?? null,

              port:
                error.cause.port ?? null,

              message:
                error.cause.message ?? null
            }
          : null
      });
    }
  }
);

/**
 * ============================================================
 * HEALTH CHECK
 * ============================================================
 *
 * GET https://dnp-proxy.onrender.com/health
 */
app.get('/health', (req, res) => {
  return res.json({
    ok: true,
    service: 'dnp-proxy'
  });
});

/**
 * Ruta raíz opcional.
 *
 * Así ya no aparecerá "Cannot GET /"
 * al abrir directamente el dominio de Render.
 */
app.get('/', (req, res) => {
  return res.json({
    ok: true,
    service: 'dnp-proxy',
    status: 'running'
  });
});

/**
 * ============================================================
 * INICIAR SERVIDOR
 * ============================================================
 */
app.listen(PORT, '0.0.0.0', () => {
  console.log('======================================');
  console.log('DNP Proxy iniciado correctamente');
  console.log(`Puerto: ${PORT}`);
  console.log('======================================');
});