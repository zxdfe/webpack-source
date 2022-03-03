
const fs = require('fs');
const parser = require('@babel/parser')
// const traverse = require('babel-traverse').default;
const traverse = require('@babel/traverse').default
// const { transformFromAst } = require('babel-core');
const babel = require('@babel/core')

module.exports = {
    getAST: (path) => {
        const content = fs.readFileSync(path, 'utf-8')

        return parser.parse(content, {
            sourceType: 'module'
        })
    },
    getDependencis: (ast) => {
        const dependencies = []
        traverse(ast, {
          ImportDeclaration: ({ node }) => {
            dependencies.push(node.source.value);
          }
        });
        // traverse(ast, {
        //     ImportDeclaration ({ node }) {
        //         const dirname = path.dirname(fileName)
        //         const absoluteFile = `./${path.join(dirname, node.source.value)}`
        //         dependencies[node.source.value] = absoluteFile;
        //         // dependencies.push(node.source.value) = absoluteFile
        //         // console.log(dependencies)
        //     }
        // })
        return dependencies;
    },
    transform: (ast) => {
        // const { code } = transformFromAst(ast, null, {
        //     presets: ['env']
        // });
        // ES6 转换为ES5
        const { code } = babel.transformFromAst(ast, null, {
            presets: ["@babel/preset-env"]
        })
      
        return code;
    }
};