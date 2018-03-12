const fs = require('fs')
const path = require('path')

const xjs = require('extrajs-dom')

const ARIAPatterns = require('../index.js')


let output = new xjs.DocumentFragment(ARIAPatterns.xAddress.render({
  "@type": "PostalAddress",
  "$itemprop"      : "location",
  "streetAddress"  : "1600 Amphitheatre Parkway",
  "addressLocality": "Mountain View",
  "addressRegion"  : "CA",
  "postalCode"     : "94043",
  "addressCountry" : "United States",
})).innerHTML()

output = `<p itemscope="" itemtype="http://schema.org/Organization">${output}</p>`

fs.writeFileSync(path.resolve(__dirname, '../docs/test/xAddress.test.html'), output, 'utf8')
