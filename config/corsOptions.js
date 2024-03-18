const allowedOrigins = require('./allowedORigins')

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by cors'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions