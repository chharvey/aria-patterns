import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'

import * as mkdirp from 'make-dir'

import * as xjs from 'extrajs-dom'
import * as sdo from 'schemaorg-jsd/dist/schemaorg' // TODO use an index file

import {xAddress} from '../../index'


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
    new xjs.DocumentFragment(xAddress.process(data)).innerHTML()
  }</span>
</p>
`

export default mkdirp(path.join(__dirname, './out/')).then((pth) => {
  return util.promisify(fs.writeFile)(path.join(__dirname, './out/x-address.test.html'), output, 'utf8')
}).catch((e) => { console.error(e) })
