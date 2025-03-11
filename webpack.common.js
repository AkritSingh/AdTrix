
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer')

module.exports = {
    stats: 'verbose',
    entry: {
        panel: path.resolve('src/panel.js'),
        devtools: path.resolve('src/devtools.js'),
        serviceWorker: path.resolve('src/serviceWorker.js'),
        contentScript: path.resolve('src/contentScript.js'),
    },
    module: {
        rules: [
            {
                use: 'ts-loader',
                test: /\.tsx?$/,
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        },
                    },
                    {
                        loader: 'postcss-loader', // postcss loader needed for tailwindcss
                        options: {
                            postcssOptions: {
                                ident: 'postcss',
                                plugins: [tailwindcss, autoprefixer],
                            },
                        },
                    },
                ],
            },
            {
                test: /\.scss$/,
                use: [
                  'style-loader',
                  'css-loader',
                  'sass-loader',
                ],
              },
            {
                type: 'assets/resource',
                test: /\.(png|jpg|jpeg|gif|woff|woff2|tff|eot|svg)$/,
            },
        ]
    },
    "plugins": [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false
        }),
        new CopyPlugin({
            patterns: [{
                from: path.resolve('src'),
                to: path.resolve('dist'),
                globOptions: {
                    ignore: [
                        '**/*.scss',  // Ignore SCSS files
                        '**/*.css.map' // Ignore CSS map files
                    ],
                },
            }]
        }),
        ...getHtmlPlugins([
            'panel',
        ])
    ],
   
    resolve: {
        alias: {
            react: path.resolve(__dirname, 'node_modules/preact/compat'), // Correct path
            'react-dom': path.resolve(__dirname, 'node_modules/preact/compat'), // Correct path
        },
        extensions: ['.tsx', '.ts', '.js'],

    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist')
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                signals: {  // Create a new cache group for signals
                    test: /[\\/]src[\\/]signals[\\/]/, // Regex to target your signals file(s)
                    name: 'signals', // Name of the common chunk
                    chunks: 'all', // Include all chunks that use signals
                    minChunks: 1, // Ensure at least one module uses it. Important!
                },
                vendors: { // Keep your existing vendor chunk (optional but good practice)
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
                default: { // Default for other chunks
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        }
        
    }
}

function getHtmlPlugins(chunks) {
    return chunks.map(chunk => new HtmlPlugin({
        title: 'React Extension',
        filename: `${chunk}.html`,
        chunks: [chunk]
    }))
}