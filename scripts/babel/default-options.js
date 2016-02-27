var assign = require('object-assign');
var babelPluginModules = require('fbjs-scripts/babel/rewrite-modules');
var cxReplacement = require('./cx-replacement');

module.exports = {
  blacklist: [
    'es6.regex.unicode',
  ],
  nonStandard: true,
  optional: [
    'es7.trailingFunctionCommas',
    'es7.classProperties',
  ],
  stage: 1,
  plugins: [babelPluginModules, /*cxReplacement*/],
  _moduleMap: assign({}, require('fbjs/module-map'), {
    React: 'react',
    ReactDOM: 'react-dom',
  }),
};
