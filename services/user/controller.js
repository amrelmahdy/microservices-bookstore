const User = require('./User')
const { createResponse } = require('./helpers')
const { errorCodesEnum, jwt_secret } = require('./config')
const JWT = require('jsonwebtoken')

signToken = (payload) => {
    return JWT.sign(payload, jwt_secret, { expiresIn: 3600 });
}

module.exports = {
    register: async (req, res, next) => {
        try {
            const newUser = User(req.body);
            const userAlreadyExists = await User.userAlreadyExists({ email: newUser.email });
            // check if user exists
            if (userAlreadyExists) {
                response = createResponse(errorCodesEnum.CONFLICT, "", {}, "User has already been taken", {});
                res.json(response);
                return
            }
            // create a new user
            User.saveUser(newUser).then(user => {
                // generate token for this use
                const payload = {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile
                };
                const token = signToken(payload);
                response = createResponse(errorCodesEnum.CREATED, "Bearer " + token, {}, "User added successfully", payload);
                res.json(response);
            }).catch(error => {
                response = createResponse(errorCodesEnum.INTERNAL_SERVER_ERROR, "", {}, "Whoops something went wrong", error);
                res.json(error);
            });

        } catch (error) {
            next(error);
        }
    },
    login: async (req, res, next) => {
        try {
            User.findByQuery({ email: req.body.email }).then(user => {
                // compare password
                User.comparePassword(req.body.password, user.password).then(isMatch => {
                    const payload = {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                    }
                    // generate token for this use
                    const token = signToken(payload);
                    response = createResponse(errorCodesEnum.OK, "Bearer " + token, {}, "..", payload);
                    res.json(response);

                }).catch(err => {
                    response = createResponse(errorCodesEnum.Unauthorized, "", [], err.msg, {});
                    res.json(response);
                });
            }).catch(err => {
                response = createResponse(errorCodesEnum.Unauthorized, "", [], "User not found ... ", {});
                res.status(200).json(response);
            })

        } catch (error) {
            next(error);
        }


    },
    profile: async (req, res, next) => {
        const response = createResponse(errorCodesEnum.OK, "", {}, "User details ...", req.user);
        res.json(response);
    },
    getUserById: (req, res, next) => {
        //res.json(req.body.email)
        try {
            User.findByQuery({ _id: req.body.id }).then(user => {
                response = createResponse(errorCodesEnum.OK, "", {}, "..", user);
                res.json(response);
            }).catch(err => {
                response = createResponse(errorCodesEnum.Unauthorized, "", [], "User not found ... ", {});
                res.status(200).json(response);
            })

        } catch (error) {
            next(error);
        }
    }
}