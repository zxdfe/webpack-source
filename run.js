// 1. 引入原生的webpack 和配置信息
const webpack = require('webpack')
const config = require('./webpack.config')

// 2. 调用 webpack 方法, 传入配置信息 获取 complier 实例
const compiler = webpack(config)

// 3. 调用 complier 身上的 run 方法, 让 webpack 工作
compiler.run((err, stats) => {
    console.log(1111)
})