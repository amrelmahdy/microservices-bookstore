const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { validationSchemas } = require("./helpers")
const validator = require('express-joi-validation').createValidator({
    passError: true
})
const passport = require("passport")


router.get("/", passport.authenticate("jwt", { session: false }), controller.getAllBooks)
router.get("/:id", passport.authenticate("jwt", { session: false }), controller.getBookDetails)
router.post("/", validator.body(validationSchemas.addBookSchema), passport.authenticate("jwt", { session: false }), controller.addNewBook)
router.put("/:id", validator.body(validationSchemas.editBookSchema), passport.authenticate("jwt", { session: false }), controller.editBook)
router.delete("/:id", passport.authenticate("jwt", { session: false }), controller.deleteBook)

module.exports = router

