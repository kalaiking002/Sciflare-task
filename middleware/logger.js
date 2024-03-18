const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async (message, logFileName) => {
    const dateTime = format(new Date(), 'yyyy-MM-dd\tHH:mm:ss')
    const logItem = `${dateTime}\t${uuid()}:\t${message}\n`
    const logPath = path.join(__dirname, '../logs')

    try {
        if (!fs.existsSync(logPath)) {
            await fsPromises.mkdir(logPath)
        }
        await fsPromises.appendFile(`${logPath}/${logFileName}`, logItem)
    } catch (e) {
        console.log(e)
    }
}

const logger = (req, res, next) => {
    const message = `${req.method}\t${req.url}`
    logEvents(`${message}\t${req.headers.origin}`, 'reqLog.log');
    console.log(message);
    next()
}

module.exports = { logEvents, logger }