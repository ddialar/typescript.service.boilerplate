const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                exclude: [path.resolve(__dirname, '../node_modules')],
                test: /\.ts$/,
                use: 'ts-loader',
            },
        ],
    },
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, '../dist'),
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@package': path.resolve(__dirname, '../package.json'),
            '@manifest': path.resolve(__dirname, '../manifest.json'),
            '@core': path.resolve(__dirname, '../src/core'),
            '@ports': path.resolve(__dirname, '../src/ports'),
            '@adapters': path.resolve(__dirname, '../src/adapters'),
            '@apiDocumentation': path.resolve(__dirname, '../src/adapters/transportLayer/apiDocumentation'),
            '@utils': path.resolve(__dirname, '../src/utils'),
        },
    },
    target: 'node',
};
