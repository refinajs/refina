# `@refina/mdui`

[![npm](https://img.shields.io/npm/v/%40refina%2Fmdui?color=green)](https://www.npmjs.com/package/@refina/mdui)

This is the adapted version of **[MdUI](https://mdui.org/) v2** for [**Refina**](https://refina.vercel.app).

To know more about MdUI, please visit:

- [Website](https://mdui.org/).
- [Documentation](https://mdui.org/docs/2/).
- [GitHub Repository](https://github.com/zdhxiong/mdui).

To know more about Refina, please visit:

- [Documentation](https://refina.vercel.app).
- [Getting Started](https://refina.vercel.app/guide/introduction.html)
- [GitHub Repository](https://github.com/refinajs/refina).
- [Examples](https://gallery.refina.vercel.app).

## Usage

### Setup

#### Import the Stylesheet

```ts
import "@refina/mdui/styles.css";
```

#### Install the Plugin to App

```ts
import MdUI from "@refina/mdui";

app.use(MdUI)(_ => {
  // ...
});
```

### Use Adapted Components

The adapted MdUI components has a `md` prefix.

```ts
if (_.mdButton("button")) {
  console.log("Button clicked");
}
```

### Use Intrinsic Web Components

All the components of MdUI can be used directly using [low-level rendering functions](https://refina.vercel.app/guide/essentials/lowlevel.html).

The hyphens in the component names should be replaced with underscores.

**Refina Example**:

```ts
app.use(MdUI)(_ => {
  _._mdui_tooltip(
    {
      content: "Plain tooltip",
    },
    _ => _.mdui_button("button"),
    {
      opened: () => {
        console.log("Tooltip opened");
      },
    },
  );
});
```

**Equivalent HTML**:

```html
<mdui-tooltip id="toolip" content="Plain tooltip">
  <mdui-button>button</mdui-button>
</mdui-tooltip>
<script>
  const tooltip = document.getElementById("tooltip");
  tooltip.addEventListener("opened", () => {
    console.log("Tooltip opened");
  });
<script>
```

### Use the Icons

See [MdUI Icons](https://www.mdui.org/docs/2/components/icon#usage-material-icons).

## Included Components

- Avatar
  - `mdAvatar`
  - `mdIconAvatar`
- Badge
  - `mdBadge`
- BottomAppBar
  - `mdBottomAppBar`
- Button
  - `mdButton`
  - `mdTonalButton`
  - `mdOutlinedButton`
  - `mdTextButton`
- Checkbox
  - `mdCheckbox`
- Chip
  - `mdChip`
  - `mdSelectableChip`
  - `mdDeletableChip`
- CircularProgress
  - `mdCircularProgress`
- Collapse
  - `mdCollapse`
- Dialog
  - `mdDialog`
  - `mdControlledDialog`
- Divider
  - `mdDivider`
  - `mdVerticalDivider`
- Fab
  - `mdFab`
- Icon
  - `mdIcon`
- IconButton
  - `mdIconButton`
  - `FilledIconButton`
  - `TonalIconButton`
  - `OutlinedIconButton`
- Layout
  - `mdLayout`
- LayoutMain
  - `mdLayoutMain`
- LinearProgress
  - `mdLinearProgress`
- List
  - `mdList`
- NavBar
  - `mdNavBar`
- NavDrawer
  - `mdNavDrawer`
  - `mdControlledNavDrawer`
- NavRail
  - `mdNavRail`
- Prose
  - `mdProse`
- RadioGroup
  - `mdRadioGroup`
- RangeSlider
  - `mdRangeSlider`
- SegmentedButton
  - `mdSegmentedButton`
- Select
  - `mdSelect`
  - `mdOutlinedSelect`
- Slider
  - `mdSlider`
- Switch
  - `mdSwitch`
- Table
  - `mdTable`
  - `mdTableHeader`
  - `mdTableCell`
- Tabs
  - `mdTabs`
- TextField
  - `mdTextField`
  - `mdOutlinedTextField`
  - `mdPasswordInput`
  - `mdOutlinedPasswordInput`
  - `mdTextarea`
  - `mdOutlinedTextarea`
- Tooltip
  - `mdTooltip`
- TopAppBar
  - `mdTopAppBar`
  - `mdTopAppBarTitle`
