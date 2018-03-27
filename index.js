/**
 * @summary A set of component builders.
 * @namespace
 */
const ARIAPatterns = {
  /**
   * @summary A website directory, in the form of a document outline.
   * @see xDirectory_renderer
   * @type {xjs.HTMLTemplateElement}
   */
  xDirectory: require('./x-directory/tpl/x-directory.tpl.js'),
  /**
   * @summary A person’s name in "Px. First M. Last, Sx." format.
   * @see xPersonFullname_renderer
   * @type {xjs.HTMLTemplateElement}
   */
  xPersonFullname: require('./x-person-fullname/tpl/x-person-fullname.tpl.js'),
  /**
   * @summary A postal address.
   * @see xAddress_renderer
   * @type {xjs.HTMLTemplateElement}
   */
  xAddress: require('./x-address/tpl/x-address.tpl.js'),
  /**
   * @summary A permalink for sections of a webpage.
   * @see xPermalink_renderer
   * @type {xjs.HTMLTemplateElement}
   */
  xPermalink: require('./x-permalink/tpl/x-permalink.tpl.js'),
}

module.exports = ARIAPatterns
