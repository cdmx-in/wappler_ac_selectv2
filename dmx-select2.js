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
    multiple: { type: Boolean, default: false }
  },
  methods: {
    setSelectedIndex: function (t) {
      (this.$node.selectedIndex = t),
      this.updateData()
    },
    updatedSelectedData: function () {
      this.updateData()
    },
    setValue: function (t, e) {
      if (this.$node.multiple) {
        dmx.nextTick(function () {
          if (!t) return
          const selectedValues = Array.isArray(t) ? t : t.split(',');
          this.set('selectedOptions', selectedValues)
          $("#" + this.$node.id).val(selectedValues).trigger('change');
          this.updateData();
        }, this);

      } 
      else {
        dmx.nextTick(function () {
          $("#" + this.$node.id).val(t).trigger('change');
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
    if ($("#" + this.$node.id).closest(".modal").length > 0) {
      dropdown_parent = $(this.$node).parent().parent();
    }
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
      selectionCssClass: this.props.css_class,
      dropdownCssClass: this.props.css_class,
      containerCssClass: this.props.css_class,
      multiple: this.props.multiple
    });
    (this.props.field_placeholder && this.props.value == "") 
     ? $("#" + this.$node.id).val('').trigger('change'):  null
  },
  init: function (e) {
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
      this.updateData();
      dmx.nextTick(function () {
        this.dispatchEvent('selected');
      }, this);
    });
    $(this.$node).on('select2:unselect', (e) => {
      this.updateData();
    });
    if (this.props.multiple) {
      this.initialData.selectedOptions = this.props.value.split(',')
    }
    dmx.nextTick(function () {
      this.renderSelect();
      if ($("#" + this.$node.id).closest(".modal").length > 0) {
        let modalID = $("#" + this.$node.id).closest(".modal").attr("id");
        $("#" + modalID).on("shown.bs.modal", () => {
          if (this.$node.multiple) {
            let selectedData = Array.from(this.$node.selectedOptions)
              .filter(option => option.value !== "")
              .map(option => option.value);
            $("#" + this.$node.id).val(selectedData.length === 0 ? this.props.values : selectedData).trigger("change");
          } else {
            $("#" + this.$node.id).val(this.get("selectedValue")).trigger('change');
          }
        });
      }
    }, this);
    this.updateData();
    this.$watch('selectedValue', value => {
      if (value !== null && value !== "") {
          $("#" + this.$node.id).val(value).trigger("change")
          this.dispatchEvent('changed');
          this.dispatchEvent('updated');
      }
  })},
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

  performUpdate(e) {
    dmx.Component("form-element").prototype.performUpdate.call(this, e), (e.has("options") || e.has("optiontext") || e.has("optionvalue")) && dmx.nextTick(function () {this._renderOptions() }, this);
    this.renderSelect();
    this.updateData();
  },

  updateData: function () {
    if (this.props.multiple) {
      var selectedData = [];
      // Check if the element has the "select2-hidden-accessible" class
      if (this.$node.classList.contains("select2-hidden-accessible")) {
        currentSelection = $("#" + this.$node.id).select2('data');
        for (var option of currentSelection) {
          if (option.id !== "") {
            selectedData.push(option.id);
          }
        }
        this.set('selectedOptions', selectedData)
        if (selectedData.length>0) {
            setTimeout(() => {
                $("#" + this.$node.id).val(selectedData).trigger("change");
            }, 10);
        }
      }
    } else {
      this._updateValue();
      selectedValue = this.get("selectedValue");
    }
  },
});

//Created and Maintained by Roney Dsilva v0.5.15
