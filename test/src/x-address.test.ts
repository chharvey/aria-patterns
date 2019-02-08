import * as xjs from 'extrajs-dom'
import * as sdo from 'schemaorg-jsd'

import { xAddress } from '../../index'


let data: sdo.PostalAddress = {
  "streetAddress"  : "1 First St NE",
  "addressLocality": "Washington",
  "addressRegion"  : "DC",
  "postalCode"     : "20543",
  "addressCountry" : "United States",
}

export default `
<p itemscope="" itemtype="http://schema.org/Place">
  <span itemprop="location" itemscope="" itemtype="http://schema.org/PostalAddress">${
    new xjs.DocumentFragment(xAddress.process(data)).innerHTML()
  }</span>
</p>
`
