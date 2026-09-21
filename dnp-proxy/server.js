import express from 'express';
import cors from 'cors';

const app = express();

const PORT = process.env.PORT || 3000;
const DNP_ORIGIN = 'https://ventanillasocial.dnp.gov.co';

// Por ahora permitimos Cloudflare + localhost.
// Luego podemos restringirlo todavía más.
app.use(cors({
  origin: true,
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

/**
 * CONSULTAR GRUPO SISBÉN
 *
 * Angular envía:
 * POST /Home/ConsultarGrupoSisben?pNumDoc=...&pTipDoc=...
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

    console.log('Consultando grupo SISBÉN');

    const response = await fetch(target, {
      method: 'POST',
      headers: {
        'Origin': DNP_ORIGIN,
        'Referer': `${DNP_ORIGIN}/`,
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': req.get('user-agent') || 'Mozilla/5.0'
      }
    });

    console.log(
      'DNP ConsultarGrupoSisben:',
      response.status
    );

    const body = await response.text();

    res.status(response.status);

    const contentType = response.headers.get('content-type');

    if (contentType) {
      res.set('Content-Type', contentType);
    }

    return res.send(body);

  } catch (error) {
    console.error(
      'Error ConsultarGrupoSisben:',
      error
    );

    return res.status(502).json({
      error: 'No fue posible conectar con DNP',
      detalle:
        error instanceof Error
          ? error.message
          : String(error)
    });
  }
});

/**
 * OBTENER DATOS RUI
 *
 * Angular actualmente manda FormData con:
 * pNumDoc
 * pTipDoc
 *
 * Para no reconstruir el multipart, enviamos
 * directamente el body recibido al DNP.
 */
app.post(
  '/Home/ObtenerDatosRUI',
  express.raw({
    type: () => true,
    limit: '2mb'
  }),
  async (req, res) => {
    try {
      console.log('Consultando RUI');

      const headers = {
        'Origin': DNP_ORIGIN,
        'Referer': `${DNP_ORIGIN}/`,
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': req.get('user-agent') || 'Mozilla/5.0'
      };

      const contentType = req.get('content-type');

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
        response.status
      );

      const body = await response.text();

      res.status(response.status);

      const responseContentType =
        response.headers.get('content-type');

      if (responseContentType) {
        res.set(
          'Content-Type',
          responseContentType
        );
      }

      return res.send(body);

    } catch (error) {
      console.error(
        'Error ObtenerDatosRUI:',
        error
      );

      return res.status(502).json({
        error: 'No fue posible conectar con DNP',
        detalle:
          error instanceof Error
            ? error.message
            : String(error)
      });
    }
  }
);

// Para comprobar rápidamente que Render está vivo.
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'dnp-proxy'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`DNP Proxy ejecutándose en puerto ${PORT}`);
});