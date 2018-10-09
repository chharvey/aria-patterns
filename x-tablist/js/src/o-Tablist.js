/**
 * A list of tab-panel pairs, wherein all tabs and at most one panel are exposed to the user.
 */
class CustomTablist {
  /**
   * @summary Construct a new CustomTablist object.
   * @param   {HTMLElement} node preferrably a `.o-Tablist[role="tablist"][aria-orientation]` element
   * @throws  {TypeError} if any child elements of the tablist are not `<details>` or script-supporting elements
   */
  constructor(node) {
    /**
     * @summary The element that this object controls.
     * @private
     * @final
     * @type {HTMLElement}
     */
    this._NODE = node

    /**
     * @summary Do the tabs occur after the panels in source?
     * @private
     * @final
     * @type {boolean}
     */
    const REVERSED = this._NODE.hasAttribute('data-reversed')

    // Check proper DOM structure
    ;[...this._NODE.children].forEach(function (child) {
      if (!['DETAILS', 'SCRIPT', 'TEMPLATE'].includes(child.tagName)) {
        throw new TypeError('All children of the tablist must be `<details>` elements or script-supporting elements.');
      }
    })

    // Move the tabs (<summary>) outside of the panels (<details>), into the tablist.
    this._NODE.querySelectorAll('details[role="tabpanel"]').forEach(function (panel) {
      let tab = document.createElement('div')
      let summary = panel.querySelector('summary')

      // transfer the attributes
      ;[...summary.attributes].forEach(function (attr) {
        summary.attributes.removeNamedItem(attr.name)
        tab.attributes.setNamedItem(attr)
      })

      // add new attributes
      tab.id = `tab-for-${panel.id}`
      tab.setAttribute('aria-controls', panel.id)
      panel.setAttribute('aria-labelledby', tab.id)

      // transfer the children
      tab.append(...summary.childNodes)

      summary.hidden = true

      if (REVERSED) panel.after(tab)
      else panel.before(tab)
    }, this)

    /**
     * @summary The set of tabs.
     * @private
     * @final
     * @type {Array<CustomTablist.CustomTab>}
     */
    this._TABS = [...this._NODE.querySelectorAll('div[role="tab"]')].map((el) => new CustomTablist.CustomTab(el, this))
    /**
     * @summary The set of panels.
     * @private
     * @final
     * @type {Array<CustomTablist.CustomPanel>}
     */
    this._PANELS = [...this._NODE.querySelectorAll('details[role="tabpanel"]')].map((el) => new CustomTablist.CustomPanel(el, this))
  }

  /**
   * @summary The set of tabs.
   * @type {Array<CustomTablist.CustomPanel>}
   */
  get tabs() {
    return this._TABS
  }

  /**
   * @summary The set of panels.
   * @type {Array<CustomTablist.CustomTab>}
   */
  get panels() {
    return this._PANELS
  }

  /**
   * @summary The orientation, horizontal or vertical, of this tablist.
   * @type {string}
   */
  get orientation() {
    return this._NODE.getAttribute('aria-orientation')
  }

  /**
   * @summary Set the orientation of this tablist.
   * @param {string=} dir either `'horizontal'` or `'vertical'`
   */
  set orientation(dir) {
    if (!['horizontal', 'vertical'].includes(dir)) {
      throw new RangeError('Orientation must be `horizontal` or `vertical`.')
    }
    this._NODE.setAttribute('aria-orientation', dir)
  }

  // /**
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
   */
  flip() {
    let map = {
      horizontal: 'vertical',
      vertical: 'horizontal',
      default : 'horizontal',
    }
    this.orientation = map[this.orientation] || map.default
  }

  // /**
  //  * @summary Change the orientation of this tablist.
  //  */
  // reverse() {
  //   this.reversed = !this.reversed
  // }

  /**
   * @summary Update any children and shadow dom view of this element.
   * @description This function should be called upon construction and every time the element’s attributes are changed.
   */
  updateRendering() {
    // If all panels are collapsed, select the first tab,
    // else select the tab of the initially open panel.
    if (this.panels.length) {
      let open_panel_index = this.panels.findIndex((panel) => panel.open)
      this.tabs[Math.max(0, open_panel_index)].select()
    }
  }
}

/**
 * A tab in a tab list.
 * @inner
 */
CustomTablist.CustomTab = class CustomTab {
  /**
   * @summary Construct a new CustomTab object.
   * @param {HTMLElement} node preferrably a `.o-Tablist__Tab[role="tab"]` element
   * @param {CustomTablist} parent the containing tablist object
   */
  constructor(node, parent) {
    /**
     * @summary The element that this object controls.
     * @private
     * @final
     * @type {HTMLElement}
     */
    this._NODE = node

    /**
     * @summary The containing tablist of this tab.
     * @private
     * @final
     * @type {CustomTablist}
     */
    this._PARENT = parent

    this._NODE.addEventListener('click', (function (e) {
      this.activate()
    }).bind(this))

    this._NODE.addEventListener('keydown', (function (e) {
      function prev() {
        e.preventDefault()
        let prev_tab_index = this._PARENT.tabs.indexOf(this) - 1
        let select_tab_index = (prev_tab_index >= 0) ? prev_tab_index : this._PARENT.tabs.length - 1
        this._PARENT.tabs[select_tab_index].activate()
      }
      function next() {
        e.preventDefault()
        let next_tab_index = this._PARENT.tabs.indexOf(this) + 1
        let select_tab_index = (next_tab_index < this._PARENT.tabs.length) ? next_tab_index : 0
        this._PARENT.tabs[select_tab_index].activate()
      }
      switch (e.code) {
        case 'Space':
          e.preventDefault()
          this.activate()
          break;
        case 'Home':
          e.preventDefault()
          this._PARENT.tabs[0].activate()
          break;
        case 'End':
          e.preventDefault()
          this._PARENT.tabs[this._PARENT.tabs.length - 1].activate()
          break;
        case 'ArrowLeft'  : if (this._PARENT.orientation === 'horizontal') { prev.call(this) } break;
        case 'ArrowRight' : if (this._PARENT.orientation === 'horizontal') { next.call(this) } break;
        case 'ArrowUp'    : if (this._PARENT.orientation === 'vertical'  ) { prev.call(this) } break;
        case 'ArrowDown'  : if (this._PARENT.orientation === 'vertical'  ) { next.call(this) } break;
      }
    }).bind(this))

      // **CLOSE BUTTONS**
      // if (this.querySelector('button[value="close"]')) {
      //   this.querySelector('button[value="close"]').addEventListener('click', function (e) {
      //     this._panel.remove()
      //     this.remove()
      //     tablist.updateRendering()
      //   })
      // }
  }

  /**
   * @summary Select this tab.
   */
  select() {
    this._NODE.tabIndex = 0
    this.attributeChangedCallback('tabindex', null, '0')

    this._NODE.setAttribute('aria-selected', 'true')
    this.attributeChangedCallback('aria-selected', null, 'true')

    this._PARENT.panels[this._PARENT.tabs.indexOf(this)].expand()
  }

  /**
   * @summary Select and focus this tab.
   */
  activate() {
    this.select()
    this._NODE.focus()
  }

  /**
   * @override HTMLElement#attributeChangedCallback
   * @param   {string} name the local name of the attriute changed
   * @param   {string} oldValue the attribute’s old value, or `null` if it had none
   * @param   {string} newValue the new value to which to set the attribute, or `null` if it is removed
   */
  attributeChangedCallback(name, oldValue, newValue) {
    const returned = {
      'tabindex': function (oldValue, newValue) {
        if (newValue === '0') {
          this._PARENT.tabs.forEach(function (tab) {
            if (tab !== this) {
              tab._NODE.tabIndex = -1
              tab.attributeChangedCallback('tabindex', null, '-1')
            }
          }, this)
        }
      },
      'aria-selected': function (oldValue, newValue) {
        if (newValue === 'true') {
          this._PARENT.tabs.forEach(function (tab) {
            if (tab !== this) {
              tab._NODE.setAttribute('aria-selected', 'false')
              tab.attributeChangedCallback('aria-selected', null, 'false')
            }
          }, this)
        }
      },
      default(oldValue, newValue) {},
    }
    ;(returned[name] || returned.default).call(this, oldValue, newValue)
    this.updateRendering()
  }

  /**
   * @summary Update any children and shadow dom view of this element.
   * @description This function should be called upon construction and every time the element’s attributes are changed.
   */
  updateRendering() {
  }
}


/**
 * A panel in a tab list.
 * @inner
 */
CustomTablist.CustomPanel = class CustomPanel {
  /**
   * @summary Construct a new CustomPanel object.
   * @param {HTMLElement} node preferrably a `.o-Tablist__Panel[role="tabpanel"]` element
   * @param {CustomTablist} parent the containing tablist object
   */
  constructor(node, parent) {
    /**
     * @summary The element that this object controls.
     * @private
     * @final
     * @type {HTMLElement}
     */
    this._NODE = node

    /**
     * @summary The containing tablist of this tab.
     * @private
     * @final
     * @type {CustomTablist}
     */
    this._PARENT = parent
  }

  /**
   * @summary Is this panel open?
   * @returns {boolean} does the panel have the `[open]` attribute?
   */
  get open() {
    return this._NODE.open
  }

  /**
   * @summary Expand this panel.
   * @description Should only be called when its corresponding tab is selected.
   */
  expand() {
    this._NODE.open = true
    this.attributeChangedCallback('open', null, '')

    this._NODE.setAttribute('aria-hidden', 'false') // fixes a BUG in which screen readers read collapsed `<details>` panels
    this.attributeChangedCallback('aria-hidden', null, 'false')
  }

  /**
   * @override HTMLElement#attributeChangedCallback
   * @param   {string} name the local name of the attriute changed
   * @param   {string} oldValue the attribute’s old value, or `null` if it had none
   * @param   {string} newValue the new value to which to set the attribute, or `null` if it is removed
   */
  attributeChangedCallback(name, oldValue, newValue) {
    const returned = {
      'open': function (oldValue, newValue) {
        if (newValue === '') {
          this._PARENT.panels.forEach(function (panel) {
            if (panel !== this) {
              panel._NODE.open = false
              panel.attributeChangedCallback('open', null, null)
            }
          }, this)
        }
      },
      'aria-hidden': function (oldValue, newValue) {
        if (newValue === 'false') {
          this._PARENT.panels.forEach(function (panel) {
            if (panel !== this) {
              panel._NODE.setAttribute('aria-hidden', 'true')
              panel.attributeChangedCallback('aria-hidden', null, 'true')
            }
          }, this)
        }
      },
      default(oldValue, newValue) {},
    }
    ;(returned[name] || returned.default).call(this, oldValue, newValue)
    this.updateRendering()
  }

  /**
   * @summary Update any children and shadow dom view of this element.
   * @description This function should be called upon construction and every time the element’s attributes are changed.
   */
  updateRendering() {
  }
}


// **CLOSE BUTTONS**
// document.querySelector('#update > button').addEventListener('click', function () {
//   console.log(document.querySelector('[role="tablist"]').tabs())
//   document.querySelector('[role="tablist"]').panels()[0].open = false
// })

document.querySelectorAll('.o-Tablist[role="tablist"]').forEach(function (tl) {
  tl.tablist = new CustomTablist(tl)
  tl.tablist.updateRendering()
})
