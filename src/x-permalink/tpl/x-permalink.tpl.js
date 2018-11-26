const path = require('path')

const xjs = require('extrajs-dom')
const {Processor} = require('template-processor')

const template/*: HTMLTemplateElement*/ = xjs.HTMLTemplateElement
	.fromFileSync(path.join(__dirname, '../../../src/x-permalink/tpl/x-permalink.tpl.html')) // NB relative to dist
	.node

/**
 * A permalink for sections of a webpage.
 * @param   {DocumentFragment} frag the template content with which to render
 * @param   {!Object} data the job data to display
 * @param   {string} data.id the fragment identifier to link to
 * @param   {string=} data.label human-readable text for `[aria-label]`
 * @param   {string=} data.text the textContent of the link
 */
function instructions(frag/*: DocumentFragment*/, data/*: { id: string, label?: string, text?: string }*/) {
  new xjs.HTMLAnchorElement(frag.querySelector('a'))
    .href(`#${data.id}`)
    .attr('aria-label', data.label || 'permalink')
    .textContent(data.text || '§') // &sect;
}

module.exports = new Processor(template, instructions)
