/**
 * Copyright (c) 2016, Iegor Azuaga.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

function replaceSlashes(str) {
  return str.replace(/\//, '-');
}

function nodeToLiteral(node) {
  var args = node.arguments.slice();
  var arg = args[0];

  arg.raw = "'" + replaceSlashes(arg.rawValue) + "'";
  arg.value = replaceSlashes(arg.value);
  arg.rawValue = replaceSlashes(arg.rawValue);

  for (var i = 1; i < args.length; i++) {
    arg.raw =  "'" + arg.rawValue + " " + replaceSlashes(args[i].value) + "'";
    arg.value += ' ' + replaceSlashes(args[i].value);
    arg.rawValue += ' ' + replaceSlashes(args[i].rawValue);
  }

  return arg;
}

module.exports = function(babel) {
  var t = babel.types;

  /**
   * Transforms `cx('Foo')` to `Foo` and `cx('Foo', 'Bar')` to `Foo Bar`.
   */
  function transformCxCall(context, call) {
    if (
      !t.isIdentifier(call.callee, {name: 'cx'})
    ) {
      return undefined;
    }

    return nodeToLiteral(call);
  }

  return new babel.Transformer('cx-replacement', {
    CallExpression: {
      exit: function(node, parent) {
        return (
          transformCxCall(this, node)
        );
      },
    },
  });
};
