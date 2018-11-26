import * as path from 'path'

import * as xjs from 'extrajs-dom'
import {Processor} from 'template-processor'
import * as sdo from 'schemaorg-jsd/dist/schemaorg' // TODO use an index file

const STATE_DATA = require('extrajs-geo')
STATE_DATA.push(...[
  { "code": "DC", "name": "District of Columbia" },
])


const template/*: HTMLTemplateElement*/ = xjs.HTMLTemplateElement
	.fromFileSync(path.join(__dirname, '../../../src/x-address/tpl/x-address.tpl.html')) // NB relative to dist
	.node

/**
 * A postal address.
 * @param {DocumentFragment} frag the template content with which to render
 * @param {sdo.PostalAddress} data       http://schema.org/PostalAddress
 * @param {string=} data.streetAddress   http://schema.org/streetAddress
 * @param {string=} data.addressLocality http://schema.org/addressLocality
 * @param {string=} data.addressRegion   http://schema.org/addressRegion
 * @param {string=} data.postalCode      http://schema.org/postalCode
 * @param {string=} data.addressCountry  http://schema.org/addressCountry
 * @param   {!Object=} opts additional rendering options
 * @param   {(boolean|string)=} opts.regionName should the region code programmatically expanded to its full name
 *                                              (e.g., expand "VA" to "Virginia")?
 *                                              or enter a string to name the region manually
 */
function instructions(frag/*: DocumentFragment*/, data/*: sdo.PostalAddress*/, opts/*: { regionName?: boolean|string }*/) {
  /**
   * @summary References to formatting elements.
   * @description We want to create these references before removing any elements from the DOM.
   * @private
   * @constant {!Object}
   */
  const formatting = {
    /** The comma between locality and region. */ comma: frag.querySelector('slot[name="addressLocality"] + span'),
    /** Line breaks separating lines of address. */ linebreaks: [...frag.querySelectorAll('br')],
  }
  ;[
    'streetAddress',
    'addressLocality',
    'addressRegion',
    'postalCode',
    'addressCountry',
  ].forEach((nameprop) => {
    let slot = frag.querySelector(`slot[name="${nameprop}"]`)
    if (data[nameprop]) {
      slot.textContent = data[nameprop]
    } else slot.remove()
  })

  // unabbreviate the region name
  if (data.addressRegion) {
    frag.querySelector('data[itemprop="addressRegion"]').value = data.addressRegion
    if (opts.regionName === true) {
      frag.querySelector('slot[name="addressRegion"]').textContent = (() => {
            let state = STATE_DATA.find((state) => state.code === data.addressRegion) || null
				if (state) return state.name
				else {
					let err = `No data found for ${data.addressRegion}.`
					return console.error(err) || err
				}
      })()
    } else if (opts.regionName) {
      frag.querySelector('slot[name="addressRegion"]').textContent = opts.regionName
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

export default new Processor(template, instructions)
