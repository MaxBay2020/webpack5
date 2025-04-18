const path = require("path")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
// development使用的值
let mode = 'development'
let devtool = 'eval-cheap-module-source-map'

// 因为在package.json文件中，有个script：build-prod，里面为NODE_DEV赋值为production；
// 当运行此script，就会影响这个理的值；
if(process.env.NODE_ENV === 'production'){
    // production使用的值
    mode = 'production'
    /***
     * devtool的值会影响source map的生成方式，也就是会影响：
     * 调试体验（你能不能在浏览器中看到真实源代码）、构建速度、输出体积、安全性（是否暴露源代码）
     * 什么是source map?
     * 它是打包后的代码和原始源码之间的映射表，
     * 让我们在浏览器里调试时，看到的不是 bundle 后的乱七八糟的代码，而是你写的 .js、.ts、.jsx、.vue 等源码；
     * development阶段使用'eval-cheap-module-source-map'，构建快，调试方便，因为能看到源码；
     * production阶段使用'hidden-source-map'，可以上传.map文件到error tracking平台，如Sentry，不会暴露源码，安全；
     */
    devtool = 'hidden-source-map' // 或者赋值false
}

module.exports = {
    mode,
    // devServer只有在安装了webpack-dev-server包才能使用；
    devServer: {
        static: {
            // 注意！启动webpack serve之后，serve的是dist里的内容，也就是bundle之后的内容，而不是开发阶段的内容！
            // 因此这里指向的是dist/index.html
            directory: path.join(__dirname, 'dist')
        },
        port: 8080,          // 指定server的port
        open: true,          // 自动打开浏览器
        compress: true,      // 启动 gzip 压缩
        hot: true            // 启用 HMR 热更新
    },
    output: {
        // assetModuleFilename用来告诉webpack，在打包的时候，asset文件，如image，font文件打包到dist的路径
        // 默认值是'[hash][ext][query]'，也就是dist目录下；
        // 这里更好的管理image和font文件；
        assetModuleFilename: 'assets/[hash][ext][query]',
        // 如果要使用clean的plugin或者使用output.clean: true，这里必须告诉webpack，要清空的路径；
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                // 支持js和jsx文件，x?表示x可有可无；
                test: /\.jsx?$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                // 支持css文件、scss文件和sass文件；
                test: /\.(s[ac]|c)ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
            },

            {
                // 图片处理；webpack会从入口文件开始扫描，遇到import图片的时候，就会按下面的规则将图片复制到dist文件夹中；
                // i表示不区分大小写，ignore case
                test: /\.(png|jpe?g|gif|svg|webp)$/i,
                /***
                 * type的值有：
                 * 'asset/resource'：拷贝文件到dist并在文件名上加上hash，并返回其 URL，适用于图片、字体、视频，使用方法如import logo from './logo.png'；
                 * 'asset/inline'：将资源转成base64编码字符串嵌入到HTML/JS，适用于小图标、SVG，使用方法如import icon from './icon.svg'；
                 * 'asset'：webpack自动判断：小图生成base64，嵌入HTML/JS，大图生成文件到dist中国呢，适用于小图 + 大图混用场景，使用方法如import img from './bg.jpg，判断大图还是小图的分界线的默认值是8 * 1024，即8kb；
                 * 'asset/source'：读取原始内容，作为字符串引入（源码形式），适用于.txt, .md, .svg，使用方法如import txt from './README.md'；
                 */
                type: 'asset',
                // 当上面的type的值是asset时，会采用下面的规则，即文件多大以下，我就用 base64 内联它；否则就拷贝成一个文件；
                parser: {
                    // 专门针对 type: 'asset' 类型的文件，，用来判断是否要把资源转成 base64；
                    dataUrlCondition: {
                        maxSize: 10 * 1024 // 小于 10kb 的图片会转成 base64，大于 10kb 的图片按照type为asset/resource来处理；
                    }
                }

            }

        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // 定义最终打包好的css文件叫main.cs；
            filename: 'main.css'
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html', // 使用我们自己的模板，如果有的话；
            filename: 'index.html',          // 输出的 HTML 文件名；
            title: 'Webpack App',         // 设置html的title属性值，注意！title的值只有在没有提供template的时候其作用；
            inject: 'body',                  // 将 <script> 注入到 <body> 末尾；
            // favicon: './public/favicon.ico', // 添加网页图标，如果有的话；
            minify: {
                // 折叠html中多余的空白字符；
                collapseWhitespace: true,
                //删除html中的注释；
                removeComments: true,
            }
        }),
        new CleanWebpackPlugin({
            // 因为webpack clean plugin默认情况下，只会删除由webpack构建出来的文件，不会删除手动创建的文件；
            // 如果想删除所有文件，使用下面的方法；
            // cleanOnceBeforeBuildPatterns:  ['**/*']表示删除所有文件，包括webpack构建的文件和手动创建的文件；，
            cleanOnceBeforeBuildPatterns: ['**/*']
        }),
        new ReactRefreshWebpackPlugin()

    ],
    resolve: {
        // 当我们在代码中 import 一个模块时，如果没有写后缀，比如 import App from './App'，
        // Webpack 会按照这里的扩展名顺序自动尝试补全后缀去找文件；
        extensions: ['.js', '.jsx'] // 👈 告诉 Webpack 支持这两种扩展
    },
}