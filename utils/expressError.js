module.exports = class ExpressError extends Error {
  constructor(message="Woops Something Went Wrong", status=500) {
    super(message=message, status=status);
  }
};
