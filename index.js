const xjs = require('extrajs-dom')

module.exports = {
  xPermalink: xjs.HTMLTemplateElement.fromFileSync(path.join(__dirname, './tpl/x-permalink.tpl.html')).setRenderer(require('./tpl/x-permalink.tpl.js')),
}
