import * as path from 'path'

import * as xjs1 from 'extrajs'
import * as xjs2 from 'extrajs-dom'
import {Processor} from 'template-processor'
import * as sdo from 'schemaorg-jsd/dist/schemaorg' // TODO use an index file

const xjs = { ...xjs1, ...xjs2 }


interface OptsType {
	/**
	 * number of nested directory levels
	 * @default Infinity
	 */
	depth?: number;
}

const template: HTMLTemplateElement = xjs.HTMLTemplateElement
	.fromFileSync(path.join(__dirname, '../../../src/x-directory/tpl/x-directory.tpl.html')) // NB relative to dist
	.node

/**
 * A website directory, in the form of a document outline.
 * @param   frag the template to process
 * @param   data http://schema.org/WebPage
 * @param   opts additional processing options
 */
function instructions(frag: DocumentFragment, data: sdo.WebPage, opts: OptsType): void {
	let subpages : sdo.CreativeWork[] = (data.hasPart instanceof Array) ? data.hasPart : (data.hasPart) ? [data.hasPart] : []
	let depth    : number = (typeof opts.depth === 'number') ? Math.round(opts.depth) : Infinity
  new xjs.HTMLOListElement(frag.querySelector('[role="directory"]') as HTMLOListElement).populate(function (f, d) {
		;(f.querySelector('[itemprop="url"]' ) as HTMLAnchorElement).href        = d.url  || '#0'
		; f.querySelector('[itemprop="name"]') !                    .textContent = d.name || d.toString()
    if (d.hasPart && depth > 0) {
      f.querySelector('[itemprop="hasPart"]') !.append(
        xDirectory.process(d, { depth: depth - 1 })
      )
    }
  }, subpages)
}

const xDirectory = new Processor(template, instructions)

export default xDirectory
