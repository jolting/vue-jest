const { compileStyle } = require('@vue/compiler-sfc')
const path = require('path')
const fs = require('fs')
const cssExtract = require('extract-from-css')
const getVueJestConfig = require('./utils').getVueJestConfig
const applyModuleNameMapper = require('./module-name-mapper-helper')
const getCustomTransformer = require('./utils').getCustomTransformer
const logResultErrors = require('./utils').logResultErrors
const loadSrc = require('./utils').loadSrc
const CSSOM = require('cssom')

function getGlobalResources(resources, lang) {
  let globalResources = ''
  if (resources && resources[lang]) {
    globalResources = resources[lang]
      .map(resource => path.resolve(process.cwd(), resource))
      .filter(resourcePath => fs.existsSync(resourcePath))
      .map(resourcePath => fs.readFileSync(resourcePath).toString())
      .join('\n')
  }
  return globalResources
}

function extractClassMap(cssCode) {
  const cssNames = cssExtract.extractClasses(cssCode)
  const cssMap = {}
  for (let i = 0, l = cssNames.length; i < l; i++) {
    cssMap[cssNames[i]] = cssNames[i]
  }
  return cssMap
}

function getPreprocessOptions(lang, filePath, jestConfig) {
  if (lang === 'scss' || lang === 'sass') {
    return {
      importer: (url, prev, done) => ({
        file: applyModuleNameMapper(
          url,
          prev === 'stdin' ? filePath : prev,
          jestConfig,
          lang
        )
      })
    }
  }
  if (lang === 'styl' || lang === 'stylus') {
    return {
      paths: [path.dirname(filePath), process.cwd()]
    }
  }
}

module.exports = function processStyles(styles, filename, id) {
  return [
    { code: 'const styles = [];' },
    ...styles.map(style => {
      const { content, map, lang, module } = style
      console.log(style)
      const result = compileStyle({
        filename,
        id,
        map,
        source: content,
        preprocessLang: lang
      })
      return {
        code: `styles.push(${JSON.stringify(result.code)});`,
        map: result.map
      }
    }),
    { code: 'exports.default = {...exports.default, styles}' }
  ]
}
