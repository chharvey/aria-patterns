const fs = require('fs')
const path = require('path')

const xjs = require('extrajs-dom')

const ARIAPatterns = require('../index.js')


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

fs.writeFileSync(path.resolve(__dirname, '../docs/test/xPersonFullname.test.html'), output, 'utf8')
