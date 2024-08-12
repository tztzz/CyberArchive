const workerpool = require('workerpool')
const dd = require('./dump-dom')

const archivePage = async (url) => {
    workerpool.workerEmit('[-] Proceeding request ..')
    await dd.dumpDOM(url)
    workerpool.workerEmit('[!] Request done.')

    return true
}

workerpool.worker({
    workerFunction: archivePage
})
