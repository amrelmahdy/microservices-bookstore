const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { validationSchemas } = require("./helpers")
const validator = require('express-joi-validation').createValidator({
    passError: true
})
const passport = require("passport")




router.post("/register", validator.body(validationSchemas.registerSchema), controller.register)
router.post("/login", validator.body(validationSchemas.loginSchema),controller.login);
router.post("/getUserById", controller.getUserById);
router.post("/profile", passport.authenticate("jwt",   {session: false}), controller.profile);

module.exports = router

