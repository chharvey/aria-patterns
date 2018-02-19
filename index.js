const path = require('path')

const xjs = require('extrajs-dom')

/**
 * @summary A set of component builders.
 * @namespace
 */
const ARIAPatterns = {
  /**
   * @summary A permalink for sections of a webpage.
   * @description An `<a.c-Permlink>` element. Best inside an `<h1>`.
   * @see xPermalink
   * @type {xjs.HTMLTemplateElement}
   */
  xPermalink: xjs.HTMLTemplateElement
    .fromFileSync(path.join(__dirname, './tpl/x-permalink.tpl.html'))
    .setRenderer(require('./tpl/x-permalink.tpl.js')),
  /**
   * @summary A webpage’s directory, in the form of a document outline.
   * @description An `<ol role="directory">` with link list items to subpages. Best inside a `<nav>`.
   * @see xDirectory
   * @type {xjs.HTMLTemplateElement}
   */
  xDirectory: xjs.HTMLTemplateElement
    .fromFileSync(path.join(__dirname, './tpl/x-directory.tpl.html'))
    .setRenderer(require('./tpl/x-directory.tpl.js')),
}

module.exports = ARIAPatterns