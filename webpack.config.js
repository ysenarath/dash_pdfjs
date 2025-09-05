const path = require("path");
const webpack = require("webpack");
const WebpackDashDynamicImport = require("@plotly/webpack-dash-dynamic-import");
const packagejson = require("./package.json");

const dashLibraryName = packagejson.name.replace(/-/g, "_");

module.exports = (env, argv) => {
    let mode;

    const overrides = module.exports || {};

    // if user specified mode flag take that value
    if (argv && argv.mode) {
        mode = argv.mode;
    } else if (overrides.mode) {
        mode = overrides.mode;
    } else {
        mode = "production";
    }

    let filename = (overrides.output || {}).filename;
    if (!filename) {
        const modeSuffix = mode === "development" ? "dev" : "min";
        filename = `${dashLibraryName}.${modeSuffix}.js`;
    }

    const entry = overrides.entry || { main: "./src/lib/index.js" };

    const devtool = overrides.devtool || "source-map";

    const externals = ("externals" in overrides) ? overrides.externals : ({
        react: "React",
        "react-dom": "ReactDOM",
        "plotly.js": "Plotly",
        "prop-types": "PropTypes",
    });

    return {
        mode,
        entry,
        output: {
            path: path.resolve(__dirname, dashLibraryName),
            chunkFilename: "[name].js",
            filename,
            library: dashLibraryName,
            libraryTarget: "window",
        },
        devtool,
        devServer: {
            static: {
                directory: path.join(__dirname, "/"),
            },
        },
        externals,
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                    },
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: "style-loader",
                        },
                        {
                            loader: "css-loader",
                        },
                    ],
                },
                {
                    test: /\.mjs$/,
                    type: "javascript/auto",
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    type: "asset/resource",
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/,
                    type: "asset/resource",
                },
            ],
        },
        optimization: {
            splitChunks: {
                name: "[name].js",
                cacheGroups: {
                    async: {
                        chunks: "async",
                        minSize: 0,
                        name(module, chunks, cacheGroupKey) {
                            return `${cacheGroupKey}-${chunks[0].name}`;
                        },
                    },
                    shared: {
                        chunks: "all",
                        minSize: 0,
                        minChunks: 2,
                        name: "dash_pdfjs-shared",
                    },
                },
            },
        },
        plugins: [
            new WebpackDashDynamicImport(),
            new webpack.SourceMapDevToolPlugin({
                filename: "[file].map",
                exclude: ["async-plotlyjs"],
            }),
        ],
    };
};
