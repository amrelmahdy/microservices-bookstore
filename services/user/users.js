const express = require("express")
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require("passport")
const JWTStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require("passport-jwt")
const { jwt_secret ,errorCodesEnum } = require("./config")
const { createResponse } = require("./helpers")
const User = require("./User");


const app = express()

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



/************************************/
// Database connection
mongoose.set('useFindAndModify', false)
const DBName = "users"
const DBUsername = "root"
const DBPassword = "yje4OnmqCDdufjED"
const uri = `mongodb+srv://${DBUsername}:${DBPassword}@cluster0.zcmrs.mongodb.net/${DBName}?retryWrites=true&w=majority`
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
}, (error) => {
    if (error) {
        console.log(error)
    } else {
        console.log("Connected to database successfully");
    }
});
/************************************/

app.use("/public", express.static(path.join(__dirname, "public")));


//handling Cross Origins
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
});



// configure passport
const JWT_opts = {}
JWT_opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
JWT_opts.secretOrKey = jwt_secret
passport.use(new JWTStrategy(JWT_opts, async (payload, done) => {
    try {
        const user = await User.findOne({ _id: payload.id })
        if (!user) {
            done(null, false)
        }
        done(null, user);
    } catch (err) {
        done(null, false);
    }
}))



// API routes
const userApiRoutes = require("./routes");
// Fire API Routes
app.use("/auth/", userApiRoutes);

// Handle validation
app.use((err, req, res, next) => {
    if (err && err.error && err.error.isJoi) {
        // we had a joi error, let's return a custom 400 json response
        response = createResponse(errorCodesEnum.CONFLICT, "", err.error, "Error on validation ... ", {});
        res.status(200).json(response);
        return;
    } else {
        // pass on to another error handler
        next(err);
    }
});



const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`app is listening to port : ${port}`)
})