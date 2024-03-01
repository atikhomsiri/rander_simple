const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
const token = req.session.token;
if (!token) return res.status(401).json({ error: 'Access denied' });
try {
 const decoded = jwt.verify(token, 'thesaban.secret');
 req.session.user = decoded.user;
 req.session.role = decoded.role;
 next();
 } catch (error) {
 res.status(401).json({ error: 'Invalid token' });
 }
 };

module.exports = verifyToken;