module.exports = function(api) {
  api.cache(true);
  return {
    "presets": [
      [
        "@babel/preset-env",
        {
          "useBuiltIns": "entry",
          "corejs": "3.22"
        }
      ]
    ],
    "plugins": ["@babel/plugin-transform-runtime", "@babel/plugin-transform-logical-assignment-operators"]
  };
};
