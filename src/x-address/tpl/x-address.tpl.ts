import * as path from 'path'

import * as xjs from 'extrajs-dom'
import {Processor} from 'template-processor'
import * as sdo from 'schemaorg-jsd/dist/schemaorg' // TODO use an index file

type StateType = { code: string, name: string }
const STATE_DATA: StateType[] = require('extrajs-geo')
STATE_DATA.push(...[
  { "code": "DC", "name": "District of Columbia" },
])


interface OptsType {
	/**
	 * Should the region code programmatically expanded to its full name?
	 *
	 * (e.g., expand "VA" to "Virginia"), or enter a string to name the region manually
	 */
	regionName?: boolean|string;
}

const template: HTMLTemplateElement = xjs.HTMLTemplateElement
	.fromFileSync(path.join(__dirname, '../../../src/x-address/tpl/x-address.tpl.html')) // NB relative to dist
	.node

/**
 * A postal address.
 * @param   frag the template to process
 * @param   data http://schema.org/PostalAddress
 * @param   opts additional processing options
 */
function instructions(frag: DocumentFragment, data: sdo.PostalAddress, opts: OptsType): void {
	/**
	 * References to formatting elements.
	 *
	 * We want to create these references before removing any elements from the DOM.
	 * @private
	 */
	const formatting = {
		/** The comma between locality and region. */
		comma: frag.querySelector('slot[name="addressLocality"] + span') !,
		/** Line breaks separating lines of address. */
		linebreaks : [...frag.querySelectorAll('br')],
	}

  ;[
    'streetAddress',
    'addressLocality',
    'addressRegion',
    'postalCode',
    'addressCountry',
  ].forEach((nameprop) => {
    let slot = frag.querySelector(`slot[name="${nameprop}"]`) !
    if (data[nameprop]) {
      slot.textContent = data[nameprop]
    } else slot.remove()
  })

  // unabbreviate the region name
  if (data.addressRegion) {
		;(frag.querySelector('data[itemprop="addressRegion"]') as HTMLDataElement).value = data.addressRegion
    if (opts.regionName === true) {
      frag.querySelector('slot[name="addressRegion"]') !.textContent = (() => {
				let state: StateType|null = STATE_DATA.find((state) => state.code === data.addressRegion) || null
				if (state == null) {
					let err: string = `No data found for ${data.addressRegion}.`
					console.error(err)
					return err
				}
				return state.name
      })()
    } else if (opts.regionName) {
      frag.querySelector('slot[name="addressRegion"]') !.textContent = opts.regionName
    }
  } else {
    frag.querySelector('data[itemprop="addressRegion"]') !.remove()
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
