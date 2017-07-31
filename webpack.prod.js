// 用于生产

const path = require('path');
const Merge = require('webpack-merge');
const webpack = require('webpack');
const CommonConfig = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // 不支持热替换

// const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = Merge(CommonConfig, {
    output: {
        filename: 'js/[name].bundle.[chunkhash].js',
        chunkFilename: 'js/[id].chunk.[chunkhash].js', // chunk生成的配置
        // sourceMapFilename: 'sourceMap/[name].map',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /components/,
                include: [path.resolve(__dirname, 'src/css')],
                /**
                 * ExtractTextPlugin.extract(arg1,arg2,arg3)
                 *  @arg1: 可选参数，传入一个loader，当css没有被抽取的时候可以使用该loader
                 *  @arg2：必填参数，用于编译解析css文件的loader
                 *  @arg3：额外选，暂只可传publicPath，表示当前loader的路径
                 */
                use: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader!postcss-loader'})
            }, {
                test: /\.css$/,
                exclude: [path.resolve(__dirname, 'src/css')],
                include: [path.resolve(__dirname, 'src/js')],
                // 使用了css-modules功能。localIdentName=[path][name]__[local]___[hash:base64:5]
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
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
                })
            }, {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: 'url-loader?limit=8192&name=images/[name].[ext]?[hash:8]'
                    }, {
                        loader: 'image-webpack-loader',
                        options: {
                            gifsicle: {
                                interlaced: false
                            },
                            optipng: {
                                optimizationLevel: 7
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            },
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']), // 构建前清理dist
        new webpack.LoaderOptionsPlugin({minimize: true, debug: false}),
        new ExtractTextPlugin({filename: 'css/[name].[chunkhash].css', disable: false, allChunks: true}),
        // new ManifestPlugin(), // 生成 Manifest.json
        new webpack.optimize.UglifyJsPlugin({ // 压缩
            beautify: false,
            mangle: {
                screw_ie8: true,
                keep_fnames: true
            },
            compress: {
                drop_console: true, // 删除所有的 `console` 语句
                screw_ie8: true, // 兼容
            },
            comments: false, // 删除注释
        })
    ]
});
