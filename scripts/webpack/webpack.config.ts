import path     = require("path");
import webpack  = require("webpack");

// https://github.com/TypeStrong/ts-loader#loader-options
import type * as tsloader from "ts-loader/dist/interfaces";

import nodeExternals        = require("webpack-node-externals");
import CopyWebpackPlugin    = require("copy-webpack-plugin");
import HtmlPlugin           = require("html-webpack-plugin");
import MiniCssExtractPlugin = require("mini-css-extract-plugin");
import CssMinimizerPlugin   = require("css-minimizer-webpack-plugin");

type Require<T, K extends keyof T> = T & Pick<Required<T>, K>;


const PACK_MODE = (process.env.NODE_ENV) as ("development" | "production") || "development";
const PROJECT_ROOT = path.resolve(__dirname, "../..");

const BASE_PLUGINS = (): ReadonlyArray<Readonly<webpack.WebpackPluginInstance>> => { return [
	new webpack.WatchIgnorePlugin({ paths: [
		/\.d\.ts$/, // Importantly, this also covers .css.d.ts files.
		/\.js$/,
	]}),
	new webpack.DefinePlugin({
		// See [](src/node_modules/@types/snakey-type-utils.dts).
		"DEF.NodeEnv":   JSON.stringify(PACK_MODE),
		"DEF.DevAssert": JSON.stringify(PACK_MODE === "development"),
	}),
]};

/**
 * https://webpack.js.org/loaders/
 */
const MODULE_RULES = (): Array<webpack.RuleSetRule> => { return [{
	test: /\.ts$/,
	use: {
		loader: "ts-loader",
		options: <tsloader.LoaderOptions>{
			projectReferences: true,
			compilerOptions: {
				removeComments: false, // needed for webpack-import magic-comments
				assumeChangesOnlyAffectDirectDependencies: PACK_MODE === "development",
				//noEmit: true,
			},
			// https://github.com/TypeStrong/ts-loader#faster-builds
			transpileOnly: true,
			experimentalWatchApi: true,
			experimentalFileCaching: true,
		},
	},
	exclude: [/node_modules/,/\.d\.ts$/],
}, ];};
const WEB_MODULE_RULES = (): Array<webpack.RuleSetRule> => { return [{
	test: /\.css$/,
	use: [{
		loader: MiniCssExtractPlugin.loader, options: {}
	},{
		loader: "css-modules-typescript-loader",
	},{
		loader: "css-loader", options: {
			modules: {
				auto: /\.m\.css$/,
				localIdentName: "[name]_[local]_[hash:base64:5]",
			},
		},
	}],
},{
	// https://webpack.js.org/loaders/file-loader/
	test: /\.(png|svg|jpe?g|gif)$/,
	issuer: /\.css$/,
	use: [(() => {
		const pathFunc = (url: string, resourcePath: string, context: string) => {
			return path.relative(context, resourcePath).replace(/\\/g, "/");
		};
		return {
		loader: "file-loader",
		options: {
			context: path.resolve(PROJECT_ROOT, "assets"),
			//name: "[name].[ext]",
			outputPath: pathFunc,
			publicPath: pathFunc,
		},};
	})()],
}, ];}

/**
 * - [typescript docs](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)
 * - [webpack config](https://webpack.js.org/configuration/configuration-languages/#typescript)
 * - [ts-loader](https://github.com/TypeStrong/ts-loader#loader-options)
 *
 * @returns A standalone ("deep-copy") basic configuration.
 */
const __BaseConfig = (distSubFolder: string): Require<webpack.Configuration,
"entry" | "plugins" | "resolve" | "output"> => { return {
	mode: PACK_MODE,
	name: distSubFolder,
	stats: { /* https://webpack.js.org/configuration/stats/ */
		children: false,
		colors: true,
	},

	context: PROJECT_ROOT, // https://webpack.js.org/configuration/entry-context/#context
	entry: { /* Left to each branch config */ },
	plugins: [ ...BASE_PLUGINS(), ],
	resolve: {
		extensions: [".ts", ".js"],
		modules: [
			path.resolve(PROJECT_ROOT, "src"),
			path.resolve(PROJECT_ROOT, "src/base"),
			path.resolve(PROJECT_ROOT, "node_modules"),
		], // match tsconfig.baseUrl
	},
	module: { rules: MODULE_RULES(), },
	// https://webpack.js.org/plugins/source-map-dev-tool-plugin/
	devtool: (PACK_MODE === "production")
		? "nosources-source-map"
		: "eval-cheap-source-map",
	output: {
		path: path.resolve(PROJECT_ROOT, "dist", distSubFolder),
		publicPath: `./`, // need trailing "/".
		filename: "[name].js",
		chunkFilename: "chunk/[name].js",
		library: "snakey3",
		pathinfo: false, // unneeded. minor performance gain.
	},

	optimization: {
		minimizer: [new CssMinimizerPlugin({
			minimizerOptions: { preset: ["default", { discardComments: { removeAll: true }}], },
		}), "..."],
		splitChunks: { chunks: "all", cacheGroups: {} },
		removeAvailableModules: (PACK_MODE === "production"),
	},
	watchOptions: {
		ignored: [ "node_modules", ],
	},
}; };





/**
 * ## Web Bundles
 */
const CLIENT_CONFIG = __BaseConfig("client"); {
	const config  = Object.assign(CLIENT_CONFIG, <Partial<webpack.Configuration>>{
		target: "web",
		entry: {["index"]: `./src/client/index.ts`},
		externals: [nodeExternals({
			allowlist: ["tslib"],
			importType: "root",
		})],
	});
	config.resolve.modules!.push(path.resolve(PROJECT_ROOT)); // for requiring assets.
	config.module!.rules!.push(...WEB_MODULE_RULES());
	// config.resolve.alias = config.resolve.alias || {
	//     "socket.io-client": "socket.io-client/dist/socket.io.slim.js",
	// };
	const htmlPluginOptions: HtmlPlugin.Options = {
		template:   path.resolve(PROJECT_ROOT, "src/client/index.ejs"),
		favicon:    "./assets/favicon.png",
		scriptLoading: "defer",
		inject: false, // (I specify where each injection goes in the template).
		templateParameters: (compilation, assets, assetTags, options) => { return {
			compilation, webpackConfig: compilation.options,
			htmlWebpackPlugin: { tags: assetTags, files: assets, options, },
			// Custom HTML templates for index.ejs:
			wellKnownGameServers: require(path.resolve(PROJECT_ROOT, "servers.json")),
		}; },
		//hash: true,
	};
	config.plugins.push(
		new HtmlPlugin(htmlPluginOptions),
		// new HtmlPlugin(Object.assign({}, htmlPluginOptions, <HtmlPlugin.Options>{
		//     chunks: [],
		//     filename: "404.html",
		// })),
		new MiniCssExtractPlugin({
			filename: "_barrel.css",
			chunkFilename: "chunk/[name].css",
		}) as webpack.WebpackPluginInstance, // TODO.build remove this when https://github.com/webpack-contrib/mini-css-extract-plugin/pull/594
		new CopyWebpackPlugin({ patterns: [{
			context: "node_modules/socket.io-client/dist/",
			from: `socket.io${(
				PACK_MODE === "production" ? ".min" : ""
			)}.js` + "*", // <- glob to include sourcemap file.
			to: "vendor/socket.io.[ext]",
			flatten: true,
		}],}),
	);
	if (PACK_MODE === "production") {
		config.plugins.push();
	}
}



/**
 */
const __applyCommonNodeConfigSettings = (config: ReturnType<typeof __BaseConfig>): void => {
	config.target = "node";
	config.externals = [ nodeExternals(), ], // <- Does not whitelist tslib.
	// alternative to above: fs.readdirsync(path.resolve(PROJECT_ROOT, "node_modules"))
	config.resolve.extensions!.push(".js");
	config.node = {
		__filename: false,
		__dirname: false,
		global: false,
		//"fs": "empty", "net": "empty", <- may solve tricky problems if they come up.
	};
	// https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_javascript-source-map-tips
	// https://webpack.js.org/configuration/output/#outputdevtoolmodulefilenametemplate
	config.output.devtoolModuleFilenameTemplate = "../[resource-path]?[loaders]";
	config.devtool = (PACK_MODE === "production")
		? "cheap-module-source-map"
		: "eval-cheap-module-source-map";
};

/**
 */
const SERVER_CONFIG = __BaseConfig("server"); {
	const config = SERVER_CONFIG;
	__applyCommonNodeConfigSettings(config);
	config.entry["index"] = `./src/server/index.ts`;
}

/**
 */
const TEST_CONFIG = __BaseConfig("test"); {
	const config = TEST_CONFIG;
	config.resolve.modules!.push(path.resolve(PROJECT_ROOT, "src"));
	__applyCommonNodeConfigSettings(config);
	(<const>[ "lang", ]).forEach((name) => {
		config.entry[name] = `./test/${name}/index.ts`;
	});
}



module.exports = [
	CLIENT_CONFIG,
	SERVER_CONFIG,
	//TEST_CONFIG,
];