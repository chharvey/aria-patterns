const path = require('path')

const xjs = require('extrajs-dom')


/**
 * @summary A set of component builders.
 * @namespace
 */
const ARIAPatterns = {
  /**
   * @summary A website directory, in the form of a document outline.
   * @see xDirectory_renderer
   * @type {{template: xjs.HTMLTemplateElement, renderer: RenderingFunction[]}}
   */
  xDirectory: {
    template: xjs.HTMLTemplateElement.fromFileSync(path.join(__dirname, './src/x-directory/tpl/x-directory.tpl.html')),
    renderer: require('./src/x-directory/tpl/x-directory.tpl.js'),
  },
  /**
   * @summary A person’s name in "Px. First M. Last, Sx." format.
   * @see xPersonFullname_renderer
   * @type {{template: xjs.HTMLTemplateElement, renderer: RenderingFunction[]}}
   */
  xPersonFullname: {
    template: xjs.HTMLTemplateElement.fromFileSync(path.join(__dirname, './src/x-person-fullname/tpl/x-person-fullname.tpl.html')),
    renderer: require('./src/x-person-fullname/tpl/x-person-fullname.tpl.js'),
  },
  /**
   * @summary A postal address.
   * @see xAddress_renderer
   * @type {{template: xjs.HTMLTemplateElement, renderer: RenderingFunction[]}}
   */
  xAddress: {
    template: xjs.HTMLTemplateElement.fromFileSync(path.join(__dirname, './src/x-address/tpl/x-address.tpl.html')),
    renderer: require('./src/x-address/tpl/x-address.tpl.js'),
  },
  /**
   * @summary A permalink for sections of a webpage.
   * @see xPermalink_renderer
   * @type {{template: xjs.HTMLTemplateElement, renderer: RenderingFunction[]}}
   */
  xPermalink: {
    template: xjs.HTMLTemplateElement.fromFileSync(path.join(__dirname, './src/x-permalink/tpl/x-permalink.tpl.html')),
    renderer: require('./src/x-permalink/tpl/x-permalink.tpl.js'),
  },
}

module.exports = ARIAPatterns
