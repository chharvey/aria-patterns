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
 * @param {sdo.PostalAddress} data a JSON object representing a postal address
 * @param {string=} data.streetAddress The street address.
 * @param {string=} data.addressLocality The locality.
 * @param {string=} data.addressRegion The region.
 * @param {string=} data.postalCode The postal code.
 * @param {string=} data.addressCountry The country.
 * @param {string=} data.$itemprop the value of the `[itemprop]` attribute to write, if any
 * @param {(boolean|string)=} data.$regionName `true` if you want the region code programmatically expanded to its full name
 *                                             (e.g., expand "VA" to "Virginia");
 *                                             or enter a string to name the region manually
 */
function xAddress_renderer(frag, data) {
  new xjs.HTMLElement(frag.querySelector('[itemtype="http://schema.org/PostalAddress"]'))
    .attr('itemprop', data.$itemprop || null)

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
}

module.exports = xjs.HTMLTemplateElement
  .fromFileSync(path.resolve(__dirname, './x-address.tpl.html'))
  .setRenderer(xAddress_renderer)
