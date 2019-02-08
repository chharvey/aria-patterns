import * as xjs from 'extrajs-dom'
import * as sdo from 'schemaorg-jsd'

import { xPersonFullname } from '../../index'


let data: sdo.Person = {
  "familyName"     : "King",
  "givenName"      : "Martin",
  "additionalName" : "Luther",
  "honorificPrefix": "Dr.",
  "honorificSuffix": "Jr."
}

export default  `
<article itemscope="" itemtype="http://schema.org/Person">
  <h1 itemprop="name">${
    new xjs.DocumentFragment(xPersonFullname.process(data)).innerHTML()
  }</h1>
</article>
`
