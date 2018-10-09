'use strict';var _createClass=function(){function a(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,'value'in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}();function _toConsumableArray(a){if(Array.isArray(a)){for(var b=0,c=Array(a.length);b<a.length;b++)c[b]=a[b];return c}return Array.from(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError('Cannot call a class as a function')}/**
 * A list of tab-panel pairs, wherein all tabs and at most one panel are exposed to the user.
 */var CustomTablist=function(){/**
   * @summary Construct a new CustomTablist object.
   * @param   {HTMLElement} node preferrably a `.o-Tablist[role="tablist"][aria-orientation]` element
   * @throws  {TypeError} if any child elements of the tablist are not `<details>` or script-supporting elements
   */function a(b){var c=this;_classCallCheck(this,a),this._NODE=b;/**
     * @summary Do the tabs occur after the panels in source?
     * @private
     * @final
     * @type {boolean}
     */var d=this._NODE.hasAttribute('data-reversed')// Check proper DOM structure
;[].concat(_toConsumableArray(this._NODE.children)).forEach(function(a){if(!['DETAILS','SCRIPT','TEMPLATE'].includes(a.tagName))throw new TypeError('All children of the tablist must be `<details>` elements or script-supporting elements.')}),this._NODE.querySelectorAll('details[role="tabpanel"]').forEach(function(a){var b=document.createElement('div'),c=a.querySelector('summary')// transfer the attributes
;[].concat(_toConsumableArray(c.attributes)).forEach(function(a){c.attributes.removeNamedItem(a.name),b.attributes.setNamedItem(a)}),b.id='tab-for-'+a.id,b.setAttribute('aria-controls',a.id),a.setAttribute('aria-labelledby',b.id),b.append.apply(b,_toConsumableArray(c.childNodes)),c.hidden=!0,d?a.after(b):a.before(b)},this),this._TABS=[].concat(_toConsumableArray(this._NODE.querySelectorAll('div[role="tab"]'))).map(function(b){return new a.CustomTab(b,c)}),this._PANELS=[].concat(_toConsumableArray(this._NODE.querySelectorAll('details[role="tabpanel"]'))).map(function(b){return new a.CustomPanel(b,c)})}/**
   * @summary The set of tabs.
   * @type {Array<CustomTablist.CustomPanel>}
   */return _createClass(a,[{key:'flip',// /**
//  * @summary Whether tabs occur after or before the panels.
//  * @type {boolean}
//  */
// get reversed() {
//   return this._reversed
// }
// /**
//  * @summary Set whether tabs occur after or before panels in source.
//  * @param {boolean} rev should this tablist tab order be reversed?
//  */
// set reversed(rev) {
//   this._reversed = rev
// }
/**
   * @summary Change the orientation of this tablist.
   */value:function b(){var a={horizontal:'vertical',vertical:'horizontal',default:'horizontal'};this.orientation=a[this.orientation]||a.default}// /**
//  * @summary Change the orientation of this tablist.
//  */
// reverse() {
//   this.reversed = !this.reversed
// }
/**
   * @summary Update any children and shadow dom view of this element.
   * @description This function should be called upon construction and every time the element’s attributes are changed.
   */},{key:'updateRendering',value:function b(){var a=Math.max;// If all panels are collapsed, select the first tab,
// else select the tab of the initially open panel.
if(this.panels.length){var c=this.panels.findIndex(function(a){return a.open});this.tabs[a(0,c)].select()}}},{key:'tabs',get:function a(){return this._TABS}/**
   * @summary The set of panels.
   * @type {Array<CustomTablist.CustomTab>}
   */},{key:'panels',get:function a(){return this._PANELS}/**
   * @summary The orientation, horizontal or vertical, of this tablist.
   * @type {string}
   */},{key:'orientation',get:function a(){return this._NODE.getAttribute('aria-orientation')}/**
   * @summary Set the orientation of this tablist.
   * @param {string=} dir either `'horizontal'` or `'vertical'`
   */,set:function b(a){if(!['horizontal','vertical'].includes(a))throw new RangeError('Orientation must be `horizontal` or `vertical`.');this._NODE.setAttribute('aria-orientation',a)}}]),a}();/**
 * A tab in a tab list.
 * @inner
 *//**
 * A panel in a tab list.
 * @inner
 */// **CLOSE BUTTONS**
// document.querySelector('#update > button').addEventListener('click', function () {
//   console.log(document.querySelector('[role="tablist"]').tabs())
//   document.querySelector('[role="tablist"]').panels()[0].open = false
// })
CustomTablist.CustomTab=function(){/**
   * @summary Construct a new CustomTab object.
   * @param {HTMLElement} node preferrably a `.o-Tablist__Tab[role="tab"]` element
   * @param {CustomTablist} parent the containing tablist object
   */function a(b,c){_classCallCheck(this,a),this._NODE=b,this._PARENT=c,this._NODE.addEventListener('click',function(){this.activate()}.bind(this)),this._NODE.addEventListener('keydown',function(a){function b(){a.preventDefault();var b=this._PARENT.tabs.indexOf(this)-1,c=0<=b?b:this._PARENT.tabs.length-1;this._PARENT.tabs[c].activate()}function c(){a.preventDefault();var b=this._PARENT.tabs.indexOf(this)+1,c=b<this._PARENT.tabs.length?b:0;this._PARENT.tabs[c].activate()}switch(a.code){case'Space':a.preventDefault(),this.activate();break;case'Home':a.preventDefault(),this._PARENT.tabs[0].activate();break;case'End':a.preventDefault(),this._PARENT.tabs[this._PARENT.tabs.length-1].activate();break;case'ArrowLeft':'horizontal'===this._PARENT.orientation&&b.call(this);break;case'ArrowRight':'horizontal'===this._PARENT.orientation&&c.call(this);break;case'ArrowUp':'vertical'===this._PARENT.orientation&&b.call(this);break;case'ArrowDown':'vertical'===this._PARENT.orientation&&c.call(this);}}.bind(this))}/**
   * @summary Select this tab.
   */return _createClass(a,[{key:'select',value:function a(){this._NODE.tabIndex=0,this.attributeChangedCallback('tabindex',null,'0'),this._NODE.setAttribute('aria-selected','true'),this.attributeChangedCallback('aria-selected',null,'true'),this._PARENT.panels[this._PARENT.tabs.indexOf(this)].expand()}/**
   * @summary Select and focus this tab.
   */},{key:'activate',value:function a(){this.select(),this._NODE.focus()}/**
   * @override HTMLElement#attributeChangedCallback
   * @param   {string} name the local name of the attriute changed
   * @param   {string} oldValue the attribute’s old value, or `null` if it had none
   * @param   {string} newValue the new value to which to set the attribute, or `null` if it is removed
   */},{key:'attributeChangedCallback',value:function e(a,b,c){var d={tabindex:function c(a,b){'0'===b&&this._PARENT.tabs.forEach(function(a){a!==this&&(a._NODE.tabIndex=-1,a.attributeChangedCallback('tabindex',null,'-1'))},this)},"aria-selected":function c(a,b){'true'===b&&this._PARENT.tabs.forEach(function(a){a!==this&&(a._NODE.setAttribute('aria-selected','false'),a.attributeChangedCallback('aria-selected',null,'false'))},this)},default:function a(){}};(d[a]||d.default).call(this,b,c),this.updateRendering()}/**
   * @summary Update any children and shadow dom view of this element.
   * @description This function should be called upon construction and every time the element’s attributes are changed.
   */},{key:'updateRendering',value:function a(){}}]),a}(),CustomTablist.CustomPanel=function(){/**
   * @summary Construct a new CustomPanel object.
   * @param {HTMLElement} node preferrably a `.o-Tablist__Panel[role="tabpanel"]` element
   * @param {CustomTablist} parent the containing tablist object
   */function a(b,c){_classCallCheck(this,a),this._NODE=b,this._PARENT=c}/**
   * @summary Is this panel open?
   * @returns {boolean} does the panel have the `[open]` attribute?
   */return _createClass(a,[{key:'expand',/**
   * @summary Expand this panel.
   * @description Should only be called when its corresponding tab is selected.
   */value:function a(){this._NODE.open=!0,this.attributeChangedCallback('open',null,''),this._NODE.setAttribute('aria-hidden','false'),this.attributeChangedCallback('aria-hidden',null,'false')}/**
   * @override HTMLElement#attributeChangedCallback
   * @param   {string} name the local name of the attriute changed
   * @param   {string} oldValue the attribute’s old value, or `null` if it had none
   * @param   {string} newValue the new value to which to set the attribute, or `null` if it is removed
   */},{key:'attributeChangedCallback',value:function e(a,b,c){var d={open:function c(a,b){''===b&&this._PARENT.panels.forEach(function(a){a!==this&&(a._NODE.open=!1,a.attributeChangedCallback('open',null,null))},this)},"aria-hidden":function c(a,b){'false'===b&&this._PARENT.panels.forEach(function(a){a!==this&&(a._NODE.setAttribute('aria-hidden','true'),a.attributeChangedCallback('aria-hidden',null,'true'))},this)},default:function a(){}};(d[a]||d.default).call(this,b,c),this.updateRendering()}/**
   * @summary Update any children and shadow dom view of this element.
   * @description This function should be called upon construction and every time the element’s attributes are changed.
   */},{key:'updateRendering',value:function a(){}},{key:'open',get:function a(){return this._NODE.open}}]),a}(),document.querySelectorAll('.o-Tablist[role="tablist"]').forEach(function(a){a.tablist=new CustomTablist(a),a.tablist.updateRendering()});
//# sourceMappingURL=o-Tablist.js.map
