const path = require('path')

const xjs = {
  Object: require('extrajs').Object,
  ...require('extrajs-dom'),
}

/**
 * @summary xDirectory renderer.
 * @param   {DocumentFragment} frag the template content with which to render
 * @param   {sdo.WebPage} data                              http://schema.org/WebPage
 * @param   {(sdo.WebPage|Array<sdo.WebPage>)} data.hasPart http://schema.org/hasPart
 * @param   {!Object=} opts additional rendering options
 * @param   {integer=} [opts.depth=Infinity] number of nested directory levels
 */
let xDirectory_renderer/*: RenderingFunction<sdo.WebPage, { depth?: integer }>*/ = function xDirectory_renderer(frag, data, opts) {
  let subpages = (xjs.Object.typeOf(data.hasPart) === 'array' ) ? data.hasPart : [data.hasPart]
  let depth    = (xjs.Object.typeOf(opts.depth)   === 'number') ? opts.depth : Infinity
  let itemrenderer/*: RenderingFunction<sdo.WebPage, object>*/ = function itemrenderer(f, d, o) {
    f.querySelector('[itemprop="url"]' ).href        = d.url
    f.querySelector('[itemprop="name"]').textContent = d.name
    if (d.hasPart && depth > 0) {
      let template = xjs.HTMLTemplateElement.fromFileSync(path.join(__dirname, './x-directory.tpl.html'))
      f.querySelector('[itemprop="hasPart"]').append(
        template.render(xDirectory_renderer, d, { depth: depth - 1 })
      )
    }
  }
  new xjs.HTMLOListElement(frag.querySelector('[role="directory"]')).populate(itemrenderer, subpages)
}

module.exports = [xDirectory_renderer]
