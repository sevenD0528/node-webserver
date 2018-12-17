
const HandleBars = require('handlebars');
const path = require('path');
const fs = require('fs');
const promisify = require('util').promisify;

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

const config = require('./../config/defaultConfig');
const tplPath = path.join(__dirname, './../template/dir.tpl');
const source = fs.readFileSync(tplPath, 'utf-8');
const template = HandleBars.compile(source.toString());

const mime = require('./mime');
const compress = require('./compress');
const range = require('./range');
const isFresh = require('./cache');

module.exports = async function (req, res, filePath) {
    try {
        const stats = await stat(filePath);

        if (stats.isFile()) {
            const contentType = mime(filePath);
            
            res.setHeader('Content-Type', contentType);

            if (isFresh(stats, req, res)) {
                res.statusCode = 304;
                res.end();
                return;
            }
            // fs.createReadStream(filePath).pipe(res);
            let rs;
            const {code, start, end} = range(stats.size, req, res);
            if (code == 200) {
                res.statusCode = 200;
                rs = fs.createReadStream(filePath);
            }
            else {
                res.statusCode = 206;
                rs = fs.createReadStream(filePath, {start, end})
            }
            // let rs = fs.createReadStream(filePath);
            if (filePath.match(config.compress)) {
                rs = compress(rs, req, res);
            }
            rs.pipe(res);
        }
        else if (stats.isDirectory()) {
            const files = await readdir(filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            const dir = path.relative(config.root, filePath);
            const data = {
                title: path.basename(filePath),
                dir: dir ? `/${dir}`: '',
                files: files.map((item) => {
                    return {
                        item,
                        icon: mime(item)
                    }
                })
            }
            res.end(template(data));
        }
    } catch (error) {
        console.error(error)
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`${filePath} is not a directory or file\n ${error.toString()}`);
    }
}