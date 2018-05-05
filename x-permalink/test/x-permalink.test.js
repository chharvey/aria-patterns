const fs = require('fs')
const path = require('path')

const xjs = require('extrajs-dom')

const createDir = require('../../lib/createDir.js')
const ARIAPatterns = require('../../index.js')


let output = `
<!--link rel="stylesheet" href="/node_modules/aria-patterns/x-permalink/css/dist/c-Permalink.css"/-->
<section id="section-title">
  <h1>Section Title${new xjs.DocumentFragment(ARIAPatterns.xPermalink.render({ id: 'section-title' })).innerHTML()}</h1>
</section>
`

createDir('./x-permalink/test/out/').then(function (v) {
  fs.writeFileSync(path.resolve(__dirname, './out/x-permalink.test.html'), output, 'utf8')
})
