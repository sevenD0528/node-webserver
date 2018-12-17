const yargs = require('yargs');
const Server = require('./app');

const argv = yargs
.usage('nodewebserver [options]')
.options('p', {
    alias: 'port',
    describe: '端口号',
    default: 3000
})
.options('h', {
    alias: 'hostname',
    describe: 'host',
    default: '127.0.0.1'
})
.options('d', {
    alias: 'root',
    describe: 'root path',
    default: process.cwd()
})
.version()
.alias('v', 'version')
.help()
.argv;

const server = new Server(argv);

server.start();