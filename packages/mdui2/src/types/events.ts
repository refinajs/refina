import type {
  AvatarEventMap,
  BadgeEventMap,
  BottomAppBarEventMap,
  ButtonEventMap,
  ButtonIconEventMap,
  CardEventMap,
  CheckboxEventMap,
  ChipEventMap,
  CircularProgressEventMap,
  CollapseEventMap,
  CollapseItemEventMap,
  DialogEventMap,
  DividerEventMap,
  DropdownEventMap,
  FabEventMap,
  IconEventMap,
  LayoutEventMap,
  LayoutItemEventMap,
  LayoutMainEventMap,
  LinearProgressEventMap,
  ListEventMap,
  ListItemEventMap,
  ListSubheaderEventMap,
  MenuEventMap,
  MenuItemEventMap,
  NavigationBarEventMap,
  NavigationBarItemEventMap,
  NavigationDrawerEventMap,
  NavigationRailEventMap,
  NavigationRailItemEventMap,
  RadioEventMap,
  RadioGroupEventMap,
  RangeSliderEventMap,
  RippleEventMap,
  SegmentedButtonEventMap,
  SegmentedButtonGroupEventMap,
  SelectEventMap,
  SliderEventMap,
  SnackbarEventMap,
  SwitchEventMap,
  TabEventMap,
  TabPanelEventMap,
  TabsEventMap,
  TextFieldEventMap,
  TooltipEventMap,
  TopAppBarEventMap,
  TopAppBarTitleEventMap,
} from "mdui";
import "refina";

interface MdUI2EventMaps {
  "mdui-avatar": AvatarEventMap;
  "mdui-badge": BadgeEventMap;
  "mdui-bottom-app-bar": BottomAppBarEventMap;
  "mdui-button": ButtonEventMap;
  "mdui-button-icon": ButtonIconEventMap;
  "mdui-card": CardEventMap;
  "mdui-checkbox": CheckboxEventMap;
  "mdui-chip": ChipEventMap;
  "mdui-circular-progress": CircularProgressEventMap;
  "mdui-collapse-item": CollapseItemEventMap;
  "mdui-collapse": CollapseEventMap;
  "mdui-dialog": DialogEventMap;
  "mdui-divider": DividerEventMap;
  "mdui-dropdown": DropdownEventMap;
  "mdui-fab": FabEventMap;
  "mdui-icon": IconEventMap;
  "mdui-layout-item": LayoutItemEventMap;
  "mdui-layout-main": LayoutMainEventMap;
  "mdui-layout": LayoutEventMap;
  "mdui-linear-progress": LinearProgressEventMap;
  "mdui-list-item": ListItemEventMap;
  "mdui-list-subheader": ListSubheaderEventMap;
  "mdui-list": ListEventMap;
  "mdui-menu-item": MenuItemEventMap;
  "mdui-menu": MenuEventMap;
  "mdui-navigation-bar-item": NavigationBarItemEventMap;
  "mdui-navigation-bar": NavigationBarEventMap;
  "mdui-navigation-drawer": NavigationDrawerEventMap;
  "mdui-navigation-rail-item": NavigationRailItemEventMap;
  "mdui-navigation-rail": NavigationRailEventMap;
  "mdui-radio-group": RadioGroupEventMap;
  "mdui-radio": RadioEventMap;
  "mdui-range-slider": RangeSliderEventMap;
  "mdui-ripple": RippleEventMap;
  "mdui-segmented-button-group": SegmentedButtonGroupEventMap;
  "mdui-segmented-button": SegmentedButtonEventMap;
  "mdui-select": SelectEventMap;
  "mdui-slider": SliderEventMap;
  "mdui-snackbar": SnackbarEventMap;
  "mdui-switch": SwitchEventMap;
  "mdui-tab-panel": TabPanelEventMap;
  "mdui-tab": TabEventMap;
  "mdui-tabs": TabsEventMap;
  "mdui-text-field": TextFieldEventMap;
  "mdui-tooltip": TooltipEventMap;
  "mdui-top-app-bar-title": TopAppBarTitleEventMap;
  "mdui-top-app-bar": TopAppBarEventMap;
}

type MdUI2EventListeners = {
  [E in keyof MdUI2EventMaps]: {
    [K in keyof MdUI2EventMaps[E]]: (
      this: HTMLElementTagNameMap[E],
      ev: MdUI2EventMaps[E][K],
    ) => void;
  };
};

declare module "refina" {
  interface WebComponentsEventListeners extends MdUI2EventListeners {}
}
