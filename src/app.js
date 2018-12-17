const http = require('http');
const conf = require('./config/defaultConfig');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const promisify = require('util').promisify;
const route = require('./utils/route');
const openUrl = require('./utils/openUrl');

// const stat = promisify(fs.stat);
// const readdir = promisify(fs.readdir);

class Server {
    constructor (config) {
        this.conf = Object.assign({}, conf, config);
    }

    start() {
        const server = http.createServer(async (req, res) => {
            const url = req.url;
        
            const filePath = path.join(conf.root, url);
            // 改为路由
            route(req, res, filePath);
            // fs.stat(filePath, (err, stats) => {
            //     if (err) {
            //         res.statusCode = 404;
            //         res.setHeader('Content-Type', 'text/plain');
            //         res.end(`${filePath} is not a directory or file`);
            //         return;
            //     }
        
            //     if (stats.isFile()) {
            //         res.statusCode = 200;
            //         res.setHeader('Content-Type', 'text/plain');
            //         fs.createReadStream(filePath).pipe(res);
            //     }
            //     else if (stats.isDirectory()) {
            //         fs.readdir(filePath, (err, files) => {
            //             if (err) {
            //                 throw err;
            //             }
            //             res.statusCode = 200;
            //             res.setHeader('Content-Type', 'text/plain');
            //             res.end(files.join(','));
            //         })
            //     }
            // })
        
            // res.statusCode = 200;
            // res.setHeader('Content-Type', 'text/plain');
            // res.setHeader('Content-Type', 'text/html');
        
            // res.end(filePath);
        
            // res.write('<html>');
            // res.write('<body>');
            // res.write('<p>Hello World</p>')
            // res.write('</body>')
            // res.end('</>')
        
        
            // res.end('Hello World!');
        })
        
        server.listen(this.conf.port, this.conf.hostname, () => {
            const address = `http://${this.conf.hostname}:${this.conf.port}`;
        
            console.log(`Server started at ${chalk.green(address)}`);
            openUrl(address);
        })
    }
}

module.exports = Server;