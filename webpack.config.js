'use strict';

// Modules
var webpack           = require('webpack');
var autoprefixer      = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var SwigWebpackPlugin = require('swig-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var glob              = require('glob');
var path              = require('path');
/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
var ENV    = process.env.npm_lifecycle_event;
var isProd = ENV === 'build';

var getEntry  = function (globPath) {
  var entries = {},
  basename, tmp, pathname;
  glob.sync(globPath).forEach(function (entry) {
    basename = path.basename(entry, path.extname(entry));
    //tmp = entry.split('/').splice(-3);
    pathname = basename.split("_")[0]; // 正确输出js和html的路径
    entries[pathname] = entry;
  });
  return entries;
};
var entries = getEntry('./app/pages/**/*.js');
var common =  './app/app.js';
var chunks = Object.keys(entries);
entries = Object.assign({'common':common},entries);
module.exports = function makeWebpackConfig() {
    var config = {};
    //Should be an empty object if it's generating a test build     
    config.entry = entries;
    config.output = {
        // Absolute output directory
        path: __dirname + '/dist',
        //template    : '[name].html',
        // Output path from the view of the page
        // Uses webpack-dev-server in development
        publicPath: isProd ? './' : 'http://localhost:8080/',
        // Filename for entry points
        // Only adds hash in build mode
        filename: isProd ? 'js/[name].[hash:8].js' : '[name].js',
        // Filename for non-entry points
        // Only adds hash in build mode
        chunkFilename: isProd ? 'js/[name].[hash:8].js' : '[name].js'
    };

    //Type of sourcemap to use per build type
   // config.devtool = isProd ? 'cheap-module-source-map' : 'source-map';

    //Loaders - This handles most of the magic responsible for converting modules
    config.module = {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },

            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: [
                        { 
                            loader: 'css-loader', query: { sourceMap: true } 
                        },
                        { 
                            loader: 'postcss-loader'
                        }
                    ],
                })
            }, 
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: ['css-loader','sass-loader','postcss-loader']
                })
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                  limit: 10000,
                  name: 'images/[name].[hash:8].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                  limit: 10000,
                  name: 'fonts/[name].[hash:8].[ext]'
                }
            },
            // {
            //     test: /.*\.html$/,
            //     loader: 'html-loader',
            //     // options: {
            //     //     minimize: true,
            //     //     removeComments: false,
            //     //     collapseWhitespace: false
            //     // }
            // }
        ]
    };


    config.resolve = {
        alias : {
            node_modules    : __dirname + '/node_modules',
            utils           : __dirname + '/src/utils',
            page            : __dirname + '/src/pages',
            images          : __dirname + '/src/images'
        }
    };

    config.plugins = [
        // Add vendor prefixes to your css
        // NOTE: This is now handled in the `postcss.config.js`
        // webpack2 has some issues, making the config file necessary
        new webpack.LoaderOptionsPlugin({
            test: /\.scss$/i,
            options: { 
                postcss: { 
                    plugins: [autoprefixer({
                        browsers: ['last 10 versions', 'ie >= 9'],
                        flexbox:true,
                        remove: false
                    })] 
                }
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
          name: 'common', // 公共模块的名称
          chunks: common,  // chunks是需要提取的模块
        }),
        // Render index.html
        // Extract css files     
        new ExtractTextPlugin({ 
            filename: 'css/[name].[hash:8].css', 
            disable: !isProd, 
            allChunks: true
        }),
        // Only emit files when there are no errors
        new webpack.NoEmitOnErrorsPlugin(),
        // Minify all javascript, switch loaders to minimizing mode
        // Copy assets from the assets folder
        new CopyWebpackPlugin([{
            from: __dirname + '/app/assets'
        }]),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
    ];

    config.devServer = {
        contentBase: './app/',
        stats: { colors: true },
        //stats: 'minimal',
        open: true,
        port:8080,
        overlay:true,
        inline: true,
        historyApiFallback: true,
        // watchOptions: {
        //     aggregateTimeout: 10,
        //     poll: 500
        // },
    };

    //getEntryS
    function getEntrys(globPath) {
      var entries = {}, basename;
      glob.sync(globPath).forEach(function (entry) {
        basename = path.basename(entry, path.extname(entry));
        entries[basename] = entry;
      });
      return entries;
    };
    var pages = getEntrys('./app/pages/**/*.ejs');
    // 获取html-webpack-plugin参数的方法 
    var getHtmlConfig = function(name, title){
        return ;
    };
    if(isProd){
        config.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                minimize: true,
                warnings: false,
                // mangle: {
                //     except: ['$q', '$ocLazyLoad']
                // },
                sourceMap: false
            })
        );
        var titleList = ['首页标题'];
        for (var pathname in pages) {
            var conf = function(title) {
                return {
                    template    : pages[pathname],
                    filename    : pathname + '.html',
                    title       : title,
                    favicon: "./app/assets/favicon.ico",
                    inject      : true,
                    hash        : true,
                    chunks      : ['common',pathname]
                };
            };
            for (var title in titleList){
              config.plugins.push(new HtmlWebpackPlugin(conf(titleList[title])));  
            };
            
        };
    }
    if(!isProd){

        for (var pathname in pages) {
          // 配置生成的html文件，定义路径等
          var conf = {
            filename: pathname + '.html',
            template: pages[pathname],   // 模板路径
            inject: true,              // js插入位置
            hash:true,
            minify: {
              removeComments: true,
              collapseWhitespace: false
            }
          };
          if(pathname in config.entry){
            conf.chunks = ['common', pathname];
          };
          config.plugins.push(new HtmlWebpackPlugin(conf));
        };
    }
    return config;
}();
