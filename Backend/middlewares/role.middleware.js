/**
 * role.middleware.js
 * Middleware to verify if user has the required role.
 */

/**
 * Check if user has the role 'admin'.
 */
function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  
  /**
   * Check if user has the role 'user'.
   */
  function isUser(req, res, next) {
    if (req.user && req.user.role === 'user') {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden: Users only' });
  }
  
  module.exports = { isAdmin, isUser };
  