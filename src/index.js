const http = require('http');

const port = process.env.PORT || 3000
const DEBUG_DELAY = 2000                          // just for demonstrate that it really doesn't receive requests after 4s
const READINESS_PROBE_DELAY = 2 * 2 * 1000 
let wasSigTerm = false;

function gracefulStop() {
    console.log('Server is shutting down...', new Date().toISOString())
    
    //TODO: do shutdown stuff
    server.close();

    console.log('Successful graceful shutdown', new Date().toISOString())
    process.exit(0) 
}

process.on('SIGTERM', () => {
    console.log('Got SIGTERM. Graceful shutdown start', new Date().toISOString());
    wasSigTerm = true;

    setTimeout(gracefulStop, READINESS_PROBE_DELAY + DEBUG_DELAY)
    //setTimeout(gracefulStop, 1000)
});

process.on('SIGINT', () => {
    console.log('Got SIGINT. Graceful shutdown start', new Date().toISOString());
    wasSigTerm = true;

    setTimeout(gracefulStop, READINESS_PROBE_DELAY + DEBUG_DELAY)
    //setTimeout(gracefulStop, 1000)
});

function readiness(req, res) {
    if (wasSigTerm) {
        console.log('READY: NOT OK');
        res.writeHead(500);
        return res.end('not ok');
    }

    // TODO: test depenecies

    console.log('READY: OK');
    res.writeHead(200);
    return res.end('ok');
}

function liveliness(req, res) {
    console.log("ALIVE: yes");

    res.writeHead(200);
    return res.end('ok');
}

function normalreq(req, res) {
    console.log(`REQ:  ${req.url}`)
    res.writeHeader(200);

    const delay = Math.floor(Math.random() * 2000) + 750 

    setTimeout(function() {
        return res.end('foo');
    }, delay);
}

const server = http.createServer((req, res) => {
    if (wasSigTerm) {
        console.log(`**** Request after sigterm: ${req.url}`, new Date().toISOString());
    }

    if (req.method === 'GET' && req.url.match(/\/ready/)) {
        return readiness(req,res);
    }

    if (req.method === 'GET' && req.url.match(/\/alive/)) {
        return liveliness(req,res);
    }

    return normalreq(req,res);
    //console.log(`REQ:  ${req.url}`)
    //res.writeHeader(200);
    //res.end('foo');
});

server.listen(port, () => {
    console.log(`App is listening on port: ${port}`)
});