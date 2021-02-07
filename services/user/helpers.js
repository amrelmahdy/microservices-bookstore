const Joi = require('joi')

module.exports = {
    createResponse: (code, token, validation, desc, response) => {
        return {
            Error: {
                token: token,
                code: code,
                validation: validation,
                desc: desc,
            },
            Response: response
        }
    },
    validationSchemas: {
        loginSchema: Joi.object({
            email: Joi.string().required(),
            email: Joi.string().email(),
            password: Joi.string().required()
        }),
        registerSchema: Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            email: Joi.string().email(),
            password: Joi.string().required()
        })
    }
};
