import type * as t from "mdui";
import "refina";

interface MdUIEventMaps {
  "mdui-avatar": t.AvatarEventMap;
  "mdui-badge": t.BadgeEventMap;
  "mdui-bottom-app-bar": t.BottomAppBarEventMap;
  "mdui-button": t.ButtonEventMap;
  "mdui-button-icon": t.ButtonIconEventMap;
  "mdui-card": t.CardEventMap;
  "mdui-checkbox": t.CheckboxEventMap;
  "mdui-chip": t.ChipEventMap;
  "mdui-circular-progress": t.CircularProgressEventMap;
  "mdui-collapse-item": t.CollapseItemEventMap;
  "mdui-collapse": t.CollapseEventMap;
  "mdui-dialog": t.DialogEventMap;
  "mdui-divider": t.DividerEventMap;
  "mdui-dropdown": t.DropdownEventMap;
  "mdui-fab": t.FabEventMap;
  "mdui-icon": t.IconEventMap;
  "mdui-layout-item": t.LayoutItemEventMap;
  "mdui-layout-main": t.LayoutMainEventMap;
  "mdui-layout": t.LayoutEventMap;
  "mdui-linear-progress": t.LinearProgressEventMap;
  "mdui-list-item": t.ListItemEventMap;
  "mdui-list-subheader": t.ListSubheaderEventMap;
  "mdui-list": t.ListEventMap;
  "mdui-menu-item": t.MenuItemEventMap;
  "mdui-menu": t.MenuEventMap;
  "mdui-navigation-bar-item": t.NavigationBarItemEventMap;
  "mdui-navigation-bar": t.NavigationBarEventMap;
  "mdui-navigation-drawer": t.NavigationDrawerEventMap;
  "mdui-navigation-rail-item": t.NavigationRailItemEventMap;
  "mdui-navigation-rail": t.NavigationRailEventMap;
  "mdui-radio-group": t.RadioGroupEventMap;
  "mdui-radio": t.RadioEventMap;
  "mdui-range-slider": t.RangeSliderEventMap;
  "mdui-ripple": t.RippleEventMap;
  "mdui-segmented-button-group": t.SegmentedButtonGroupEventMap;
  "mdui-segmented-button": t.SegmentedButtonEventMap;
  "mdui-select": t.SelectEventMap;
  "mdui-slider": t.SliderEventMap;
  "mdui-snackbar": t.SnackbarEventMap;
  "mdui-switch": t.SwitchEventMap;
  "mdui-tab-panel": t.TabPanelEventMap;
  "mdui-tab": t.TabEventMap;
  "mdui-tabs": t.TabsEventMap;
  "mdui-text-field": t.TextFieldEventMap;
  "mdui-tooltip": t.TooltipEventMap;
  "mdui-top-app-bar-title": t.TopAppBarTitleEventMap;
  "mdui-top-app-bar": t.TopAppBarEventMap;
}

type MdUIEventListeners = {
  [E in keyof MdUIEventMaps]: {
    [K in keyof MdUIEventMaps[E]]: (
      this: HTMLElementTagNameMap[E],
      ev: MdUIEventMaps[E][K],
    ) => void;
  };
};

declare module "refina" {
  interface WebComponentsEventListeners extends MdUIEventListeners {}
}
