import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'

import * as mkdirp from 'make-dir'

import * as xjs from 'extrajs-dom'

import {xPermalink} from '../../index'


let output: string = `
<!--link rel="stylesheet" href="/node_modules/aria-patterns/dist/x-permalink/css/c-Permalink.css"/-->
<section id="section-title">
	<h1>Section Title${new xjs.DocumentFragment(xPermalink.process({ id: 'section-title' })).innerHTML()}</h1>
</section>
`

export default mkdirp(path.join(__dirname, '../docs/')).then((_pth) =>
	util.promisify(fs.writeFile)(path.join(__dirname, '../docs/x-permalink.test.html'), output, 'utf8')
)
