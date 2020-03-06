// webpack 一个现代的js应用程序静态模块打包器（module bundler）

// Entry 入口起点（entry point）指示webpack应该使用哪个模块，来作为构建其内部依赖图的开始

// Output 输出在什么位置

// Module 模块，在webpack里一切比模块，一个模块对应着一个文件。Webpack递归找出依赖的模块

// Chunk 代码块 一个Chunk由多个模块组合而成，用于代码合并与分割

// Loader loader让webpack去处理那些非js文件 将所有类型转换为能够处理的有效模块

// Plugin 从打包优化和压缩，一直到重新定义环境中的变量等

// 流程
// 1.初始化参数：从配置文件和Shell 语句中读取与合并参数，得出最终的参数
// 2.开始编译：用一步得到的参数初始化Compiler 对象，加载所有配置的插件，执行对象的run方法开始执行编译
// 3.确定入口：根据配置中的entry找出所有的入口文件
// 4.编译模块：从入口文件出发，调用所有配置的Loader对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有的入品
// 文件都经过了本步骤的处理
// 5.完成模块的编译：在经过第4步使用loader翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系
// 6.输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的Chunk,再把每个Chunk转换成一个单独的文件加入到
// 输出列表，这步是可以修改输出内容的最后机会
// 7.输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

// 在以上过程中，webpack会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以
// 调用webpack的api改变webpack的运行结果

// webpack.config.js
const path = require('path');
module.exports = {
    entry: './src/index.js',
    output: path.resolve(__dirname + './dist/'),
    filename: 'main.js',
}

// 

const fs = require('fs');
const parser = require('@bable/parser'); // parser 解析
const options = require('./webpack.config');
const traverse = require('@babel/traverse').default; // 遍历
const { transformFromAst} = require('@babel/core');

const Parser = {
    getAst: path => { // 获取AST
        // 读取入口文件
        const content = fs.readFileSync(path, 'utf-8');
        // 将文件 内容 转为AST抽象语法树
        return parser.parse(content, {sourceType: 'module'})
    },
    getDependecies: (ast, filename) =>{ // 找出所有依赖模块
        const dependecies = {};
        // 遍历所有的import模块，存入dependecise
        traverse(ast, {
            // 类型为ImportDeclaration 的AST节点（即import语句）
            ImportDeclaration({node}) {
                const dirname = path.dirname(filename);
                // 保存依赖模块路径，之后生成依赖关系图要用
                const filepath = './' + path.join(dirname, node.source.value);
                dependecies[node.source.value] = filepath;
            }
        });
        return dependecies;
    },
    getCode: ast => { // 将AST语法树转化为浏览器可执行代码
        const { code } = transformFromAst(ast, null, {
            presets: ['@babel/preset-env'] // preset 预设
        });
        return code;
    }
}

class Compiler {
    constructor(options) {
        // webpack配置
        const {entry, output} = options;
        // 入口
        this.entry = entry;
        // 出口
        this.output = output;
        // 模块 一个文件就是一个模块
        this.modules = [];
    }
    // 构建启动
    run(){
        // 解析入文件
        const info = this.build(this.entry);
        this.modules.push(info);
        this.modules.forEach(({dependecies}) => {
            if (dependecies) { // 判断是否有依赖
                for (const dependency in dependecies) {
                    this.modules.push(this.build(dependency.filename))
                }
            }
        });
        // 生成依赖关系图
        const dependencyGraph = this.modules.reduce((graph, item) => ({
            ...graph, // 在对象里面展开对象
            // 使用文件路作为每个模块的唯一标识符，保存对应模块的依赖对象和文件内容
            [item.filename]: {
                dependecies: item.dependecies,
                code: item.code,
            }
        }), {});
        this.generate(dependencyGraph);

    }

    bind(filename) {
        const {getAst, getDependecies, getCode} = Parser;
        const ast = getAst(this.entry);
        const dependecies = traverse(ast, this.entry);
        const code = getCode(ast);
        return {
            filename, // 文件路径，可以作为每个模块的唯一标识符
            dependecies, // 依赖对象，保存着依赖模块路径
            code, // 文件内容
        }
    }
    // 重写 require函数，输出bundle
    generate(code) {
        // 输出文件路径
        const filePath = path.join(this.output.path, this.output.filename);
        // 
        const bundle = `
            (function (graph) {
                function require(module) {
                    function localRequire(relativePath) {
                        return require(graph[module].dependecies[relativePath])
                    }
                    var exports = {};
                    (function (require, exports, code) {
                        eval(code);
                    })(localRequire, exports, graph[module].code);
                    return exports;
                }
                require('${this.entry}')
            })(${JSON.stringify(code)});
        `;
        // 把文件内容写到文件系统
        fs.writeFileSync(filePath, bundle, 'utf-8');

    }
};

(function(graph) {
    function require(moduleId) {
        function localRequire(relativePath) {
            return require(graph[moduleId].dependecies[relativePath]);
        }
        var exports;
        (function(require, exports, code) {
            eval(code);
        })(localRequire, exports, graph[moduleId.code]);
        return exports;
    }
    require('./src/index.js');
})({
    './src/index.js': {
        dependecies: {'./hello.js': './src/hello.js'},
        code: '"use strict";\n\nvar _hello = require("./hello.js");\n\ndocument.write((0, _hello.say)("webpack"));',
    },
    './src/hello.js': {
        dependecies: {},
        code: '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.say = say;\n\nfunction say(name) {\n  return "hello ".concat(name);\n}'
    }
});