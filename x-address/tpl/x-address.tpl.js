const xjs = require('extrajs-dom')

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
 * @param {(boolean|string)=} data.$regionName deprecated form of param `opts.regionName`
 * @param   {!Object=} opts additional rendering options
 * @param   {(boolean|string)=} opts.regionName should the region code programmatically expanded to its full name
 *                                              (e.g., expand "VA" to "Virginia")?
 *                                              or enter a string to name the region manually
 */
let xAddress_renderer/*: RenderingFunction<sdo.PostalAddress, { regionName?: boolean|string }>*/ = function xAddress_renderer(frag, data, opts) {
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
    if (data.$regionName === true || opts.regionName === true) {
      frag.querySelector('slot[name="addressRegion"]').textContent = (() => {
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
      })()
    } else if (data.$regionName || opts.regionName) {
      frag.querySelector('slot[name="addressRegion"]').textContent = data.$regionName || opts.regionName
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

module.exports = [xAddress_renderer]
