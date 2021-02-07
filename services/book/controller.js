const Book = require('./Book')
const { createResponse } = require('./helpers')
const { errorCodesEnum } = require('./config')
const axios = require("axios")
const mongoose = require('mongoose')

module.exports = {
    getAllBooks: async (req, res, next) => {
        try {
            const books = await Book.find({ authorID: req.user._id }).sort({ "created_at": 'desc' })
            response = createResponse(errorCodesEnum.OK, "", {}, "Data retrieved successfully", books);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    },
    addNewBook: async (req, res, next) => {
        try {
            const newBook = {
                name: req.body.name,
                description: req.body.description,
                authorID: mongoose.Types.ObjectId(req.user._id)
            };
            const book = new Book(newBook)
            book.save(newBook).then(book => {
                const response = createResponse(errorCodesEnum.CREATED, "", {},"Book created successfully", book);
                res.status(200).json(response);
            }).catch(error => {
                const response = createResponse(errorCodesEnum.INTERNAL_SERVER_ERROR, "", {}, "Whoops something went wrong", error);
                res.status(200).json(response);
            })
        } catch (error) {
            next(error);
        }
    },
    getBookDetails: async (req, res, next) => {
        try {
            const { id } = req.params
            if (!mongoose.Types.ObjectId.isValid(id)) {
                response = createResponse(errorCodesEnum.NOT_FOUND, "", {}, "Book hasn't been found", {});
                return res.status(200).json(response);
            }
            const book = await Book.findById(id);
            if (!book) {
                response = createResponse(errorCodesEnum.NOT_FOUND, "", {}, "Book hasn't been found", {});
                return res.status(200).json(response);
            }
            response = createResponse(errorCodesEnum.OK, "", {}, "...", book);
            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    },
    editBook: async (req, res, next) => {
        try {
            const {id} = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                response = createResponse(errorCodesEnum.NOT_FOUND, "", {}, "Book hasn't been found", {});
                return res.status(200).json(response);
            }
            const newBook = {
                name: req.body.name,
                description: req.body.description,
                authorID: mongoose.Types.ObjectId(req.user._id)
            }
            const book = await Book.findOneAndUpdate({_id: id}, newBook);
            if (!book) {
                response = createResponse(errorCodesEnum.NOT_FOUND, "", {}, "Book hasn't been found", {});
                return res.status(200).json(response);
            }
            const books = await Book.find({ authorID: req.user._id }).sort({ "created_at": 'desc' })
            response = createResponse(errorCodesEnum.OK, "", [], "Book updated successfully", books);
            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    },
    deleteBook: async (req, res, next) => {
        try {
            const {id} = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                response = createResponse(errorCodesEnum.NOT_FOUND, "", {}, "Book hasn't been found", {});
                return res.status(200).json(response);
            }
            const book = await Book.findByIdAndRemove(id);
            if (!book) {
                response = createResponse(errorCodesEnum.NOT_FOUND, "", {}, "Book hasn't been found", {});
                return res.status(200).json(response);
            }
            const books = await Book.find({ authorID: req.user._id }).sort({ "created_at": 'desc' })
            response = createResponse(errorCodesEnum.OK, "", {}, "Book deleted successfully", books);
            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    },

}

