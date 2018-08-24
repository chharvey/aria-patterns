const fs = require('fs')
const path = require('path')

const xjs = require('extrajs-dom')
const mkdirp = require('make-dir')

const {xAddress} = require('../index.js')


let data = {
  "@type": "PostalAddress",
  "streetAddress"  : "1 First St NE",
  "addressLocality": "Washington",
  "addressRegion"  : "DC",
  "postalCode"     : "20543",
  "addressCountry" : "United States",
}

let output = `
<p itemscope="" itemtype="http://schema.org/Place">
  <span itemprop="location" itemscope="" itemtype="http://schema.org/PostalAddress">${
    new xjs.DocumentFragment(xAddress.template.render(xAddress.renderer[0], data)).innerHTML()
  }</span>
</p>
`

mkdirp(path.join(__dirname, './out/')).then((pth) => {
  return util.promisify(fs.writeFile)(path.join(__dirname, './out/x-address.test.html'), output, 'utf8')
}).catch((e) => {})
