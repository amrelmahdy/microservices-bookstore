module.exports = {
    jwt_secret: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    errorCodesEnum: Object.freeze({
        "OK": 200,
        "CREATED": 201,
        "INTERNAL_SERVER_ERROR": 500,
        "NOT_FOUND": 404,
        "CONFLICT": 409,
        "Unauthorized": 401,
        "Forbidden": 403
    }),
};

