dmx.Component("select2", {
  extends: "select",
  initialData: {
    selectedIndex: -1,
    selectedValue: "",
    selectedText: "",
    selectedOptions: []
  },
  attributes: {
    options: { type: [Array, Object, Number], default: null },
    optionText: { type: String, default: "$value" },
    optionValue: { type: String, default: "$value" },
    field_theme: { type: String, default: "bootstrap-5" },
    field_width: { type: String, default: "resolve" },
    field_placeholder: { type: String, default: "Select a Option." },
    allow_clear: { type: Boolean, default: false },
    enable_rtl: { type: Boolean, default: false },
    enable_tags: { type: Boolean, default: false },
    select_on_close: { type: Boolean, default: false },
    close_on_select: { type: Boolean, default: true },
    css_class: { type: String, default: "select2--large" },
    selection_css: { type: String, default: null },
    dropdown_css: { type: String, default: null },
    container_css: { type: String, default: null },
    multiple: { type: Boolean, default: false },
    minimum_results_for_search: { type: Number, default: 0 }
  },
  methods: {
    setSelectedIndex: function (t) {
      (this.$node.selectedIndex = t),
        this._updateValue()
    },
    updatedSelectedData: function () {
      this._updateValue()
    },
    setValue: function (t, e) {
      if (this.$node.multiple) {
        dmx.nextTick(function () {
          if (!t) return
          const selectedValues = Array.isArray(t) ? t : t.split(',');
          this.set('selectedOptions', selectedValues)
          $("#" + this.$node.id).val(selectedValues).trigger('change');
          this._updateValue();
        }, this);

      }
      else {
        dmx.nextTick(function () {
          $("#" + this.$node.id).val(t).trigger('change');
          this._updateValue();
        }, this);
      }
    },
    reset: function () {
      this.set('selectedOptions', [])
      $("#" + this.$node.id).val(null).trigger("select2:close");
    }
  },
  events: {
    selected: Event,
    opened: Event,
    closed: Event,
    changed: Event
  },
  renderSelect: function () {
    let dropdown_parent = null;
    // Check if the parent of the element is a modal
    if (!this.$node) return
    if ($("#" + this.$node.id).closest(".modal").length > 0) {
      dropdown_parent = $(this.$node).parent().parent();
    }
    const selectionClass = `${this.props.css_class} ${this.props.selection_css}`.trim();
    const dropdownClass = `${this.props.css_class} ${this.props.dropdown_css}`.trim();
    const containerClass = `${this.props.css_class} ${this.props.container_css}`.trim();

    $("#" + this.$node.id).select2({
      theme: this.props.field_theme,
      width: this.props.field_width,
      tags: this.props.enable_tags,
      dir: (this.props.enable_rtl ? "rtl" : "ltr"),
      allowClear: this.props.allow_clear,
      selectOnClose: this.props.select_on_close,
      closeOnSelect: this.props.close_on_select,
      placeholder: this.props.field_placeholder,
      dropdownParent: dropdown_parent,
      selectionCssClass: selectionClass,
      dropdownCssClass: dropdownClass,
      containerCssClass: containerClass,
      multiple: this.props.multiple,
      minimumResultsForSearch: this.props.minimum_results_for_search
    });
    (this.props.field_placeholder && this.props.value == "")
      ? $("#" + this.$node.id).val('').trigger('change') : null
  },
  init: function (e) {
    if (!this.$node) return
    this._options = [], this.props.value || (this.props.value = this.$node.value, this._updateValue()), this._mutationObserver = new MutationObserver((() => {
      this._updatingOptions || this._updateValue()
    })), this._mutationObserver.observe(this.$node, {
      subtree: !0,
      childList: !0,
      attributes: !0
    }), dmx.Component("form-element").prototype.init.call(this, e)

    // Add event listener for browser back button
    window.addEventListener('popstate', (event) => {
      if (this.$node && this.$node.id) {
        const select2Instance = $("#" + this.$node.id).data('select2');
        if (select2Instance && select2Instance.isOpen()) {
          $("#" + this.$node.id).select2('close');
        }
      }
    });

    //Below is select2 events
    $(this.$node).on('select2:close', (e) => {
      dmx.nextTick(function () {
        this.dispatchEvent('closed');
      }, this);
    });
    $(this.$node).on('select2:open', (e) => {
      dmx.nextTick(function () {
        this.dispatchEvent('opened');
      }, this);
    });
    $(this.$node).on('select2:select', (e) => {
      this._updateValue();
      dmx.nextTick(function () {
        this.dispatchEvent('selected');
      }, this);
    });
    $(this.$node).on('select2:unselect', (e) => {
      // Remove empty values from selection
      this.initialData.selectedOptions = this.initialData.selectedOptions.filter(n => n != e.params.data.id);
      this._updateValue();
    });

    // Auto-focus search input when dropdown opens for keyboard accessibility
    $(this.$node).on('select2:open', () => {
      // Use setTimeout to ensure the dropdown is fully rendered
      setTimeout(() => {
        const searchField = document.querySelector('.select2-container--open .select2-search__field');
        if (searchField) {
          searchField.focus();
        }
      }, 0);
    });

    // Setup keyboard navigation on the Select2 container
    this._setupKeyboardNavigation();

    dmx.nextTick(function () {
      this.renderSelect();
      if (!this.$node) return
      if ($("#" + this.$node.id).closest(".modal").length > 0) {
        let modalID = $("#" + this.$node.id).closest(".modal").attr("id");
        $("#" + modalID).on("shown.bs.modal", () => {
          if (this.$node.multiple) {
            let selectedData = Array.from(this.$node.selectedOptions)
              .filter(option => option.value !== "")
              .map(option => option.value);
            $("#" + this.$node.id).val(selectedData.length === 0 ? this.props.value : selectedData).trigger("change");
          } else {
            $("#" + this.$node.id).val(this.get("selectedValue")).trigger('change');
          }
        });
      }
    }, this);
    this._updateValue();
    this.$watch('selectedValue', value => {
      if (value !== null && value !== "" && this.$node) {
        $("#" + this.$node.id).val(value).trigger("change")
        this.dispatchEvent('changed');
        this.dispatchEvent('updated');
      }
    })
  },
  _renderOptions() {
    this._options.forEach((e => e.remove())),
      this._options = [],
      this.props.options && (this._updatingOptions = !0,
        dmx.repeatItems(this.props.options).forEach((e => {
          const t = document.createElement("option");
          t.value = dmx.parse(this.props.optionvalue, dmx.DataScope(e, this)),
            t.textContent = dmx.parse(this.props.optiontext, dmx.DataScope(e, this)),
            t.value == this.props.value && (t.selected = !0),
            this.$node.append(t),
            this._options.push(t)
        })), this._updatingOptions = !1),
      this._updateValue()
  },

  _setValue(e, t) {
    if (this.$node.multiple) {
      e = Array.isArray(e)
        ? e
        : (e || "").split(",");
      e = e.filter(n => n)
      null == e && (e = ""), Array.isArray(e) || (e = [e]), e = e.map((e => e.toString())), Array.from(this.$node.options).forEach((s => {
        const n = e.includes(s.value);
        t ? (s.toggleAttribute("selected", n), s.defaultSelected = s.selected) : s.selected = n
      })), this._updateValue(), dmx.nextTick((() => this.dispatchEvent("updated")))
    } else {
      if (null == e && (e = ""), e = e.toString(), t) Array.from(this.$node.options).forEach((t => {
        t.toggleAttribute("selected", t.value == e), t.defaultSelected = t.selected
      }));
      else {
        const t = Array.from(this.$node.options).findIndex((t => t.value == e));
        this.$node.selectedIndex = t
      }
      this._updateValue(), dmx.nextTick((() => this.dispatchEvent("updated")))
    }
  },
  _updateValue() {
    if (this.$node.multiple) {
      let selectedValues = $(this.$node).val();
      // Normalize to array and filter empty values
      this.set('selectedOptions', Array.isArray(selectedValues) ? selectedValues.filter(Boolean) : [selectedValues].filter(Boolean));
      let e = this._getValue();
      e = e.filter(n => n);
      if (this.$node && this.$node.id) {
        $("#" + this.$node.id).val(e).trigger("change");
      }
    } else {
      const e = this.$node.selectedIndex,
        t = this.$node.options[e] || {
          value: "",
          text: ""
        };

      this.set({
        selectedIndex: e,
        selectedValue: t.value,
        selectedText: t.text,
        value: t.value
      })
    }
  },
  _getValue() {
    return Array.from(this.$node.selectedOptions).map((e => e.value))
  },

  performUpdate(e) {
    if (this.$node.multiple) {
      dmx.Component("select").prototype.performUpdate.call(this, e), e.has("value") && this._setValue(this.props.value, !0)
    } else {

      // Call the base performUpdate method
      dmx.Component("form-element").prototype.performUpdate.call(this, e);

      // Re-render options if relevant properties have changed
      if (e.has("options") || e.has("optiontext") || e.has("optionvalue")) {
        dmx.nextTick(this._renderOptions, this);
      }
    }

    // Refresh select UI and update data
    this.renderSelect();
    this._updateValue();
  },
  _inputHandler(e) { },
  _changeHandler(e) {

    if (!this.$node) return
    if (this.$node.dirty) {
      this._validate();
    }
    if (this.$node.multiple) {
      dmx.nextTick((() => {
        if (!this.$node) return
        this.data.selectedIndex === this.$node.selectedIndex && dmx.equal(this.data.value, this._getValue()) || (this._updateValue(), this.dispatchEvent("changed"), dmx.nextTick((() => this.dispatchEvent("updated"))))
      }))
    } else {
      dmx.nextTick((() => {
        if (!this.$node) return
        this.data.selectedIndex !== this.$node.selectedIndex && (this._updateValue(), this.dispatchEvent("changed"), dmx.nextTick((() => this.dispatchEvent("updated"))))
      }))
    }
  },

  // Keyboard navigation setup for accessibility
  _setupKeyboardNavigation: function() {
    const self = this;

    // Wait for Select2 to be initialized, then setup keyboard handlers
    dmx.nextTick(function() {
      if (!self.$node || !self.$node.id) return;

      const $select2 = $("#" + self.$node.id);
      const select2Instance = $select2.data('select2');

      if (!select2Instance) {
        // Retry after a short delay if Select2 isn't ready yet
        setTimeout(() => self._setupKeyboardNavigation(), 100);
        return;
      }

      const $container = select2Instance.$container;
      if (!$container || !$container.length) return;

      // Ensure the selection container is focusable via Tab
      const $selection = $container.find('.select2-selection');
      if ($selection.length && !$selection.attr('tabindex')) {
        $selection.attr('tabindex', '0');
      }

      // Handle keydown events on the selection for keyboard navigation
      $selection.off('keydown.select2keyboard').on('keydown.select2keyboard', function(evt) {
        const isOpen = select2Instance.isOpen();
        const key = evt.which || evt.keyCode;

        // Key codes
        const KEYS = {
          TAB: 9,
          ENTER: 13,
          ESC: 27,
          SPACE: 32,
          UP: 38,
          DOWN: 40
        };

        // If dropdown is closed, handle keyboard to open it
        if (!isOpen) {
          switch (key) {
            case KEYS.ENTER:
            case KEYS.SPACE:
            case KEYS.DOWN:
            case KEYS.UP:
              // Open dropdown on Enter, Space, or Arrow keys
              evt.preventDefault();
              evt.stopPropagation();
              $select2.select2('open');
              return false;

            case KEYS.TAB:
              // Allow Tab to move to next element (default behavior)
              return true;

            case KEYS.ESC:
              // Do nothing if already closed
              return true;

            default:
              // For printable characters, open dropdown and type into search
              if (self._isPrintableKey(key, evt)) {
                evt.preventDefault();
                evt.stopPropagation();
                $select2.select2('open');

                // Forward the character to the search field
                setTimeout(function() {
                  const searchField = document.querySelector('.select2-container--open .select2-search__field');
                  if (searchField) {
                    searchField.focus();
                    // Simulate the keystroke in the search field
                    const char = self._getCharFromKeyCode(key, evt);
                    if (char) {
                      searchField.value = char;
                      // Trigger input event to start filtering
                      const inputEvent = new Event('input', { bubbles: true, cancelable: true });
                      searchField.dispatchEvent(inputEvent);
                    }
                  }
                }, 0);
                return false;
              }
              break;
          }
        }
      });
    }, this);
  },

  // Check if the key pressed is a printable character
  _isPrintableKey: function(keyCode, evt) {
    // Skip if modifier keys are pressed (except shift for uppercase)
    if (evt.ctrlKey || evt.altKey || evt.metaKey) {
      return false;
    }

    // Alphanumeric keys (A-Z, 0-9)
    if ((keyCode >= 65 && keyCode <= 90) || (keyCode >= 48 && keyCode <= 57)) {
      return true;
    }

    // Numpad numbers
    if (keyCode >= 96 && keyCode <= 105) {
      return true;
    }

    return false;
  },

  // Convert keyCode to character
  _getCharFromKeyCode: function(keyCode, evt) {
    // A-Z
    if (keyCode >= 65 && keyCode <= 90) {
      const char = String.fromCharCode(keyCode);
      return evt.shiftKey ? char : char.toLowerCase();
    }

    // 0-9
    if (keyCode >= 48 && keyCode <= 57) {
      return String.fromCharCode(keyCode);
    }

    // Numpad 0-9
    if (keyCode >= 96 && keyCode <= 105) {
      return String.fromCharCode(keyCode - 48);
    }

    return null;
  }
});

//Created and Maintained by Roney Dsilva v0.6.3