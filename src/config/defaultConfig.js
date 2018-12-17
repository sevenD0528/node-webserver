module.exports = {
    port: 3000,
    hostname: '127.0.0.1',
    root: process.cwd()+ '/src', // 当前文件夹
    compress: /\.(html|js|css|md)/,
    cache: {
        maxAge: 600,
        expires: true,
        cacheControl: true,
        lastModified: true,
        etag: true
    }
}