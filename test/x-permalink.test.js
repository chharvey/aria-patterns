const fs = require('fs')
const path = require('path')

const xjs = require('extrajs-dom')
const mkdirp = require('make-dir')

const {xPermalink} = require('../index.js')


let output = `
<!--link rel="stylesheet" href="/node_modules/aria-patterns/dist/x-permalink/css/c-Permalink.css"/-->
<section id="section-title">
  <h1>Section Title${new xjs.DocumentFragment(xPermalink.template.render(xPermalink.renderer[0], { id: 'section-title' })).innerHTML()}</h1>
</section>
`

mkdirp(path.join(__dirname, './out/')).then((pth) => {
  return util.promisify(fs.writeFile)(path.join(__dirname, './out/x-permalink.test.html'), output, 'utf8')
}).catch((e) => {})
