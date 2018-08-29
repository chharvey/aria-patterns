const fs = require('fs')
const path = require('path')
const util = require('util')

const xjs = require('extrajs-dom')
const mkdirp = require('make-dir')

const {xPersonFullname} = require('../index.js')


let data = {
  "@type": "Person",
  "familyName"     : "King",
  "givenName"      : "Martin",
  "additionalName" : "Luther",
  "honorificPrefix": "Dr.",
  "honorificSuffix": "Jr."
}

let output = `
<article itemscope="" itemtype="http://schema.org/Person">
  <h1 itemprop="name">${
    new xjs.DocumentFragment(xPersonFullname.template.render(xPersonFullname.renderer[0], data)).innerHTML()
  }</h1>
</article>
`

module.exports = async () => {
  await mkdirp(path.join(__dirname, './out/'));
  return util.promisify(fs.writeFile)(path.join(__dirname, './out/x-person-fullname.test.html'), output, 'utf8')
}
