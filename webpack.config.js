const webpack = require('webpack')
const path = require('path')
const entry = require('./webpack/entry');
const extra = require('./webpack/extra');
const entrys = entry(path.resolve(__dirname, './test'));
const ExtraHtmls = extra(path.resolve(__dirname, './test'));
module.exports = {
    entry: entrys,
    output: {
        path: __dirname + '/js',
        filename: '[name].js'
    },
    module:{
        rules:[{
            test:/\.jsx?$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                      "es2015",
                      "react",
                      "stage-0"
                    ],
                }
            },
            exclude: /node_modules/,

        },
        {
            test:/\.css$/,
            use: ['style-loader', 'css-loader'],
            //    exclude: /node_module/,
        },
        {
            test:/\.(scss|css)$/,
            use:[
                "style-loader",
                {
                    loader:'css-loader',
                    options:{url: false, sourceMap: true},
                },
                {
                    loader:'sass-loader',
                    options: {sourceMap: true}
                }
            ],
            exclude: /node_module/
        },
        {
            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]',
            options: {
                publicPath: '/'
            }
        }]
    },
    resolve: {
        // 设置别名
        alias: {
            '@': path.join(__dirname, '/src'),
        }
    },
    devtool:"eval-source-map",
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 8099,
        host: '0.0.0.0'
    },
    plugins: [
        ...ExtraHtmls
    ]
}
