const errorHandler = (err, req, res, next) => {
  console.error('❌ Server Error:', err);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: messages,
    });
  }

  // Sequelize foreign key constraint error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Referenced entity not found or foreign key constraint violation.',
    });
  }

  // Default to 500 server error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error.',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
