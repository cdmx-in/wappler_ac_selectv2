dmx.Component("select2", {
  extends: "select",
  initialData: {
    selectedIndex: -1,
    selectedValue: "",
    selectedText: "",
    selectedOptions: []
  },
  attributes: {
    options: { type: Object, default: {} },
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
          const selectedValues = Array.isArray(t) ? t : t.split(',');
          this.set('selectedOptions', selectedValues)
          $("#" + this.$node.id).val(selectedValues).trigger('change');
        }, this);

      } else {
        dmx.nextTick(function () {
          $("#" + this.$node.id).val(t).trigger('change');
        }, this);
      }
    },
    reset: function () {
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
    //Below is select2 events
    $(this.$node).on('select2:close', (e) => {
      this.updateData();
      dmx.nextTick(function () {
        this.dispatchEvent('closed');
      }, this);
    });
    $(this.$node).on('select2:open', (e) => {
      this.updateData();
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
          this.dispatchEvent('changed');
          this.dispatchEvent('updated');
      }
  })},
  _renderOptions () {
    if (this.props.options && (Array.isArray(this.props.options) || Object.keys(this.props.options).length > 0)) {
      this._options.splice(0).forEach(option => option.remove());
      this._updatingOptions = true;
  
      const options = this.props.options;
      const isArray = Array.isArray(options);
      const optionEntries = isArray ? options : Object.entries(options);
  
      optionEntries.forEach(optionEntry => {
          let key, value;
          if (isArray) {
              value = optionEntry;
          } else {
              [key, value] = optionEntry;
              if (typeof value !== "object") {
                  value = { $value: value };
              }
          }
          const node = document.createElement('option');
          node.value = isArray 
              ? dmx.parse(this.props.optionvalue, dmx.DataScope(value, this)) 
              : (this.props.optionvalue === "$key" ? key : dmx.parse(this.props.optionvalue, dmx.DataScope(value, this)));
  
          node.textContent = isArray 
              ? dmx.parse(this.props.optiontext, dmx.DataScope(value, this)) 
              : (this.props.optiontext === "$key" ? key : dmx.parse(this.props.optiontext, dmx.DataScope(value, this)));
  
          if (node.value == this.props.value) node.selected = true;
          this.$node.append(node);
          this._options.push(node);
      });
      this._updatingOptions = false;
      this._updateValue();
  }
  },

  performUpdate(e) {
    dmx.Component("form-element").prototype.performUpdate.call(this, e), (e.has("options") || e.has("optiontext") || e.has("optionvalue")) && this._renderOptions()
    this.renderSelect();
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
        $("#" + this.$node.id).val(selectedData).trigger("change");
      }
    } else {
      this._updateValue();
      selectedValue = this.get("selectedValue");
      $("#" + this.$node.id).val(selectedValue).trigger('change');
    }
  },
});

//Created and Maintained by Roney Dsilva