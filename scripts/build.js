const commonConfig = require('./common')
const { merge } = require('webpack-merge')

module.exports = merge(commonConfig, {
    mode: "production",
    optimization: {
        usedExports: true, // 表示只导出那些外部使用了的那些成员
        minimize: true, // 压缩模块
        concatenateModules: true, // 合并模块
    },
})
