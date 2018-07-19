const path = require('path')

const xjs = {
  ...require('extrajs'),
  ...require('extrajs-dom'),
}

/**
 * @summary xDirectory renderer.
 * @param   {DocumentFragment} frag the template content with which to render
 * @param   {sdo.WebPage} data                              http://schema.org/WebPage
 * @param   {(sdo.WebPage|Array<sdo.WebPage>)} data.hasPart http://schema.org/hasPart
 * @param   {integer=} [data.$depth=Infinity] deprecated form of param `options.depth`
 * @param   {!Object=} opts additional rendering options
 * @param   {integer=} [opts.depth=Infinity] number of nested directory levels
 */
function xDirectory_renderer(frag, data, opts = {}) {
  let subpages = (xjs.Object.typeOf(data.hasPart) === 'array' ) ? data.hasPart : [data.hasPart]
  let depth    = (xjs.Object.typeOf(opts.depth)   === 'number') ? opts.depth : (xjs.Object.typeOf(data.$depth)  === 'number') ? data.$depth : Infinity
  new xjs.HTMLOListElement(frag.querySelector('[role="directory"]')).populate(subpages, function (f, d, o) {
    f.querySelector('[itemprop="url"]' ).href        = d.url
    f.querySelector('[itemprop="name"]').textContent = d.name
    if (d.hasPart && depth > 0) {
      f.querySelector('[itemprop="hasPart"]').append(
        require(__filename).render(d, null, { depth: depth - 1 })
      )
    }
  })
}

module.exports = xjs.HTMLTemplateElement
  .fromFileSync(path.join(__dirname, './x-directory.tpl.html'))
  .setRenderer(xDirectory_renderer)
