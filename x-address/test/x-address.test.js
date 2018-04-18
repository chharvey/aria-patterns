const fs = require('fs')
const path = require('path')

const xjs = require('extrajs-dom')

const createDir = require('../../lib/createDir.js')
const ARIAPatterns = require('../../index.js')


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
    new xjs.DocumentFragment(ARIAPatterns.xAddress.render(data)).innerHTML()
  }</span>
</p>
`

createDir('./x-address/test/out/').then(function (v) {
  fs.writeFileSync(path.resolve(__dirname, './out/x-address.test.html'), output, 'utf8')
})
