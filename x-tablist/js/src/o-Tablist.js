/**
 * A list of tab-panel pairs, wherein all tabs and at most one panel are exposed to the user.
 * @class CustomTablist
 */
document.querySelectorAll('.o-Tablist[role="tablist"]').forEach(function (tablist) {
  /**
   * Runs immediately.
   * @constructor
   */
  ;(function constructor() {
    const REVERSED = this.hasAttribute('data-reversed')
    /**
     * The set of panels.
     * @return {Array<HTMLDetailsElement>}
     */
    this.panels = function () { return Array.from(this.children).filter((el) => el.matches('[role="tabpanel"]')) }

    /**
     * Move the tabs (<summary>) outside of the panels (<details>), into the tablist.
     */
    this.panels().forEach(function (panel) {
      let tab = document.createElement('div')
      let summary = panel.querySelector('summary')

      // transfer the attributes
      Array.from(summary.attributes).forEach(function (attr) {
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
     * The set of tabs.
     * @return {Array<HTMLDivElement>}
     */
    this.tabs = function () { return Array.from(this.children).filter((el) => el.matches('[role="tab"]')) }
  }).call(tablist)


  /**
   * Update any children and shadow dom view of this element.
   */
  tablist.updateRendering = function () {
    // Expand the first panel if this tab list contains at least one panel and all its panels are collapsed.
    if (this.panels()[0] && !this.panels().find((el) => el.open)) {
      this.tabs()[0].select()
    }
  }



  /**
   * A tab in a tab list.
   * @inner
   * @class CustomTab
   */
  tablist.tabs().forEach(function (tab) {
    /**
     * Runs immediately.
     * @constructor
     */
    ;(function constructor() {
      /**
       * The panel that this tab controls.
       * @private
       * @type {CustomTabpanel}
       */
      this._panel = this.parentNode.querySelector(`#${this.getAttribute('aria-controls')}`)

      this.addEventListener('click', function (e) {
        this.select()
      })

      this.addEventListener('keydown', function (e) {
        /**
         * Key codes.
         * @enum {number}
         */
        const Keys = {
          SPACE: 32,
          END  : 35,
          HOME : 36,
          LEFT : 37,
          UP   : 38,
          RIGHT: 39,
          DOWN : 40,
        }
        function next() {
            e.preventDefault()
            let next_tab_index = this.parentNode.tabs().indexOf(this) + 1
            this.parentNode.tabs()[
              (next_tab_index < this.parentNode.tabs().length) ? next_tab_index : 0
            ].select()
        }
        function prev() {
            e.preventDefault()
            let prev_tab_index = this.parentNode.tabs().indexOf(this) - 1
            this.parentNode.tabs()[
              (prev_tab_index >= 0) ? prev_tab_index : this.parentNode.tabs().length - 1
            ].select()
        }
        switch (e.which) {
          case Keys.SPACE:
            e.preventDefault()
            this.select()
            break;
          case Keys.HOME:
            e.preventDefault()
            this.parentNode.tabs()[0].select()
            break;
          case Keys.END:
            e.preventDefault()
            this.parentNode.tabs()[this.parentNode.tabs().length - 1].select()
            break;
          case Keys.RIGHT : if (this.parentNode.getAttribute('aria-orientation') === 'horizontal') { next.call(this) } break;
          case Keys.LEFT  : if (this.parentNode.getAttribute('aria-orientation') === 'horizontal') { prev.call(this) } break;
          case Keys.DOWN  : if (this.parentNode.getAttribute('aria-orientation') === 'vertical'  ) { next.call(this) } break;
          case Keys.UP    : if (this.parentNode.getAttribute('aria-orientation') === 'vertical'  ) { prev.call(this) } break;
        }
      })

      // **CLOSE BUTTONS**
      // if (this.querySelector('button[value="close"]')) {
      //   this.querySelector('button[value="close"]').addEventListener('click', function (e) {
      //     this._panel.remove()
      //     this.remove()
      //     tablist.updateRendering()
      //   })
      // }
    }).call(tab)


    /**
     * The panel that this tab controls. Getter.
     * @type {CustomTabpanel}
     */
    tab.panel = function () {
      return this._panel
    }


    /**
     * Select this tab.
     */
    tab.select = function () {
      this.focus()
      this._panel.open = true
      this._panel.attributeChangedCallback('open', null, '')
      this.parentNode.updateRendering()
    }
  })



  /**
   * A panel in a tab list.
   * @inner
   * @class CustomTabpanel
   */
  tablist.panels().forEach(function (panel) {
    /**
     * Runs immediately.
     * @constructor
     */
    ;(function constructor() {
      /**
       * The tab that controls this panel.
       * @private
       * @type {CustomTab}
       */
      this._tab = this.parentNode.querySelector(`#${this.getAttribute('aria-labelledby')}`)
    }).call(panel)


    /**
     * Update any children and shadow dom view of this element.
     * @private
     */
    panel._updateRendering = function () {
      this.setAttribute('aria-hidden', !this.open) // fixes a BUG in which screen readers read collapsed `<details>` panels
      this._tab.tabIndex = this.open ? 0 : -1
      this._tab.setAttribute('aria-selected', this.open)
    }


    /**
     * @override HTMLElement#attributeChangedCallback
     * @param   {string} name the local name of the attriute changed
     * @param   {string} oldValue the attribute’s old value, or `null` if it had none
     * @param   {string} newValue the new value to which to set the attribute, or `null` if it is removed
     */
    panel.attributeChangedCallback = function (name, oldValue, newValue) {
      const returned = {
        'open': function (oldValue, newValue) {
          this._updateRendering()
          if (newValue === '') {
            // If setting the `open` attribute, collapse all panels not === to this one.
            this.parentNode.panels().forEach(function (p) {
              if (p !== this) {
                p.open = false // `HTMLDetailsElement#open` is a setter/getter
                p.attributeChangedCallback('open', null, null)
              }
            }, this)
          }
        },
        default(oldValue, newValue) {},
      }
      ;(returned[name] || returned.default).call(this, oldValue, newValue)
    }


    /**
     * The tab that controls this panel. Getter.
     * @type {CustomTab}
     */
    panel.tab = function () {
      return this._tab
    }
  })



  // initial rendering on load (would be in Tablist constructor, but depends on Tab and Panel instance methods)
  ;(function () {
    this.updateRendering()
    this.panels().find((el) => el.open).attributeChangedCallback('open', null, '')
  }).call(tablist)
})


// **CLOSE BUTTONS**
// document.querySelector('#update > button').addEventListener('click', function () {
//   console.log(document.querySelector('[role="tablist"]').tabs())
//   document.querySelector('[role="tablist"]').panels()[0].open = false
// })
