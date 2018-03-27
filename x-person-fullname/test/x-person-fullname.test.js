const fs = require('fs')
const path = require('path')

const xjs = require('extrajs-dom')

const createDir = require('../../lib/createDir.js')
const ARIAPatterns = require('../../index.js')


let output = `
<p itemscope="" itemtype="http://schema.org/Person">${new xjs.DocumentFragment(ARIAPatterns.xPersonFullname.render({
  "@type": "Person",
  "familyName"     : "King",
  "givenName"      : "Martin",
  "additionalName" : "Luther",
  "honorificPrefix": "Dr.",
  "honorificSuffix": "Jr."
})).innerHTML()}</p>
`

createDir('./x-person-fullname/test/out/').then(function (v) {
  fs.writeFileSync(path.resolve(__dirname, './out/x-person-fullname.test.html'), output, 'utf8')
})
