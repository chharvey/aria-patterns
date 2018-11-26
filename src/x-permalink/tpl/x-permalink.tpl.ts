import * as path from 'path'

import * as xjs from 'extrajs-dom'
import {Processor} from 'template-processor'


interface DataType {
	/**
	 * The fragment identifier to link to.
	 */
	id: string;
	/**
	 * Human-readable text for `[aria-label]`.
	 * @default 'permalink'
	 */
	label?: string;
	/**
	 * The `textContent` of the link.
	 * @default '§'
	 */
	text?: string;
}

const template: HTMLTemplateElement = xjs.HTMLTemplateElement
	.fromFileSync(path.join(__dirname, '../../../src/x-permalink/tpl/x-permalink.tpl.html')) // NB relative to dist
	.node

/**
 * A permalink for sections of a webpage.
 * @param   frag the template to process
 * @param   data the job data to display
 */
function instructions(frag: DocumentFragment, data: DataType): void {
  new xjs.HTMLAnchorElement(frag.querySelector('a'))
    .href(`#${data.id}`)
    .attr('aria-label', data.label || 'permalink')
    .textContent(data.text || '§') // &sect;
}

export default new Processor(template, instructions)
