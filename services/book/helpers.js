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
        addBookSchema: Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required(),
            authorID: Joi.string().required(),
        }),
        editBookSchema: Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required(),
        })
    }
};
