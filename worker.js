const sql = require('sqlite3').verbose()
const workerpool = require('workerpool')

const dd = require('./dump-dom')
const db = new sql.Database('./archive.db', (err) => {
    if (err) {
        console.error(err)
    }
})

const archivePage = async (url) => {
    workerpool.workerEmit('[-] Proceeding request ..')

    const folderHash = await dd.dumpDOM(url)

    if(folderHash) {
        await db.run(`
            INSERT INTO archive (id, url, hashident)
            VALUES (?, ?, ?)`,
            [null, url, folderHash]
        )
    }

    workerpool.workerEmit('[!] Request done.')
    return true
}

workerpool.worker({
    workerFunction: archivePage
})
