function getStyleUse(bundleFilename) {
  return [
    {
      loader: "file-loader",
      options: {
        name: bundleFilename
      }
    },
    { loader: "extract-loader" },
    { loader: "css-loader" },
    {
      loader: "sass-loader",
      options: {
        includePaths: ["./node_modules"]
      }
    }
  ];
}

module.exports = [
  {
    entry: "./index.scss",
    output: {
      filename: "style-bundle-index.js"
    },
    module: {
      rules: [
        {
          test: /index.scss$/,
          use: getStyleUse("bundle-index.css")
        }
      ]
    }
  },
  {
    entry: "./index.js",
    output: {
      filename: "bundle-index.js"
    },
    module: {
        rules: [
          {
            test: /index.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
      }
    }
];
