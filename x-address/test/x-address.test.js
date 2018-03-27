const fs = require('fs')
const path = require('path')

const xjs = require('extrajs-dom')

const createDir = require('../../lib/createDir.js')
const ARIAPatterns = require('../../index.js')


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

createDir('./x-address/test/out/').then(function (v) {
  fs.writeFileSync(path.resolve(__dirname, './out/x-address.test.html'), output, 'utf8')
})
