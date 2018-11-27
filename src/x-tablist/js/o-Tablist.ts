interface SwitchFn<T> extends Function {
	(this: any, ...args: any[]): T;
	call(this_arg: any, ...args: any[]): T;
}
function xjs_Object_switch<T>(key: string, dictionary: { [index: string]: SwitchFn<T> }): SwitchFn<T> {
	let returned = dictionary[key]
	if (!returned) {
		console.warn(`Key '${key}' cannot be found. Using key 'default'…`)
		returned = dictionary['default']
		if (!returned) throw new ReferenceError(`No default key found.`)
	}
	return returned
}


/**
 * A possible orientation of a tablist.
 */
enum Orientation {
	HORIZONTAL,
	VERTICAL,
}


/**
 * A list of tab-panel pairs, wherein all tabs and at most one panel are exposed to the user.
 */
class CustomTablist {
	/**
	 * The element that this object controls.
	 */
	private readonly _NODE: HTMLElement;
	/**
	 * The set of tabs for this tablist.
	 */
	private readonly _TABS: CustomTab[];
	/**
	 * The set of panels for this tablist.
	 */
	private readonly _PANELS: CustomPanel[];

  /**
   * Construct a new CustomTablist object.
   * @param   node preferrably a `.o-Tablist[role="tablist"][aria-orientation]` element
   * @throws  {TypeError} if any child elements of the tablist are not `<details>` or script-supporting elements
   */
  constructor(node: HTMLElement) {
    this._NODE = node

    /**
     * Do the tabs occur after the panels in source?
     */
    const REVERSED: boolean = this._NODE.hasAttribute('data-reversed')

    // Check proper DOM structure
    ;[...this._NODE.children].forEach((child) => {
      if (!['DETAILS', 'SCRIPT', 'TEMPLATE'].includes(child.tagName)) {
        throw new TypeError('All children of the tablist must be `<details>` elements or script-supporting elements.');
      }
    })

    // Move the tabs (<summary>) outside of the panels (<details>), into the tablist.
    this._NODE.querySelectorAll('details[role="tabpanel"]').forEach((panel) => {
			let tab     : HTMLDivElement   = document.createElement('div')
			let summary : HTMLElement|null = panel.querySelector('summary')

      // transfer the attributes
			if (summary !== null) {
      ;[...summary.attributes].forEach((attr) => {
        summary !.attributes.removeNamedItem(attr.name)
        tab.attributes.setNamedItem(attr)
      })
			}

      // add new attributes
      tab.id = `tab-for-${panel.id}`
      tab  .setAttribute('aria-controls'  , panel.id)
      panel.setAttribute('aria-labelledby', tab.id  )

      // transfer the children
			// , then hide the summary
			if (summary !== null) {
      tab.append(...summary.childNodes)
      summary.hidden = true
			}

      if (REVERSED) panel.after(tab)
      else          panel.before(tab)
    })

		this._TABS   = [...this._NODE.querySelectorAll('div[role="tab"]'         )].map((el) => new CustomTab  (el as HTMLDivElement    , this))
		this._PANELS = [...this._NODE.querySelectorAll('details[role="tabpanel"]')].map((el) => new CustomPanel(el as HTMLDetailsElement, this))
  }

  /**
   * Get this tablist’s tabs.
   */
  get tabs(): CustomTab[] {
    return this._TABS
  }

  /**
   * Get this tablist’s panels.
   */
  get panels(): CustomPanel[] {
    return this._PANELS
  }

	/**
	 * Get the orientation of this tablist.
	 */
	get orientation(): Orientation {
		return xjs_Object_switch<Orientation>(this._NODE.getAttribute('aria-orientation') || 'default', {
			'horizontal': () => Orientation.HORIZONTAL,
			'vertical'  : () => Orientation.VERTICAL,
			'default'   : () => { throw new ReferenceError('No orientation was found for this tablist.') },
		})()
	}

	/**
	 * Set the orientation of this tablist.
	 * @param   dir the orientation to set
	 */
	set orientation(dir: Orientation) {
		this._NODE.setAttribute('aria-orientation', Orientation[dir].toLowerCase())
	}

  // /**
  //  * Get whether tabs occur after or before the panels.
  //  */
  // get reversed(): boolean {
  //   return this._reversed
  // }

  // /**
  //  * Set whether tabs occur after or before panels in source.
  //  * @param   rev should this tablist tab order be reversed?
  //  */
  // set reversed(rev: boolean) {
  //   this._reversed = rev
  // }

	/**
	 * Change the orientation of this tablist.
	 */
	flip(): void {
		this.orientation = xjs_Object_switch<Orientation>(`${this.orientation}`, {
			[Orientation.HORIZONTAL]: () => Orientation.VERTICAL,
			[Orientation.VERTICAL  ]: () => Orientation.HORIZONTAL,
			'default'               : () => Orientation.HORIZONTAL,
		})()
	}

  // /**
  //  * Change the orientation of this tablist.
  //  */
  // reverse(): void {
  //   this.reversed = !this.reversed
  // }

  /**
   * Update any children and shadow dom view of this element.
   *
   * This function should be called upon construction and every time the element’s attributes are changed.
   */
  updateRendering() {
    // If all panels are collapsed, select the first tab,
    // else select the tab of the initially open panel.
    if (this.panels.length) {
      let open_panel_index: number = this.panels.findIndex((panel) => panel.open)
      this.tabs[Math.max(0, open_panel_index)].select()
    }
  }
}

/**
 * A tab in a tab list.
 */
class CustomTab {
	/**
	 * The element that this object controls.
	 */
	private readonly _NODE: HTMLDivElement;
	/**
	 * The containing tablist of this tab.
	 */
	private readonly _PARENT: CustomTablist;

  /**
   * Construct a new CustomTab object.
   * @param   node preferrably a `.o-Tablist__Tab[role="tab"]` element
   * @param   parent the containing tablist object
   */
  constructor(node: HTMLDivElement, parent: CustomTablist) {
    this._NODE   = node
    this._PARENT = parent

    this._NODE.addEventListener('click', (_e) => {
      this.activate()
    })

    this._NODE.addEventListener('keydown', (e) => {
			function prev(this: CustomTab) {
			  e.preventDefault()
			  let prev_tab_index   : number = this._PARENT.tabs.indexOf(this) - 1
			  let select_tab_index : number = (prev_tab_index >= 0) ? prev_tab_index : this._PARENT.tabs.length - 1
			  this._PARENT.tabs[select_tab_index].activate()
			}
			function next(this: CustomTab) {
			  e.preventDefault()
			  let next_tab_index   : number = this._PARENT.tabs.indexOf(this) + 1
			  let select_tab_index : number = (next_tab_index < this._PARENT.tabs.length) ? next_tab_index : 0
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
				case 'ArrowLeft'  : if (this._PARENT.orientation === Orientation.HORIZONTAL) { prev.call(this) } break;
				case 'ArrowRight' : if (this._PARENT.orientation === Orientation.HORIZONTAL) { next.call(this) } break;
				case 'ArrowUp'    : if (this._PARENT.orientation === Orientation.VERTICAL  ) { prev.call(this) } break;
				case 'ArrowDown'  : if (this._PARENT.orientation === Orientation.VERTICAL  ) { next.call(this) } break;
      }
    })

      // **CLOSE BUTTONS**
      // if (this.querySelector('button[value="close"]')) {
      //   this.querySelector('button[value="close"]').addEventListener('click', (e) => {
      //     this._panel.remove()
      //     this.remove()
      //     tablist.updateRendering()
      //   })
      // }
  }

  /**
   * Select this tab.
   */
  select(): void {
    this._NODE.tabIndex = 0
    this.attributeChangedCallback('tabindex', null, '0')

    this._NODE.setAttribute('aria-selected', 'true')
    this.attributeChangedCallback('aria-selected', null, 'true')

    this._PARENT.panels[this._PARENT.tabs.indexOf(this)].expand()
  }

  /**
   * Select and focus this tab.
   */
  activate(): void {
    this.select()
    this._NODE.focus()
  }

  /**
   * @override HTMLElement#attributeChangedCallback
   * @param   name the local name of the attriute changed
   * @param   oldValue the attribute’s old value, or `null` if it had none
   * @param   newValue the new value to which to set the attribute, or `null` if it is removed
   */
  attributeChangedCallback(name: string, oldValue: string|null, newValue: string|null): void {
		xjs_Object_switch<void>(name, {
      'tabindex': (_oldValue: string|null, newValue: string|null) => {
        if (newValue === '0') {
          this._PARENT.tabs.forEach((tab) => {
            if (tab !== this) {
              tab._NODE.tabIndex = -1
              tab.attributeChangedCallback('tabindex', null, '-1')
            }
          })
        }
      },
      'aria-selected': (_oldValue: string|null, newValue: string|null) => {
        if (newValue === 'true') {
          this._PARENT.tabs.forEach((tab) => {
            if (tab !== this) {
              tab._NODE.setAttribute('aria-selected', 'false')
              tab.attributeChangedCallback('aria-selected', null, 'false')
            }
          })
        }
      },
      default() {},
		})(oldValue, newValue)
    this.updateRendering()
  }

  /**
   * Update any children and shadow dom view of this element.
   *
   * This function should be called upon construction and every time the element’s attributes are changed.
   */
  updateRendering() {
  }
}


/**
 * A panel in a tab list.
 */
class CustomPanel {
	/**
	 * The element that this object controls.
	 */
	private readonly _NODE: HTMLDetailsElement;
	/**
	 * The containing tablist of this panel.
	 */
	private readonly _PARENT: CustomTablist;

  /**
   * Construct a new CustomPanel object.
   * @param   node preferrably a `.o-Tablist__Panel[role="tabpanel"]` element
   * @param   parent the containing tablist object
   */
  constructor(node: HTMLDetailsElement, parent: CustomTablist) {
    this._NODE   = node
    this._PARENT = parent
  }

  /**
   * Is this panel open?
   * @returns does the panel have the `[open]` attribute?
   */
  get open(): boolean {
    return this._NODE.open
  }

  /**
   * Expand this panel.
   *
   * Should only be called when its corresponding tab is selected.
   */
  expand(): void {
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
  attributeChangedCallback(name: string, oldValue: string|null, newValue: string|null): void {
		xjs_Object_switch<void>(name, {
      'open': (_oldValue: string|null, newValue: string|null) => {
        if (newValue === '') {
          this._PARENT.panels.forEach((panel) => {
            if (panel !== this) {
              panel._NODE.open = false
              panel.attributeChangedCallback('open', null, null)
            }
          })
        }
      },
      'aria-hidden': (_oldValue: string|null, newValue: string|null) => {
        if (newValue === 'false') {
          this._PARENT.panels.forEach((panel) => {
            if (panel !== this) {
              panel._NODE.setAttribute('aria-hidden', 'true')
              panel.attributeChangedCallback('aria-hidden', null, 'true')
            }
          })
        }
      },
      default() {},
		})(oldValue, newValue)
    this.updateRendering()
  }

  /**
   * Update any children and shadow dom view of this element.
   *
   * This function should be called upon construction and every time the element’s attributes are changed.
   */
  updateRendering() {
  }
}


// **CLOSE BUTTONS**
// document.querySelector('#update > button').addEventListener('click', (e) => {
//   console.log(document.querySelector('[role="tablist"]').tabs())
//   document.querySelector('[role="tablist"]').panels()[0].open = false
// })


// run the program
document.querySelectorAll('.o-Tablist[role="tablist"]').forEach((tl) => {
	;(tl as any).tablist = new CustomTablist(tl as HTMLElement)
	;(tl as any).tablist.updateRendering()
})
