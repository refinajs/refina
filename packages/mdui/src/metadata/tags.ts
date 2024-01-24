import "mdui";

export type MdUITag = Exclude<
  Extract<keyof HTMLElementTagNameMap, `mdui-${string}`>,
  `mdui-icon-${string}`
>;

export const mdUITags = [
  "mdui-avatar",
  "mdui-badge",
  "mdui-bottom-app-bar",
  "mdui-button",
  "mdui-button-icon",
  "mdui-card",
  "mdui-checkbox",
  "mdui-chip",
  "mdui-circular-progress",
  "mdui-collapse-item",
  "mdui-collapse",
  "mdui-dialog",
  "mdui-divider",
  "mdui-dropdown",
  "mdui-fab",
  "mdui-icon",
  "mdui-layout-item",
  "mdui-layout-main",
  "mdui-layout",
  "mdui-linear-progress",
  "mdui-list-item",
  "mdui-list-subheader",
  "mdui-list",
  "mdui-menu-item",
  "mdui-menu",
  "mdui-navigation-bar-item",
  "mdui-navigation-bar",
  "mdui-navigation-drawer",
  "mdui-navigation-rail-item",
  "mdui-navigation-rail",
  "mdui-radio-group",
  "mdui-radio",
  "mdui-range-slider",
  "mdui-ripple",
  "mdui-segmented-button-group",
  "mdui-segmented-button",
  "mdui-select",
  "mdui-slider",
  "mdui-snackbar",
  "mdui-switch",
  "mdui-tab-panel",
  "mdui-tab",
  "mdui-tabs",
  "mdui-text-field",
  "mdui-tooltip",
  "mdui-top-app-bar-title",
  "mdui-top-app-bar",
] satisfies readonly MdUITag[];

const test: (typeof mdUITags)[number] = 0 as unknown as MdUITag;

export const mdUIHtmlElementAlias = Object.fromEntries(
  mdUITags.map(name => [name.replaceAll("-", "_"), name]),
);
