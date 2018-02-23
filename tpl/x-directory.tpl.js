const path = require('path')

const xjs = require('extrajs-dom')

/**
 * @summary xDirectory renderer.
 * @param   {DocumentFragment} frag the template content with which to render
 * @param   {sdo.WebPage} data a http://schema.org/WebPage object
 * @param   {(sdo.WebPage|Array<sdo.WebPage>)} data.hasPart a subpage or an array of subpages (each a http://schema.org/WebPage object)
 */
function xDirectory_renderer(frag, data) {
  let subpages = (Array.isArray(data.hasPart)) ? data.hasPart : [data.hasPart]
  new xjs.HTMLOListElement(frag.querySelector('ol')).populate(subpages, function (f, d) {
    f.querySelector('[itemprop="url"]' ).href        = d.url
    f.querySelector('[itemprop="name"]').textContent = d.name
    if (d.hasPart) {
      f.querySelector('[itemprop="hasPart"]').append(
        require(__filename).render(d)
      )
    }
  })
}

module.exports = xjs.HTMLTemplateElement
  .fromFileSync(path.join(__dirname, './x-directory.tpl.html'))
  .setRenderer(xDirectory_renderer)
