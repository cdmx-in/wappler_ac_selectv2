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
## Attributes

### `Placeholder`
- **Default Value:** Null
- **Description:** This attribute enables the use of a placeholder in the Select2 component, allowing you to display a hint or prompt text when no option is selected.

### `Theme`
- **Description:** This attribute allows you to choose a theme for the Select2 component, giving you control over its visual appearance.
- **Values:**
  - Default: Default theme
  - Bootstrap-5: Bootstrap 5 theme

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
**Description:** When enabled, this option will automatically close the Select2 dropdown when an item is selected. (Default: false)

### `SelectOnClose`
**Description:** If set to true, this option will automatically select the currently highlighted item when the Select2 dropdown is closed. (Default: false)

### `Tags`
**Description:** Dynamically create new options from text input by the user in the search box. (Default: false)
