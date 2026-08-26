export function registerRequestLogging(app, store) {
  app.addHook('onError', async (req, _reply, error) => {
    req.logError = error;
  });

  app.addHook('onResponse', async (req, reply) => {
    const err = req.logError;
    try {
      await store.requestLog.create({
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.url.split('?')[0],
        query: JSON.stringify(req.query || {}),
        statusCode: reply.statusCode,
        errorMessage: err ? err.message : null,
        errorStack: err ? err.stack : null
      });
    } catch (logErr) {
      app.log.error(logErr, 'failed to write request log');
    }
  });
}
