const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        path: path.join(__dirname, 'dist/'),
        filename: `index.js`,
    },
    module: {
        rules: [
            {
                test: /\.js/,
                exclude: /node_modules/,
                options: {
                    cacheDirectory: true,
                    presets: [
                        '@babel/preset-env',
                        ['@babel/preset-react', { runtime: 'automatic' }],
                    ],
                },
                loader: 'babel-loader',
            },
        ],
    },
    // optimization: {
    //     minimize: true,
    //     minimizer: [new TerserPlugin({
    //         extractComments: false,
    //         terserOptions: {
    //             mangle: false, // 禁用变量名混淆
    //             keep_fnames: true, // 保留函数名
    //             keep_classnames: true, // 保留类名
    //             compress: {
    //                 drop_console: false, // 可选择是否移除 console.log，设为 true 可移除
    //             },
    //             format: {
    //                 beautify: true, // 可选：格式化输出，便于阅读
    //                 comments: true, // 保留注释
    //             },
    //         },
    //     })],
    // },
};