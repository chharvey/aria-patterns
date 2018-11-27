import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'

import * as mkdirp from 'make-dir'

import * as xjs from 'extrajs-dom'
import * as sdo from 'schemaorg-jsd/dist/schemaorg' // TODO use an index file

import {xDirectory} from '../../index'


interface WP extends sdo.WebPage {
	'@type'?: string;
	'@context'?:string;
	hasPart?: WP|WP[];
}

let data: WP = {
  "@context": "http://schema.org/",
  "@type": "WebPage",
  "name": "A 2016 Event",
  "url": "https://2016.asce-event.org/",
  "hasPart": [
    {
      "@type": "WebPage",
      "name": "Home",
      "url": "https://2016.asce-event.org/"
    },
    {
      "@type": "WebPage",
      "name": "Registration",
      "url": "https://2016.asce-event.org/registration/",
      "hasPart": [
        { "@type": "WebPage", "name": "Why Attend" , "url": "https://2016.asce-event.org/registration/why-attend/" },
        { "@type": "WebPage", "name": "Volunteer"  , "url": "https://2016.asce-event.org/registration/volunteer/",
          "hasPart": { "@type": "WebPage", "name": "For Students", "url": "https://2016.asce-event.org/registration/volunteer/for-students/" }
        }
      ]
    },
    {
      "@type": "WebPage",
      "name": "Program",
      "url": "https://2016.asce-event.org/program/",
      "hasPart": [
        { "@type": "WebPage", "name": "Short Courses"   , "url": "https://2016.asce-event.org/program/short-courses/"   },
        { "@type": "WebPage", "name": "Technical Tours" , "url": "https://2016.asce-event.org/program/technical-tours/" },
        { "@type": "WebPage", "name": "Optional Tours"  , "url": "https://2016.asce-event.org/program/optional-tours/"  }
      ]
    },
    {
      "@type": "WebPage",
      "name": "Location",
      "url": "https://2016.asce-event.org/location/"
    },
    {
      "@type": "WebPage",
      "name": "Speakers",
      "url": "https://2016.asce-event.org/speakers/",
      "hasPart": { "@type": "WebPage", "name": "Distinguished Lecturers", "url": "https://2016.asce-event.org/speakers/distinguished-lecturers/" }
    },
    {
      "@type": "WebPage",
      "name": "Sponsor",
      "url": "https://2016.asce-event.org/sponsor/",
      "hasPart": [
        { "@type": "WebPage", "name": "Partnering Orgs"  , "url": "https://2016.asce-event.org/sponsor/partnering-orgs/"  },
        { "@type": "WebPage", "name": "Cooperating Orgs" , "url": "https://2016.asce-event.org/sponsor/cooperating-orgs/" }
      ]
    },
    {
      "@type": "WebPage",
      "name": "Exhibit",
      "url": "https://2016.asce-event.org/exhibit/",
      "hasPart": { "@type": "WebPage", "name": "Exhibitor List", "url": "https://2016.asce-event.org/exhibit/exhibitor-list/" }
    },
    {
      "@type": "WebPage",
      "name": "About",
      "url": "https://2016.asce-event.org/about/"
    },
    {
      "@type": "WebPage",
      "name": "Contact",
      "url": "https://2016.asce-event.org/contact/",
      "hasPart": [
        { "@type": "WebPage", "name": "Submit Feedback"          , "url": "https://2016.asce-event.org/contact/submit-feedback"     },
        { "@type": "WebPage", "name": "Talk to a Representative" , "url": "https://2016.asce-event.org/contact/talk-representative" }
      ]
    }
  ]
}

let output: string = `
<header><nav>${new xjs.DocumentFragment(xDirectory.process(data)).innerHTML()}</nav></header>
`

export default mkdirp(path.join(__dirname, '../docs/')).then((_pth) =>
	util.promisify(fs.writeFile)(path.join(__dirname, '../docs/x-directory.test.html'), output, 'utf8')
)
