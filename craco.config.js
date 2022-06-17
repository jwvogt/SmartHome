// craco.config.js
module.exports = {
  babel: {
    plugins: ["@babel/plugin-proposal-class-properties"],
  },
  webpack: {
    configure: {
      output: {
        path: require("path").resolve(__dirname, "build"),
      },
    },
  },
  devServer: {
    hot: false,
    open: false,
    watchContentBase: true,
    writeToDisk: true,
  },
};
