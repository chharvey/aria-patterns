import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'

import * as mkdirp from 'make-dir'

import * as xjs from 'extrajs-dom'
import * as sdo from 'schemaorg-jsd/dist/schemaorg' // TODO use an index file

import {xPersonFullname} from '../../index'


let data = {
  "@type": "Person",
  "familyName"     : "King",
  "givenName"      : "Martin",
  "additionalName" : "Luther",
  "honorificPrefix": "Dr.",
  "honorificSuffix": "Jr."
}

let output = `
<article itemscope="" itemtype="http://schema.org/Person">
  <h1 itemprop="name">${
    new xjs.DocumentFragment(xPersonFullname.process(data)).innerHTML()
  }</h1>
</article>
`

export default mkdirp(path.join(__dirname, './out/')).then((pth) => {
  return util.promisify(fs.writeFile)(path.join(__dirname, './out/x-person-fullname.test.html'), output, 'utf8')
}).catch((e) => { console.error(e) })
