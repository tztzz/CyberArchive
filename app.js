const app = require('express')()
const workerpool = require('workerpool')

const pool = workerpool.pool('./worker.js')

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

app.listen(3000, () => console.log('[!] Express server listening on port 3000.'))
