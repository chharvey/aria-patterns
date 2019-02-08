import * as path from 'path'

import { NaNError } from 'extrajs'
import * as xjs from 'extrajs-dom'
import { Processor } from 'template-processor'
import * as sdo from 'schemaorg-jsd'


interface XDirectoryOptsType {
	/**
	 * number of nested directory levels
	 * @default Infinity
	 */
	depth?: number;
}

const template: HTMLTemplateElement = xjs.HTMLTemplateElement
	.fromFileSync(path.join(__dirname, '../../../src/x-directory/tpl/x-directory.tpl.html')) // NB relative to dist
	.node

function instructions(frag: DocumentFragment, data: sdo.WebPage, opts: XDirectoryOptsType): void {
	if (Number.isNaN(opts.depth !)) throw new NaNError()
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

/**
 * A static outlined list of pages on a website, commonly known as a “sitemap”.
 * Within a document, serves as a document outline.
 */
const xDirectory: Processor<sdo.WebPage, XDirectoryOptsType> = new Processor(template, instructions)
export default xDirectory
