const AriaPatterns = require('../index.js')

try {
  console.log(AriaPatterns.xPermalink.render({ id: 'my_id' }).querySelector('a').outerHTML)
} catch (e) {
  console.log('An Error was caught:\t', e)
}

try {
  console.log(AriaPatterns.xPermalink.render({
    id   : 'my_id',
    text : 'custom text',
    label: 'custom label',
  }).querySelector('a').outerHTML)
} catch (e) {
  console.log('An Error was caught:\t', e)
}
