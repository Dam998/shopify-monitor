let Log = {}

Log.Info = (message) => {
    console.log('\x1b[37m', `[INFO   ]`, '\x1b[0m', message)
}

Log.Warning = (message) => {
    console.log('\x1b[33m', '[WARNING]', '\x1b[0m', message)
}

Log.Error = (message) => {
    console.log('\x1b[31m', `[ERROR  ]`, '\x1b[0m', message)
}

module.exports = Log;