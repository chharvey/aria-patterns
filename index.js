/**
 * @summary A set of component builders.
 * @namespace
 */
const ARIAPatterns = {
  /**
   * @summary A permalink for sections of a webpage.
   * @description An `<a.c-Permlink>` element. Best inside an `<h1>`.
   * @example
   * const ARIAPatterns = require('aria-patterns')
   * document.querySelector('#section-title > h1').append(
   *   ARIAPatterns.xPermalink.render({id: 'section-title'})
   * )
   * @see xPermalink_renderer
   * @type {xjs.HTMLTemplateElement}
   */
  xPermalink: require('./tpl/x-permalink.tpl.js'),
  /**
   * @summary A webpage’s directory, in the form of a document outline.
   * @description An `<ol role="directory">` with link list items to subpages. Best inside a `<nav>`.
   * @example
   * const ARIAPatterns = require('aria-patterns')
   * let webpage = {
   *   "@type": "WebPage",
   *   "name": "A 2016 Event",
   *   "url": "https://2016.asce-event.org/",
   *   "hasPart": [
   *     {
   *       "@type": "WebPage",
   *       "name": "Registration",
   *       "url": "https://2016.asce-event.org/registration/",
   *       "hasPart": [
   *         { "@type": "WebPage", "name": "Why Attend" , "url": "https://2016.asce-event.org/registration/why-attend/" },
   *         { "@type": "WebPage", "name": "Volunteer"  , "url": "https://2016.asce-event.org/registration/volunteer/",
   *           "hasPart": { "@type": "WebPage", "name": "For Students", "url": "https://2016.asce-event.org/registration/volunteer/for-students/" }
   *         }
   *       ]
   *     },
   *     {
   *       "@type": "WebPage",
   *       "name": "Location",
   *       "url": "https://2016.asce-event.org/location/"
   *     },
   *     {
   *       "@type": "WebPage",
   *       "name": "Sponsor",
   *       "url": "https://2016.asce-event.org/sponsor/",
   *       "hasPart": [
   *         { "@type": "WebPage", "name": "Partnering Orgs"  , "url": "https://2016.asce-event.org/sponsor/partnering-orgs/"  },
   *         { "@type": "WebPage", "name": "Cooperating Orgs" , "url": "https://2016.asce-event.org/sponsor/cooperating-orgs/" }
   *       ]
   *     }
   *   ]
   * }
   * document.querySelector('header').append(
   *   ARIAPatterns.xDirectory.render(webpage)
   * )
   * @see xDirectory_renderer
   * @type {xjs.HTMLTemplateElement}
   */
  xDirectory: require('./tpl/x-directory.tpl.js'),
  /**
   * @summary A person’s name in "Px. First M. Last, Sx." format.
   * @description A series of inline elements, best nested inside an `[itemtype="Person"]` element.
   * @example
   * const ARIAPatterns = require('aria-patterns')
   * document.querySelector('div[itemtype="http://schema.org/Person"] > h1[itemprop="name"]').append(
   *   ARIAPatterns.xPersonFullname.render({
   *     "@type": "Person",
   *     "familyName"     : "King",
   *     "givenName"      : "Martin",
   *     "additionalName" : "Luther",
   *     "honorificPrefix": "Dr.",
   *     "honorificSuffix": "Jr."
   *   })
   * )
   * @see xPersonFullname_renderer
   * @type {xjs.HTMLTemplateElement}
   */
  xPersonFullname: require('./tpl/x-person-fullname.tpl.js'),
  /**
   * @summary An address in the format:
   * <pre>
   * 1600 Pennsylvania Avenue NW
   * Washington, DC 20006
   * </pre>
   * @description A `<span itemtype="PostalAddress">`, best with an `[itemprop]` of `address` or `location`,
   * inside an element of type Person, Place, Organization, Event, or Action.
   *
   * Note that this pattern does not use an `<address>` element,
   * as that is specifically reserved for contact information of the authoring person or organization of a website.
   * @example
   * const ARIAPatterns = require('aria-patterns')
   * document.querySelector('div[itemtype="http://schema.org/Organization"]').append(
   *   ARIAPatterns.xAddress.render({
   *     "@type": "PostalAddress",
   *     "streetAddress"  : "1600 Pennsylvania Avenue NW",
   *     "addressLocality": "Washington",
   *     "addressRegion"  : "DC",
   *     "postalCode"     : "20006",
   *     "$itemprop"      : "location",
   *     "$regionName"    : true,
   *   })
   * )
   * @see xAddress_renderer
   * @type {xjs.HTMLTemplateElement}
   */
  xAddress: require('./tpl/x-address.tpl.js'),
}

module.exports = ARIAPatterns
