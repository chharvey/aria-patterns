import * as path from 'path'

import * as xjs1 from 'extrajs'
import * as xjs2 from 'extrajs-dom'
import {Processor} from 'template-processor'
import * as sdo from 'schemaorg-jsd/dist/schemaorg' // TODO use an index file

const xjs = { ...xjs1, ...xjs2 }


const template/*: HTMLTemplateElement*/ = xjs.HTMLTemplateElement
	.fromFileSync(path.join(__dirname, '../../../src/x-directory/tpl/x-directory.tpl.html')) // NB relative to dist
	.node

/**
 * A website directory, in the form of a document outline.
 * @param   {DocumentFragment} frag the template content with which to render
 * @param   {sdo.WebPage} data                              http://schema.org/WebPage
 * @param   {(sdo.WebPage|Array<sdo.WebPage>)} data.hasPart http://schema.org/hasPart
 * @param   {!Object=} opts additional rendering options
 * @param   {integer=} [opts.depth=Infinity] number of nested directory levels
 */
function instructions(frag/*: DocumentFragment*/, data/*: sdo.WebPage*/, opts/*: { depth?: integer }*/) {
  let subpages = (xjs.Object.typeOf(data.hasPart) === 'array' ) ? data.hasPart : [data.hasPart]
  let depth    = (xjs.Object.typeOf(opts.depth)   === 'number') ? opts.depth : Infinity
  new xjs.HTMLOListElement(frag.querySelector('[role="directory"]')).populate(function (f, d) {
    f.querySelector('[itemprop="url"]' ).href        = d.url
    f.querySelector('[itemprop="name"]').textContent = d.name
    if (d.hasPart && depth > 0) {
      let template = xjs.HTMLTemplateElement.fromFileSync(path.join(__dirname, './x-directory.tpl.html'))
      f.querySelector('[itemprop="hasPart"]').append(
        xDirectory.process(d, { depth: depth - 1 })
      )
    }
  }, subpages)
}

const xDirectory = new Processor(template, instructions)

export default xDirectory
