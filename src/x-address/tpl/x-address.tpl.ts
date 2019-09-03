import * as path from 'path'

import * as xjs from 'extrajs-dom'
import { Processor } from 'template-processor'
import * as sdo from 'schemaorg-jsd'

type StateType = { code: string, name: string }
const STATE_DATA: StateType[] = require('extrajs-geo')
STATE_DATA.push(...[
  { "code": "DC", "name": "District of Columbia" },
])


interface XAddressOptsType {
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

function instructions(frag: DocumentFragment, data: sdo.PostalAddress, opts: XAddressOptsType): void {
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

	new xjs.Element(frag.querySelector('slot[name="streetAddress"]'  ) !).exe(function () { (data.streetAddress  ) ? this.textContent(data.streetAddress  ) : this.node.remove() })
	new xjs.Element(frag.querySelector('slot[name="addressLocality"]') !).exe(function () { (data.addressLocality) ? this.textContent(data.addressLocality) : this.node.remove() })
	new xjs.Element(frag.querySelector('slot[name="addressRegion"]'  ) !).exe(function () { (data.addressRegion  ) ? this.textContent(data.addressRegion  ) : this.node.remove() })
	new xjs.Element(frag.querySelector('slot[name="postalCode"]'     ) !).exe(function () { (data.postalCode     ) ? this.textContent(data.postalCode     ) : this.node.remove() })
	new xjs.Element(frag.querySelector('slot[name="addressCountry"]' ) !).exe(function () { (data.addressCountry ) ? this.textContent(data.addressCountry ) : this.node.remove() })

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

/**
 * Template for processing a postal address, in the format:
 * ```
 * 1600 Pennsylvania Avenue NW
 * Washington, DC 20006
 * ```
 */
const xAddress: Processor<sdo.PostalAddress, XAddressOptsType> = new Processor(template, instructions)
export default xAddress
