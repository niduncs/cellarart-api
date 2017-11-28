module.exports = {
    entry: './app/app.js',
    output: {
        path: '/build',
        filename: 'app.js'
    },
    module: {
        loaders: [
            {
                // Ask webpack to check: If this file ends with .js, then apply some transforms
                test: /\.js$/,
                // Transform it with babel
                loader: 'babel-loader',
                // don't transform node_modules folder (which don't need to be compiled)
                exclude: /node_modules/
            }
        ]
    }
};