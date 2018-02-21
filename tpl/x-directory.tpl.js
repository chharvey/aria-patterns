const path = require('path')

const xjs = require('extrajs-dom')

/**
 * @summary xDirectory renderer.
 * @param   {DocumentFragment} frag the template content with which to render
 * @param   {Array<sdo.WebPage>} data array of subpages of a webpage
 */
function xDirectory(frag, data) {
  let container = frag.querySelector('ol')
  let itemrenderer = new xjs.HTMLTemplateElement(container.querySelector('template')).setRenderer(function (f, d) {
    f.querySelector('[itemprop="url"]' ).href        = d.url
    f.querySelector('[itemprop="name"]').textContent = d.name

    let subsitemap = d.sitemap && d.sitemap.itemListElement
    if (subsitemap) {
      f.querySelector('[itemprop="itemlistElement"]').append(
        xjs.HTMLTemplateElement
          .fromFileSync(path.join(__dirname, './x-directory.tpl.html'))
          .setRenderer(xDirectory)
          .render((Array.isArray(subsitemap)) ? subsitemap : [subsitemap])
      )
    }
  })
  container.append(...data.map((subpage) => itemrenderer.render(subpage)))
}

module.exports = xjs.HTMLTemplateElement
  .fromFileSync(path.join(__dirname, './x-directory.tpl.html'))
  .setRenderer(xDirectory)
