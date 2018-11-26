import * as path from 'path'

import * as xjs from 'extrajs-dom'
import {Processor} from 'template-processor'
import * as sdo from 'schemaorg-jsd/dist/schemaorg' // TODO use an index file


const template: HTMLTemplateElement = xjs.HTMLTemplateElement
	.fromFileSync(path.join(__dirname, '../../../src/x-person-fullname/tpl/x-person-fullname.tpl.html')) // NB relative to dist
	.node

/**
 * A person’s name in "Px. First M. Last, Sx." format.
 * @param   frag the template to process
 * @param   data http://schema.org/Person
 */
function instructions(frag: DocumentFragment, data: sdo.Person): void {
  /**
   * @summary References to formatting elements.
   * @description We want to create these references before removing any elements from the DOM.
   * @private
   * @constant {!Object}
   */
  const formatting = {
    /** The comma preceding the honorific suffix. */ comma: frag.querySelector('slot[name="familyName"] + span') !,
  }
  ;[
    'familyName',
    'givenName',
    'additionalName',
    'honorificPrefix',
    'honorificSuffix',
  ].forEach((nameprop) => {
    let slot = frag.querySelector(`slot[name="${nameprop}"]`) !
    if (data[nameprop]) {
      slot.textContent = data[nameprop]
    } else slot.remove()
  })

  // abbreviate the middle name
  if (data.additionalName) {
    frag.querySelector('slot[name="additionalName"]'    ) !.textContent = `${data.additionalName[0]}.`
    ;(frag.querySelector('abbr[itemprop="additionalName"]') as HTMLElement).title       = data.additionalName
  } else {
    frag.querySelector('abbr[itemprop="additionalName"]') !.remove()
  }

  // remove unnecessary comma preceding suffix
  if (!data.honorificSuffix) {
    formatting.comma.remove()
  }
}

export default new Processor(template, instructions)
