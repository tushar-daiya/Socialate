export const ErrorHandler = (err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    status: err.statusCode || 500,
    success: false,
    message: err.message || "Internal Server Error",
  });
};
