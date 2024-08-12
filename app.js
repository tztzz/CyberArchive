const app = require('express')()
const sql = require('sqlite3').verbose()
const workerpool = require('workerpool')
const path = require('path')
const cors = require('cors')

const corsOptions = {
    origin: '*',
    optionsSucessStatus: 200
}

const pool = workerpool.pool('./worker.js')
const db = new sql.Database('./archive.db', (err) => {
    if (err) {
        console.error(err)
    }
    db.exec(`
        CREATE TABLE IF NOT EXISTS archive(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            hashident TEXT NOT NULL
        ) STRICT
    `)
})

app.get('/', (req, res) => {
    res.send(pool.stats())
})

app.get('/archive', (req, res) => {
    const url = req.query.url

    pool.exec('workerFunction', [url], {
        on: msg => console.log(msg)
    }).then(result => {
        res.send({'output': result})
    }).catch(err => {
        res.send({'output': 'proceeding error'})
        console.error(err)
    }).then(() => {
        pool.terminate()
    })
})

app.get('/entries', cors(corsOptions), async(req, res) => {
    db.all('SELECT * FROM archive', [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    })
})

app.get('/read/favicon', cors(corsOptions), (req, res) => {
    const fileHash = req.query.hash
    res.sendFile(path.join(__dirname, `data/${fileHash}/favicon.png`))
})

app.get('/read/dom', cors(corsOptions), (req, res) => {
    const fileHash = req.query.hash
    res.sendFile(path.join(__dirname, `data/${fileHash}/dom.html`))
})

app.get('/read/readability', cors(corsOptions), (req, res) => {
    const fileHash = req.query.hash
    res.sendFile(path.join(__dirname, `data/${fileHash}/readability.html`))
})

app.get('/read/metadata', cors(corsOptions), (req, res) => {
    const fileHash = req.query.hash
    res.sendFile(path.join(__dirname, `data/${fileHash}/metadata.json`))
})

app.get('/read/headers', cors(corsOptions), (req, res) => {
    const fileHash = req.query.hash
    res.sendFile(path.join(__dirname, `data/${fileHash}/headers.json`))
})

app.listen(3000, () => console.log('[!] Express server listening on port 3000.'))
