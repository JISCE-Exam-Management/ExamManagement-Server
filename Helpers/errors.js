class ApiError extends Error {
    constructor(name, description="Bad Request", statusCode=400, isOperational=true) {
        super(description);

        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this);
    }
}

module.exports = ApiError;