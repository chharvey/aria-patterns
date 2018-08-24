const fs = require('fs')
const path = require('path')

const xjs = require('extrajs-dom')

const createDir = require('../lib/createDir.js')
const {xPermalink} = require('../index.js')


let output = `
<!--link rel="stylesheet" href="/node_modules/aria-patterns/dist/x-permalink/css/c-Permalink.css"/-->
<section id="section-title">
  <h1>Section Title${new xjs.DocumentFragment(xPermalink.template.render(xPermalink.renderer[0], { id: 'section-title' })).innerHTML()}</h1>
</section>
`

createDir('./test/out/').then(function (v) {
  fs.writeFileSync(path.resolve(__dirname, './out/x-permalink.test.html'), output, 'utf8')
}).catch((e) => {})
