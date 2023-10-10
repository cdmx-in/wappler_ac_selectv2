dmx.Component("select2", {
  extends: "form-element",
  initialData: { 
      selectedIndex: -1, 
      selectedValue: "", 
      selectedText: "" 
  },
  tag: "select",
  attributes: {
    options: { type: Array, default: [] },
    optionText: { type: String, default: "$value" },
    optionValue: { type: String, default: "$value" },
    field_theme: { type: String, default: "bootstrap-5" },
    field_width: { type: String, default: "resolve" },
    field_placeholder: { type: String, default: "Select a Option." },
    enable_rtl: { type: Boolean, default: false },
    enable_tags: { type: Boolean, default: false },
    select_on_close: { type: Boolean, default: false },
    close_on_select: { type: Boolean, default: true },
    css_class: { type: String, default: "select2--large" }
  },
  methods: {
    setSelectedIndex: function (t) {
      (this.$node.selectedIndex = t), this.updateData();
    },
    updatedSelectedData: function () {
      this.updateData()
    },
    setValue: function (t, e) {
      dmx.array(this.$node.options).forEach(function (n) {
        (n.selected = n.value == t), e && (n.defaultSelected = n.selected);
      });
      this.renderSelect();
    },
  },
  events: {
    selected: Event,
    opened: Event,
    closed: Event
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
        selectOnClose: this.props.select_on_close,
        closeOnSelect: this.props.close_on_select,
        placeholder: this.props.field_placeholder,
        dropdownParent: dropdown_parent,
        selectionCssClass: this.props.css_class,
        dropdownCssClass: this.props.css_class,
        containerCssClass: this.props.css_class
    });
  }, 
  render: function (node) {
      (this.options = []),
      this.props.value ? (this.updateValue = !0) : (this.props.value = this.$node.value),
      dmx.BaseComponent.prototype.render.call(this, node),
      (this.$node.disabled = this.props.disabled),
      $(this.$node).on('select2:close', (e) => {
        this.updateData();
        this.dispatchEvent('closed');
      });
      $(this.$node).on('select2:open', (e) => {
        this.updateData();
        this.dispatchEvent('opened');
      });
      $(this.$node).on('select2:select', (e) => {
        this.updateData();
        this.dispatchEvent('selected');
      });
      this.renderOptions(),
      this.updateData();
  },
  update: function (t, e) {
      e.has("options") && (this.renderOptions(), (this.updateValue = !0)),
      e.has("value") && (this.updateValue = !0),
      t.disabled != this.props.disabled && (this.$node.disabled = this.props.disabled)
      if ($("#" + this.$node.id).closest(".modal").length > 0) {
          let modalID = $("#" + this.$node.id).closest(".modal").attr("id");
          $("#" + modalID).on("shown.bs.modal", () => {
            $("#" + this.$node.id).val(selectedValue).trigger('change');
        })
      }
      this.updateData()
  },
  updated: function () {
    this.updateValue &&
      ((this.updateValue = !1),
      this.setValue(this.props.value, !0),
      this.renderSelect(),
      this.updateData());
  },
  updateData: function (t) {
    dmx.Component("form-element").prototype.updateData.call(this, t);
    var e = this.$node.selectedIndex;
    
    this.set("selectedIndex", e),
      this.set(
        "selectedValue",
        (this.$node.options[e] && this.$node.options[e].value) || ""
      ),
      this.set(
        "selectedText",
        (this.$node.options[e] && this.$node.options[e].text) || ""
      );
      selectedValue = this.get("selectedValue");
      $("#" + this.$node.id).val(selectedValue).trigger('change');
  },
  renderOptions: function () {
    this.options.splice(0).forEach(function (t) {
      dmx.dom.remove(t);
    }),
      this.$node.dataset.placeholder
        ? this.options.push(
            this.$node.appendChild(document.createElement("option"))
          )
        : null;
    dmx.repeatItems(this.props.options).forEach(function (t) {
      "object" != typeof t && (t = { $value: t });
      var e = document.createElement("option");
      (e.value = Array.isArray(this.props.options)
        ? dmx.parse(this.props.optionValue, dmx.DataScope(t, this))
        : t.$key),
        (e.innerText = dmx.parse(
          this.props.optionText,
          dmx.DataScope(t, this)
        )),
        this.options.push(this.$node.appendChild(e));
    }, this);
  }
});

//Created and Maintained by Roney Dsilva