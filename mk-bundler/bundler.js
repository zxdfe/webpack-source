const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')

const moduleAnalyser = (fileName) => {
    // fs模块根据路径读取模块内容(index.js)
    const content = fs.readFileSync(fileName, 'utf-8')
    const ast = parser.parse(content, {
        sourceType: 'module'
    })

    const dependencies = {}

    traverse(ast, {
        ImportDeclaration ({ node }) {
            const dirname = path.dirname(fileName)
            const absoluteFile = `./${path.join(dirname, node.source.value)}`
            dependencies[node.source.value] = absoluteFile;
            // dependencies.push(node.source.value) = absoluteFile
            // console.log(dependencies)
        }
    })
    // ES6 转换为ES5
    const { code } = babel.transformFromAst(ast, null, {
        presets: ["@babel/preset-env"]
    })
    // console.log(code)
    return {
        fileName,
        dependencies,
        code
    }
    // console.log(dependencies)
    // console.log(ast.program.body)
}

const makeDependenciesGraph = (entry) => {
    const entryModule = moduleAnalyser(entry)

    const graphArray = [entryModule]

    for (let i = 0; i < graphArray.length; i++) {
        const item = graphArray[i]
        const { dependencies } = item
        if (dependencies) {
            for (let j in dependencies) {
                graphArray.push(moduleAnalyser(dependencies[j]))
            }
        }
    }
    // console.log(graphArray)
    // 转换格式 {}
    const graph = {}
    graphArray.forEach(item => {
        graph[item.fileName] = {
            dependencies: item.dependencies,
            code: item.code
        }
    })
    // console.log(graph)
    return graph   
}

const generateCode = (entry) => {
    const graph = JSON.stringify(makeDependenciesGraph(entry))
    return `
    (function(graph){
        function require(module) {
            function localRequire(relativePath) {
                return require(graph[module].dependencies[relativePath])
            }
            var exports = {};
            (function(require, exports, code){
                eval(code)
            })(localRequire, exports, graph[module].code);
            return exports;
        };
        require('${entry}')
    })(${graph});
    `
}


const code = generateCode('./src/index.js')
// console.log(graphInfo)
console.log(code)

