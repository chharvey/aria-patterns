const ARIAPatterns = require('../index.js')
const xjs = require('extrajs-dom')


let output = new xjs.DocumentFragment(ARIAPatterns.xPersonFullname.render({
  "@type": "Person",
  "familyName"     : "King",
  "givenName"      : "Martin",
  "additionalName" : "Luther",
  "honorificPrefix": "Dr.",
  "honorificSuffix": "Jr."
})).innerHTML()

console.log(output)
