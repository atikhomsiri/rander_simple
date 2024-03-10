const jwt = require('jsonwebtoken');

 function userVerifyToken(req, res, next) {
    const token = req.session.token;
    if (!token) return res.status(401).json({ error: 'Access denied' });
        try {
     const decoded = jwt.verify(token, 'thesaban.secret');
     req.session.user = decoded.user;
     req.session.uid = decoded.uid;
     req.session.role = decoded.role;
        if(!decoded.user) res.status(401).json({ error: 'Access denied' });
        if(decoded.role!="user") res.status(401).json({ error: 'Access denied' });
     next();
        } catch (error) {
     res.status(401).json({ error: 'Invalid token' });
        }
};

module.exports = userVerifyToken;