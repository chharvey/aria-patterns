import * as path from 'path'

import * as xjs from 'extrajs-dom'
import { Processor } from 'template-processor'
import * as sdo from 'schemaorg-jsd'


const template: HTMLTemplateElement = xjs.HTMLTemplateElement
	.fromFileSync(path.join(__dirname, '../../../src/x-person-fullname/tpl/x-person-fullname.tpl.html')) // NB relative to dist
	.node

function instructions(frag: DocumentFragment, data: sdo.Person): void {
	/**
	 * References to formatting elements.
	 *
	 * We want to create these references before removing any elements from the DOM.
	 * @private
	 */
	const formatting = {
		/** The comma preceding the honorific suffix. */
		comma: frag.querySelector('slot[name="familyName"] + span') !,
	}

	new xjs.Element(frag.querySelector('slot[name="familyName"]'     ) !).exe(function () { (data.familyName     ) ? this.textContent(data.familyName     ) : this.node.remove() })
	new xjs.Element(frag.querySelector('slot[name="givenName"]'      ) !).exe(function () { (data.givenName      ) ? this.textContent(data.givenName      ) : this.node.remove() })
	new xjs.Element(frag.querySelector('slot[name="honorificPrefix"]') !).exe(function () { (data.honorificPrefix) ? this.textContent(data.honorificPrefix) : this.node.remove() })
	new xjs.Element(frag.querySelector('slot[name="honorificSuffix"]') !).exe(function () { (data.honorificSuffix) ? this.textContent(data.honorificSuffix) : this.node.remove() })

  // abbreviate the middle name
  if (data.additionalName) {
		let middle_string : string;
		let middle_initial: string;
		if (data.additionalName instanceof Array) {
			middle_string  = data.additionalName.join(' ')
			middle_initial = data.additionalName.map((n) => `${n[0]}.`).join(' ')
		} else {
			middle_string  = data.additionalName
			middle_initial = `${data.additionalName[0]}.`
		}
		; frag.querySelector('slot[name="additionalName"]'    ) !              .textContent = middle_initial
		;(frag.querySelector('abbr[itemprop="additionalName"]') as HTMLElement).title       = middle_string
  } else {
    frag.querySelector('abbr[itemprop="additionalName"]') !.remove()
  }

  // remove unnecessary comma preceding suffix
  if (!data.honorificSuffix) {
    formatting.comma.remove()
  }
}

/**
 * A person’s name in "Px. First M. Last, Sx." format.
 */
const xPersonFullname: Processor<sdo.Person> = new Processor(template, instructions)
export default xPersonFullname
