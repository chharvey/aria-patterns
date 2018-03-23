/**
 * @summary A set of component builders.
 * @namespace
 */
const ARIAPatterns = {
  /**
   * @summary A permalink for sections of a webpage.
   * @see xPermalink_renderer
   * @type {xjs.HTMLTemplateElement}
   */
  xPermalink: require('./tpl/x-permalink.tpl.js'),
  /**
   * @summary A website directory, in the form of a document outline.
   * @see xDirectory_renderer
   * @type {xjs.HTMLTemplateElement}
   */
  xDirectory: require('./tpl/x-directory.tpl.js'),
  /**
   * @summary A person’s name in "Px. First M. Last, Sx." format.
   * @see xPersonFullname_renderer
   * @type {xjs.HTMLTemplateElement}
   */
  xPersonFullname: require('./tpl/x-person-fullname.tpl.js'),
  /**
   * @summary A postal address.
   * @see xAddress_renderer
   * @type {xjs.HTMLTemplateElement}
   */
  xAddress: require('./tpl/x-address.tpl.js'),
}

module.exports = ARIAPatterns
