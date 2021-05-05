// import express from 'express'
// require all my modules
require('dotenv').config() /* 
 this will inject all environment variables from our
 .env file into the process.env object
 that is standard in NodeJS.

 We do this so that we can gitignore our .env file
 and load our env variables securely
*/
const express = require('express'); /* 
Express is out HTTP SERVER Framework
*/
const mongoose = require('mongoose'); /* 
 Connects us to MongoDB
 It takes all of our MongoDB data and converts it from
 json to javascript objects.
 Also gives us crud features on MongoDB collections in
 raw js
*/
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { hash, jsonAuth, auth } = require('./controllers/authController');
const SECRET = process.env.SECRET_KEY;
const User = require('./models/User');
// create my variables
const app = express();
const PORT = process.env.PORT || 8080;

// define my database and middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use((req, res, next) => {
    console.log(req.body)
    next()
})
app.use(cors())


mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})

mongoose.connection.once('connected', () => console.log('Connected to Mongo Life is Good'))

app.use('/fruits', require('./controllers/fruitsController'))
app.use('/users', require('./controllers/usersController'))

app.get('/', (req, res) => {
    res.send(`<h1>Hello World</h1>`)
})

//Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = hash(password);

    User.findOne({ username },  (err, foundUser) => {
        if(err){
            res.status(400).json({ msg: err.message })
        } else {
            if(foundUser && bcrypt.compareSync(hashedPassword, foundUser.password)){
                const token = jwt.sign({
                    id: foundUser._id,
                    username: foundUser.username    
                }, SECRET)
                res.status(200).json({ 
                    token,
                    username: foundUser.username 
                })
            } else {
                res.status(500).json({
                    problem: 'The comparison did not work, di you change your hash algo'
                })
            }
        }
    })
})


//Register
app.post('/register', (req, res) => {
    const passwordHash = hash(req.body.password)
    req.body.password = bcrypt.hashSync(passwordHash, bcrypt.genSaltSync(10))
    req.body.username = req.body.username.toLowerCase()
    console.log(req.body)

    User.create(req.body, (err, createdUser) => {
        if(err){
            console.log(err)
            res.status(400).json({
                msg: err.message
            })
        } else {
            const token = jwt.sign({
               id: createdUser._id,
               username: createdUser.username 
            }, SECRET)
            res.status(200).json({
                token
            })
        }
    })
})


// always last
app.listen(PORT, () => console.log('hello i am listening on Port: ', PORT))