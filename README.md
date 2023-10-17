#### Created and Maintained by: Roney Dsilva

# Select2 Extension Module for Select Module

The Select2 extension module enhances the functionality of the Select module by providing advanced options for selecting and displaying data.

## Table of Contents
- [Attributes](#attributes)
  - [Placeholder](#Placeholder)
  - [Theme](#Theme)
  - [Width](#Width)
  - [Rtl](#Rtl)
  - [CloseOnSelect](#CloseOnSelect)
  - [SelectOnClose](#SelectOnClose)
  - [Tags](#Tags)
  - [AllowClear](#allowClear)

## Attributes

### `Placeholder`
- **Default Value:** Null
- **Description:** This attribute enables the use of a placeholder in the Select2 component, allowing you to display a hint or prompt text when no option is selected.

### `Theme`
- **Description:** This attribute allows you to choose a theme for the Select2 component, giving you control over its visual appearance.
- **Values:**
  - Default: Default theme
  - Classic: Select2 Classic theme
  - Bootstrap-5: Bootstrap 5 theme
  - Custom: Custom theme (Should be included in layout with .select2-container--custom in the css)

### `Width`
- **Description:** This attribute allows you to set the width of the Select2 component, giving you control over its visual appearance.
- **Values:**
  - `resolve`: Resolve Theme: A theme-specific width (default).
  - `element`: Bootstrap 5 Theme: A width suitable for Bootstrap 5 theme.
  - `style`: Style Theme: A width suitable for the Style theme.
  - `100%`: 100% width.
  - `50%`: 50% width.
  - `200px`: 200 pixels width.
  - `300px`: 300 pixels width.

### `Rtl`
**Description:** This option enables right-to-left (RTL) text direction for the Select2 element, making it suitable for languages that are read from right to left. (Default: false).

### `CloseOnSelect`
**Description:** When enabled, this option will automatically close the Select2 dropdown when an item is selected. (Default: true)

### `SelectOnClose`
**Description:** If set to true, this option will automatically select the currently highlighted item when the Select2 dropdown is closed. (Default: false)

### `Tags`
**Description:** Dynamically create new options from text input by the user in the search box. (Default: false)

### `allowClear`
**Description:** Allow clearing the Selected value. (Default: false)


#### Action Attributes

**Update**
- Used to call an update on the Select2 element from another element/event listener.
- Note: This event listener is not seen from the UI Module, you need to manually add `.updatedSelectedData()` from the code view.

**Reset**
- Used to reset Select2 selection from another element/event listener.
- Note: This event listener is not seen from the UI Module, you need to manually add `.reset()` from the code view.
