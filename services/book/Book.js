const mongoose = require("mongoose")
const Schema = mongoose.Schema

const bookSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter a full name'],
    },
    description: String,
    authorID: mongoose.Schema.Types.ObjectId,
    created_at: {
        type: Date,
        default: Date.now()
    }
})

const Book = mongoose.model("books", bookSchema)
module.exports = Book