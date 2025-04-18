// 在postcss.config.js文件中：
// 此文件是PostCss的配置文件，名字必须叫postcss.config.js！
// 当PostCss运行的时候，此配置文件会告诉PostCss该如何转译我们的代码；
// 因为PostCss不是运行在browser中，而是运行在Node环境中，而Node默认的是CommonJS规范；
// 因此，这里要使用CommonJS语法；
// 那么如果想使用ES module：
// 第一步：将postcss.config.js后缀改成mjs，即PostCss.config.mj；
// 第二步：在package.json文件中添加：type: "module"；
// 之后就可以在此文件使用ES module语法了；
const autoprefixer = require("autoprefixer");
const cssnanoPlugin = require("cssnano");
const  postcssPxtorem= require("postcss-pxtorem");
module.exports = {
    // PostCss使用的插件有哪些；
    plugins: [
        // 自动为我们的 CSS 添加浏览器厂商前缀（如 -webkit-、-moz-）；
        autoprefixer,
        // CSS 压缩工具，用来 压缩生成的 CSS 文件；
        cssnanoPlugin,
        // 自动将 CSS 中的 px 转换成 rem；
        // propList定义了哪些css属性需要将px转成rem；
        postcssPxtorem({
            propList: ['*']
        })
    ]
}