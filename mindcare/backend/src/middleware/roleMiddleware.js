// ============================================================================
// Middleware: Role-Based Authorization Guard (roleMiddleware.js)
// Examiner Question: "How do you restrict access to specific user roles?"
// ============================================================================

const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    // STEP 1: Verify that a valid authenticated user exists on req.user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. User not authenticated.',
      });
    }

    // STEP 2: Standardize role comparison (case-insensitive)
    const userRole = (req.user.role || '').toLowerCase();
    const hasRole = allowedRoles.some(
      (role) => role.toLowerCase() === userRole
    );

    // STEP 3: If user does not have permission, return HTTP 403 Forbidden
    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' is not authorized to access this resource.`,
      });
    }

    // STEP 4: User is authorized, continue to next handler
    next();
  };
};

module.exports = authorize;

