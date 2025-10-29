export default function errorMiddleware(err, _req, res, _next) {
  const status = err.statusCode || 500;
  const message = status === 500 ? 'Erro interno do servidor.' : err.message;

  if (status === 500) {
    console.error('[ERROR]', err);
  }

  res.status(status).json({
    error: message,
  });
}
