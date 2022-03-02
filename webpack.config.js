const path = require('path')

module.exports = {
    devtool: false,
    mode:'development',
    entry:'./index',
    output: {
        filename:'main.js',
        path:path.resolve('dist')
    }
}