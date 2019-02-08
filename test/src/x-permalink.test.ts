import * as xjs from 'extrajs-dom'

import { xPermalink } from '../../index'


export default `
<!--link rel="stylesheet" href="/node_modules/aria-patterns/dist/x-permalink/css/c-Permalink.css"/-->
<section id="section-title">
	<h1>Section Title${new xjs.DocumentFragment(xPermalink.process({ id: 'section-title' })).innerHTML()}</h1>
</section>
`
