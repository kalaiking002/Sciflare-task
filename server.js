require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')

//custom middlewares
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')

const connectDB = require('./config/dbConnection')

const PORT = process.env.PORT || 3500

connectDB()

app.use(logger)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, './public')))

app.use('/', require('./routes/root'))
app.use('/users', require('./routes/userRoutes'))

app.all('*', (req, res) => {
    const errorMessage = {
        '404' : 'The page you are requested is not found'
    };
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, './views', '404.html'))
    } else if (req.accepts('html')) {
        res.json({ message: errorMessage['404'] })
    } else {
        res.type('txt').send(errorMessage['404'])
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('connected to DB')
    app.listen(PORT, ()=> console.log(`The server is running on PORT: ${PORT}`))
})

mongoose.connection.on('error', (err) => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'dbErrLog.log')
})
