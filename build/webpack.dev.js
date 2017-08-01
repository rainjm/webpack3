// 用于开发

const path = require('path');
const Merge = require('webpack-merge');
const webpack = require('webpack');
const CommonConfig = require('./webpack.common.js');
// const ManifestPlugin = require('webpack-manifest-plugin');


const config = Merge(CommonConfig, {
    output: {
        filename: 'js/[name].bundle.js',
        chunkFilename: 'js/[id].chunk.js', // chunk生成的配置
        sourceMapFilename: 'sourceMap/[name].map'
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /components/,
                include: [path.resolve(__dirname, '../src/css')],
                /**
                 * ExtractTextPlugin.extract(arg1,arg2,arg3)
                 *  @arg1: 可选参数，传入一个loader，当css没有被抽取的时候可以使用该loader
                 *  @arg2：必填参数，用于编译解析css文件的loader
                 *  @arg3：额外选，暂只可传publicPath，表示当前loader的路径
                 */
                use: ['style-loader', 'css-loader', 'postcss-loader']

            }, {
                test: /\.css$/,
                exclude: [path.resolve(__dirname, '../src/css')],
                include: [path.resolve(__dirname, '../src/js')],
                // 使用了css-modules功能。localIdentName=[path][name]__[local]___[hash:base64:5]
                use: [
                    'style-loader', {
                        loader: 'css-loader',
                        options: {
                            camelCase: true, // 拼接可以直接驼峰调用，dialog-close ==> ${style.dialogClose}
                            localIdentName: '[name]__[local]--[hash:base64:5]',
                            importLoaders: 1, // 允许配置css-loader应用于@import资源之前的加载器数量
                            modules: true
                        }
                    },
                    'postcss-loader'
                ]
            }, {
                test: /\.(jpe?g|png|gif|svg)$/i,
                // use: ['url-loader?limit=8192&name=images/[name].[ext]?[hash:8]'],    // 这里指定了输出目录
                use: [
                    {
                        loader: 'url-loader?limit=8192&name=images/[name].[ext]?[hash:8]'
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // 启用 HMR
    ],
    devServer: {
        hot: true, // 告诉 dev-server 我们在使用 HMR
        contentBase: path.join(__dirname, '../dist'),
        compress: true,
        port: 9000
    }
});

module.exports = config;
