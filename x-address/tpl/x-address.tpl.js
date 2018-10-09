const path = require('path')

const xjs = {
  ...require('extrajs'),
  ...require('extrajs-dom'),
}

const STATE_DATA = require('extrajs-geo')
STATE_DATA.push(...[
  { "code": "DC", "name": "District of Columbia" },
])


/**
 * @summary xAddress renderer.
 * @param {DocumentFragment} frag the template content with which to render
 * @param {sdo.PostalAddress} data       http://schema.org/PostalAddress
 * @param {string=} data.streetAddress   http://schema.org/streetAddress
 * @param {string=} data.addressLocality http://schema.org/addressLocality
 * @param {string=} data.addressRegion   http://schema.org/addressRegion
 * @param {string=} data.postalCode      http://schema.org/postalCode
 * @param {string=} data.addressCountry  http://schema.org/addressCountry
 * @param {(boolean|string)=} data.$regionName should the region code programmatically expanded to its full name
 *                                             (e.g., expand "VA" to "Virginia")?
 *                                             or enter a string to name the region manually
 */
function xAddress_renderer(frag, data) {
  /**
   * @summary References to formatting elements.
   * @description We want to create these references before removing any elements from the DOM.
   * @private
   * @type {!Object}
   */
  let formatting = {
    /** The comma between locality and region. */ comma: frag.querySelector('slot[name="addressLocality"] + span'),
    /** Line breaks separating lines of address. */ linebreaks: [...frag.querySelectorAll('br')],
  }
  ;[
    'streetAddress',
    'addressLocality',
    'addressRegion',
    'postalCode',
    'addressCountry',
  ].forEach(function (nameprop) {
    let slot = frag.querySelector(`slot[name="${nameprop}"]`)
    if (data[nameprop]) {
      slot.textContent = data[nameprop]
    } else slot.remove()
  })

  // unabbreviate the region name
  if (data.addressRegion) {
    frag.querySelector('data[itemprop="addressRegion"]').value = data.addressRegion
    if (data.$regionName) {
      const returned = {
        'boolean': function () {
          let returned;
          try {
            let state = STATE_DATA.find((state) => state.code === data.addressRegion) || null
            returned = state.name
          } catch (e) {
            e = new ReferenceError(`No data found for ${data.addressRegion}.`)
            console.error(e)
            returned = e.name
          }
          return returned
        },
        'string' : () => data.$regionName,
        default  : () => null,
      }
      frag.querySelector('slot[name="addressRegion"]').textContent = (returned[xjs.Object.typeOf(data.$regionName)] || returned.default).call(null)
    }
  } else {
    frag.querySelector('data[itemprop="addressRegion"]').remove()
  }

  // remove unnecessary comma preceding region
  if (!data.addressLocality || !data.addressRegion) {
    formatting.comma.remove()
  }

  // remove unnecessary line breaks
  if (!data.streetAddress) {
    formatting.linebreaks[0].remove()
  }
  if (!data.addressCountry) {
    formatting.linebreaks[1].remove()
  }
}

module.exports = xjs.HTMLTemplateElement
  .fromFileSync(path.join(__dirname, './x-address.tpl.html'))
  .setRenderer(xAddress_renderer)
