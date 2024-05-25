const jwt = require('jsonwebtoken');
const { JWT_SECRET_TOKEN : secretKey } = require('../config/index.js')

// Authenticate olmadan istek atmayı önleyen middleware
// Advertisement rotaları için gerekli - Örn: Kullanıcı giriş yapmadan ilan oluşturamaz (403 forbidden hatası alır)
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

module.exports = authenticateToken

