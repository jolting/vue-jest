const { SourceNode, SourceMapConsumer } = require('source-map')

function addToSourceMap(node, result) {
  if (result && result.code) {
    if (result.map) {
      node.add(
        SourceNode.fromStringWithSourceMap(
          result.code,
          new SourceMapConsumer(result.map)
        )
      )
    } else {
      node.add(result.code)
    }
  }
}

/*
function generateStyle(stylesResult) {
  const styleStr = stylesResult
      .map(
        ({ code, moduleName }) =>
          `if(!this['${moduleName}']) {\n` +
          `  this['${moduleName}'] = {};\n` +
          `}\n` +
          `this['${moduleName}'] = Object.assign(\n` +
          `this['${moduleName}'], ${code});\n`
      )
      .join('')
    if (isFunctional) {
      return
        `;(function() {\n` +
        `  var originalRender = ${namespace}.render\n` +
        `  var styleFn = function () { ${styleStr} }\n` +
        `  ${namespace}.render = function renderWithStyleInjection (h, context) {\n` +
        `    styleFn.call(context)\n` +
        `    return originalRender(h, context)\n` +
        `  }\n` +
        `})()\n`
    } else {
      return
        `;(function() {\n` +
        `  var beforeCreate = ${namespace}.beforeCreate\n` +
        `  var styleFn = function () { ${styleStr} }\n` +
        `  ${namespace}.beforeCreate = beforeCreate ? [].concat(beforeCreate, styleFn) : [styleFn]\n` +
        `})()\n`
    }
}
*/

module.exports = function generateCode(
  scriptResult,
  scriptSetupResult,
  templateResult,
  stylesResult,
  filename
) {
  var node = new SourceNode(null, null, null)
  addToSourceMap(node, scriptResult)
  addToSourceMap(node, scriptSetupResult)
  addToSourceMap(node, templateResult)
  stylesResult.forEach(styleResult => {
    console.log('got one')
    addToSourceMap(node, styleResult)
  })
  var tempOutput = node.toString()
  if (tempOutput.includes('exports.render = render;')) {
    node.add(';exports.default = {...exports.default, render};')
  } else {
    node.add(';exports.default = {...exports.default};')
  }
  return node.toStringWithSourceMap({ file: filename })
}
