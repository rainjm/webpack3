// 用于生产

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const ManifestPlugin = require('webpack-manifest-plugin');
// const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// 高效压缩CSS文件束(bundle)的体积 https://zhuanlan.zhihu.com/p/28019808
// const generateScopedName = (localName, resourcePath) => {
//     const componentName = resourcePath.split('/').slice(-2, -1);
//
//     return `${componentName}_${localName}`;
// };
//
const incstr = require('incstr');

const createUniqueIdGenerator = () => {
    const index = {};

    const generateNextId = incstr.idGenerator({
        // Removed "d" letter to avoid accidental "ad" construct.
        // @see https://medium.com/@mbrevda/just-make-sure-ad-isnt-being-used-as-a-class-name-prefix-or-you-might-suffer-the-wrath-of-the-558d65502793
        alphabet: 'abcefghijklmnopqrstuvwxyz0123456789'
    });

    return (name) => {
        if (index[name]) {
            return index[name];
        }

        let nextId;

        do {
            // Class name cannot start with a number.
            nextId = generateNextId();
        } while (/^[0-9]/.test(nextId));

        index[name] = generateNextId();

        return index[name];
    };
};

const uniqueIdGenerator = createUniqueIdGenerator();

const generateScopedName = (localName, resourcePath) => {
    const componentName = resourcePath.split('/').slice(-2, -1);

    return `${uniqueIdGenerator(componentName)}_${uniqueIdGenerator(localName)}`;
};

const config = {
    entry: {
        vendors: ['jquery'],
        app: './src/js/page/index.js',
        list: './src/js/page/list.js',
        about: './src/js/page/about.js'
    },
    output: {
        filename: 'js/[name].bundle.[chunkhash].js',
        // filename: '[name].bundle.js', // 不要在开发环境下使用 [chunkhash]，因为这会增加编译时间
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/', // 引用资源路径 （服务器）
        chunkFilename: 'js/[id].chunk.[chunkhash].js', // chunk生成的配置
        // sourceMapFilename: 'sourceMap/[name].map',
    },
    // devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'eslint-loader']
            }, {
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
                                camelCase: true,
                                localIdentName: '[name]__[local]--[hash:base64:5]',
                                getLocalIdent: (context, localIdentName, localName) => {
                                    const obj = generateScopedName(localName, context.resourcePath);
                                    return obj;
                                },
                                importLoaders: 1,
                                modules: true
                            }
                        },
                        'postcss-loader'
                    ]
                })
            }, {
                // html模板加载器，可以处理引用的静态资源，默认配置参数attrs=img:src，处理图片的src引用的资源
                // 比如你配置，attrs=img:src img:data-src就可以一并处理data-src引用的资源了
                test: /\.html$/,
                use: ['html-loader?attrs=img:src img:data-src']
            }, {
                test: /\.(jpe?g|png|gif|svg)$/i,
                // use: ['url-loader?limit=8192&name=images/[name].[ext]?[hash:8]'],    // 这里指定了输出目录
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
            }, {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['url-loader?name=fonts/[name].[ext]?[hash:8]']
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({ // 加载jq
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new CleanWebpackPlugin(['dist']), // 构建前清理dist
        // new ExtractTextPlugin('css/[name].[chunkhash].css'), // 单独使用style标签加载css并设置其路径 , 热替换不支持
        new ExtractTextPlugin({filename: 'css/[name].[chunkhash].css', disable: false, allChunks: true}),
        new webpack.optimize.CommonsChunkPlugin({ // 代码分离，防止重复
            // https://github.com/webpack/webpack/issues/1016#issuecomment-182093533 （'call' 等错误， 需要在入口指定 对应 vendors）
            name: 'vendors', // 将公共模块提取，生成名为`vendors`的 chunk ,如果有多个name=》names: ['vendor2', 'vendor1'],供应商块是相反的顺序。
            chunks: [ // 提取哪些模块共有的部分
                'app',
                'list',
                'about'
            ],
            minChunks: 3, // 单独文件最小引用数，如设置3，表示同一个模块只有被3个以外的页面引用时才打包
            // minChunks: (module) => {
            //     // This prevents stylesheet resources with the .css or .scss extension
            //     // from being moved from their original chunk to the vendor chunk
            //     if (module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
            //         // return false;
            //     }
            //     return module.context && module.context.indexOf('node_modules') !== -1;
            // }
        }),
        new HtmlWebpackPlugin({ // 根据模板插入css/js等生成最终HTML
            favicon: './src/img/favicon.ico', // favicon路径，通过webpack引入同时可以生成hash值
            filename: './index.html', // 生成的html存放路径，相对于path
            template: './src/view/index.html', // html模板路径
            inject: true, // js插入的位置，true/'head'/'body'/false
            // hash: true, // 为静态资源生成hash值
            chunks: [ // 需要引入的chunk，不配置就会引入所有页面的资源
                'vendors',
                'app'
            ],
            // title: '标题', // 可在模板中 <%= htmlWebpackPlugin.options.title %> 获取并输出
            // minify: { // 压缩HTML文件
            //     removeComments: true, // 移除HTML中的注释
            //     collapseWhitespace: false // 删除空白符与换行符
            // }
        }),
        new HtmlWebpackPlugin({ // 根据模板插入css/js等生成最终HTML
            favicon: './src/img/favicon.ico', // favicon路径，通过webpack引入同时可以生成hash值
            filename: './list.html', // 生成的html存放路径，相对于path
            template: './src/view/list.html', // html模板路径
            inject: true, // js插入的位置，true/'head'/'body'/false
            // hash: true, // 为静态资源生成hash值
            chunks: [ // 需要引入的chunk，不配置就会引入所有页面的资源
                'vendors',
                'list'
            ]
        }),
        new HtmlWebpackPlugin({ // 根据模板插入css/js等生成最终HTML
            favicon: './src/img/favicon.ico', // favicon路径，通过webpack引入同时可以生成hash值
            filename: './about.html', // 生成的html存放路径，相对于path
            template: './src/view/about.html', // html模板路径
            inject: true, // js插入的位置，true/'head'/'body'/false
            // hash: true, // 为静态资源生成hash值
            chunks: [ // 需要引入的chunk，不配置就会引入所有页面的资源
                'vendors',
                'about'
            ]
        }),
        new webpack.LoaderOptionsPlugin({minimize: true, debug: false}),
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
        }),
        // new ManifestPlugin(), // 生成 Manifest.json
        // new webpack.HotModuleReplacementPlugin(), // 启用 HMR
        new BundleAnalyzerPlugin({

            analyzerMode: 'server',
            // 可以是`server`，`static`或`disabled'。
            // 在`server`模式下，分析器将启动HTTP服务器显示捆绑报告。
            // 在“static”模式下，将生成包含捆绑报告的单个HTML文件。
            // 在“disabled”模式下，您可以使用此插件通过将“generateStatsFile”设置为“true”来生成Webpack Stats JSON文件。

            analyzerHost: '127.0.0.1',
            // 将在“server”模式下使用的主机启动HTTP服务器。

            analyzerPort: 8888,
            // 端口将以`server`模式用于启动HTTP服务器。

            reportFilename: 'report.html',
            // 将以“static”模式生成的绑定报告文件的路径。
            // 相对于捆绑输出目录。

            openAnalyzer: true,
            // 在默认浏览器中自动打开报告

            generateStatsFile: false,
            // 如果是“true”，则WebpackStats JSON文件将生成在bundle的输出目录中

            statsFilename: 'stats.json',
            // 如果`generateStatsFile`为`true`，将会生成WebpackStats JSON文件。
            // 相对于捆绑输出目录。

            // Options for `stats.toJson()` method.

            // For example you can exclude sources -->
            // --> of your modules from stats file with `source: false` option.
            // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
            statsOptions: null,
            // Log level. Can be 'info', 'warn', 'error' or 'silent'.
            logLevel: 'info'
        })
    ],
    // devServer: {
    //     hot: true, // 告诉 dev-server 我们在使用 HMR
    //     contentBase: path.join(__dirname, 'dist'),
    //     compress: true,
    //     port: 9000
    // }
};

module.exports = config;
