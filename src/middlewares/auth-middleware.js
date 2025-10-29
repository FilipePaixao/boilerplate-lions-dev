const jwt = require('jsonwebtoken');
 function AuthMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return RetornarErro(res, "Token invalido", 401);
    
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return RetornarErro(res, "Erro de configuração", 500);
        }
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (error) {
        return RetornarErro(res, "Token invalido", 401);
    }
}


 function requireRole(...allowed) {
  return async (req, res, next) => {
    const user = await RegisterUserMGS.findById(req.auth.userId).lean();
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const authorized = user.roles?.some((role) => allowed.includes(role));
    if (!authorized) return res.status(403).json({ error: 'Acesso negado' });

    next();
  };
}
module.exports = { AuthMiddleware, requireRole };