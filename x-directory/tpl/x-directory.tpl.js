const path = require('path')

const xjs = {
  ...require('extrajs'),
  ...require('extrajs-dom'),
}

/**
 * @summary xDirectory renderer.
 * @param   {DocumentFragment} frag the template content with which to render
 * @param   {sdo.WebPage} data a web page
 * @param   {(sdo.WebPage|Array<sdo.WebPage>)} data.hasPart a subpage or an array of subpages
 * @param   {integer=} [data.$depth=Infinity] number of nested directory levels
 */
function xDirectory_renderer(frag, data) {
  let subpages = (xjs.Object.typeOf(data.hasPart) === 'array' ) ? data.hasPart : [data.hasPart]
  let depth    = (xjs.Object.typeOf(data.$depth)  === 'number') ? data.$depth  : Infinity
  new xjs.HTMLOListElement(frag.querySelector('[role="directory"]')).populate(subpages, function (f, d) {
    f.querySelector('[itemprop="url"]' ).href        = d.url
    f.querySelector('[itemprop="name"]').textContent = d.name
    if (d.hasPart && depth > 0) {
      f.querySelector('[itemprop="hasPart"]').append(
        require(__filename).render({ ...d, $depth: depth - 1 })
      )
    }
  })
}

module.exports = xjs.HTMLTemplateElement
  .fromFileSync(path.resolve(__dirname, './x-directory.tpl.html'))
  .setRenderer(xDirectory_renderer)
