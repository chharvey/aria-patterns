const path = require('path')

const xjs = require('extrajs-dom')

/**
 * @summary xPersonFullname renderer.
 * @param {DocumentFragment} frag the template content with which to render
 * @param {sdo.Person} data              http://schema.org/Person
 * @param {string}  data.givenName       http://schema.org/givenName
 * @param {string}  data.familyName      http://schema.org/familyName
 * @param {string=} data.additionalName  http://schema.org/additionalName
 * @param {string=} data.honorificPrefix http://schema.org/honorificPrefix
 * @param {string=} data.honorificSuffix http://schema.org/honorificSuffix
 */
function xPersonFullname_renderer(frag, data) {
  /**
   * @summary References to formatting elements.
   * @description We want to create these references before removing any elements from the DOM.
   * @private
   * @type {!Object}
   */
  let formatting = {
    /** The comma preceding the honorific suffix. */ comma: frag.querySelector('slot[name="familyName"] + span'),
  }
  ;[
    'familyName',
    'givenName',
    'additionalName',
    'honorificPrefix',
    'honorificSuffix',
  ].forEach(function (nameprop) {
    let slot = frag.querySelector(`slot[name="${nameprop}"]`)
    if (data[nameprop]) {
      slot.textContent = data[nameprop]
    } else slot.remove()
  })

  // abbreviate the middle name
  if (data.additionalName) {
    frag.querySelector('slot[name="additionalName"]'    ).textContent = `${data.additionalName[0]}.`
    frag.querySelector('abbr[itemprop="additionalName"]').title       = data.additionalName
  } else {
    frag.querySelector('abbr[itemprop="additionalName"]').remove()
  }

  // remove unnecessary comma preceding suffix
  if (!data.honorificSuffix) {
    formatting.comma.remove()
  }
}

module.exports = xjs.HTMLTemplateElement
  .fromFileSync(path.join(__dirname, './x-person-fullname.tpl.html'))
  .setRenderer(xPersonFullname_renderer)
