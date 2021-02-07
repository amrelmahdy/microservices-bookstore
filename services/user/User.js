const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcryptjs = require('bcryptjs')

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter a full name'],
    },
    email: {
        type: String,
        index: true,
        unique: true,
        lowercase: true
    },
    password: String,
    books: [mongoose.Schema.Types.ObjectId],
    created_at: {
        type: Date,
        default: Date.now()
    }
})

const User = mongoose.model("user", userSchema)
module.exports = User


module.exports.saveUser = async (newUser) => {
    return new Promise(async (resolve, reject) => {
        const salt = await bcryptjs.genSalt(10)
        try {
            const hash = await bcryptjs.hash(newUser.password, salt)
            newUser.password = hash
            newUser.save((err, user) => {
                if (err) {
                    reject({
                        msg: "Error creating user",
                        error: err
                    })
                } else {
                    resolve(user)
                }
            })
        } catch (error) {
            reject({
                msg: "Error hashing password",
                error: error
            })
        }
    })
}

module.exports.findByQuery = (query) => {
    return new Promise(async (resolve, reject) => {
        let user = await User.findOne(query)
        if (user) {
            resolve(user)
        } else {
            reject({
                msg: "User not found"
            })
        }
    })
}

module.exports.userAlreadyExists = async (query) => {
    try {
        const user = await User.findByQuery(query)
        return user
    } catch (err) {
        return null
    }
}


module.exports.comparePassword = (password, hash) => {
    return new Promise((resolve, reject) => {
        bcryptjs.compare(password, hash, (err, isMatch) => {
            if (err) {
                reject({
                    error: err
                })
            } else {
                if (!isMatch) {
                    reject({
                        msg: "Wrong username/email and password combination"
                    })
                } else {
                    resolve({
                        isMatch: isMatch
                    })
                }
            }

        })
    })
}