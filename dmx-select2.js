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
    field_placeholder: { type: String, default: "Select a Option." }
  },
  methods: {
    setValue: function (t, e) {
      dmx.array(this.$node.options).forEach(function (n) {
        (n.selected = n.value == t), e && (n.defaultSelected = n.selected);
      });
      this.renderSelect();
    },
  },
  renderSelect: function () {
    var dropdownParent = null;
    // Check if the parent of the element is a modal
    if ($("#" + this.$node.id).closest(".modal").length > 0) {
        dropdownParent = $("#" + this.$node.id).closest(".modal").attr("id");
    }
    $("#" + this.$node.id).select2({
        theme: this.props.field_theme,
        width: this.props.field_width,
        placeholder: this.props.field_placeholder,
        dropdownParent: $("#" +dropdownParent),
    });
  }, 
  render: function (node) {
      (this.options = []),
      this.props.value ? (this.updateValue = !0) : (this.props.value = this.$node.value),
      dmx.BaseComponent.prototype.render.call(this, node),
      (this.$node.disabled = this.props.disabled),
      this.$node.addEventListener("change", this.updateData.bind(this)),
      this.$node.addEventListener("invalid", this.updateData.bind(this)),
      this.$node.addEventListener("focus", this.updateData.bind(this)),
      this.$node.addEventListener("blur", this.updateData.bind(this)),
      this.renderOptions(),
      this.updateData();
  },
  update: function (t, e) {
      e.has("options") && (this.renderOptions(), (this.updateValue = !0)),
      e.has("value") && (this.updateValue = !0),
      t.disabled != this.props.disabled && (this.$node.disabled = this.props.disabled)
      var modalID = $("#" + this.$node.id).closest(".modal").attr("id");

      // Check if the modal is hidden
      // if ($("#" + modalID).is(":hidden")) {
      // }
      $("#" + modalID).on("shown.bs.modal", () => {
        $("#" + this.$node.id).val(selectedValue).trigger('change');
    })
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
      console.log("changed deleted")
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