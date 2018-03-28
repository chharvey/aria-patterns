const path = require('path')

const xjs = require('extrajs-dom')

/**
 * @summary xPersonFullname renderer.
 * @param {DocumentFragment} frag the template content with which to render
 * @param {sdo.Person} data a JSON object representing a Person
 * @param {string}  data.givenName the person’s first name
 * @param {string}  data.familyName the person’s last name
 * @param {string=} data.additionalName  the person’s middle name or initial
 * @param {string=} data.honorificPrefix a prefix, if any (e.g. 'Mr.', 'Ms.', 'Dr.')
 * @param {string=} data.honorificSuffix the suffix, if any (e.g. 'M.D.', 'Jr.')
 */
function xPersonFullname_renderer(frag, data) {
    ;[
      'familyName',
      'givenName',
      'additionalName',
      'honorificPrefix',
      'honorificSuffix',
    ].forEach(function (nameprop) {
      let slot = frag.querySelector(`slot[name="${nameprop}"]`)
      if (data[nameprop]) {
        slot.textContent = data[nameprop]
      } else slot.remove()
    })

    // abbreviate the middle name
    if (data.additionalName) {
      frag.querySelector('slot[name="additionalName"]'    ).textContent = `${data.additionalName[0]}.`
      frag.querySelector('abbr[itemprop="additionalName"]').title       = data.additionalName
    } else {
      frag.querySelector('abbr[itemprop="additionalName"]').remove()
    }

    // comma preceding suffix
    if (!data.honorificSuffix) {
      frag.querySelector('slot[name="familyName] + span').remove()
    }
}

module.exports = xjs.HTMLTemplateElement
  .fromFileSync(path.resolve(__dirname, './x-person-fullname.tpl.html'))
  .setRenderer(xPersonFullname_renderer)
