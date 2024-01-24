import { Plugin } from "refina";
import * as c from "./components";
import { useMdColorScheme, useMdTheme } from "./theme";

export default {
  name: "mdui",
  components: {
    mdAvatar: c.MdAvatar,
    mdIconAvatar: c.MdIconAvatar,
    mdBadge: c.MdBadge,
    mdBottomAppBar: c.MdBottomAppBar,
    mdButton: c.MdButton,
    mdTonalButton: c.MdTonalButton,
    mdOutlinedButton: c.MdOutlinedButton,
    mdTextButton: c.MdTextButton,
    mdCheckbox: c.MdCheckbox,
    mdChip: c.MdChip,
    mdSelectableChip: c.MdSelectableChip,
    mdDeletableChip: c.MdDeletableChip,
    mdCircularProgress: c.MdCircularProgress,
    mdCollapse: c.MdCollapse,
    mdControlledDialog: c.MdControlledDialog,
    mdDialog: c.MdDialog,
    mdDivider: c.MdDivider,
    mdVerticalDivider: c.MdVerticalDivider,
    mdFab: c.MdFab,
    mdIcon: c.MdIcon,
    mdIconButton: c.MdIconButton,
    mdFilledIconButton: c.MdFilledIconButton,
    mdTonalIconButton: c.MdTonalIconButton,
    mdOutlinedIconButton: c.MdOutlinedIconButton,
    mdLayout: c.MdLayout,
    mdLayoutMain: c.MdLayoutMain,
    mdLinearProgress: c.MdLinearProgress,
    mdList: c.MdList,
    mdNavBar: c.MdNavBar,
    mdNavDrawer: c.MdNavDrawer,
    mdNavRail: c.MdNavRail,
    mdProse: c.MdProse,
    mdRadioGroup: c.MdRadioGroup,
    mdRangeSlider: c.MdRangeSlider,
    mdSegmentedButton: c.MdSegmentedButton,
    mdSelect: c.MdSelect,
    mdOutlinedSelect: c.MdOutlinedSelect,
    mdSlider: c.MdSlider,
    mdSwitch: c.MdSwitch,
    mdTable: c.MdTable,
    mdTableCell: c.MdTableCell,
    mdTabs: c.MdTabs,
    mdTextField: c.MdTextField,
    mdOutlinedTextField: c.MdOutlinedTextField,
    mdPasswordInput: c.MdPasswordInput,
    mdOutlinedPasswordInput: c.MdOutlinedPasswordInput,
    mdTextarea: c.MdTextarea,
    mdOutlinedTextarea: c.MdOutlinedTextarea,
    mdTooltip: c.MdTooltip,
    mdTopAppBar: c.MdTopAppBar,
    mdTopAppBarTitle: c.MdTopAppBarTitle,
  },
  contextFuncs: {
    useMdColorScheme,
    useMdTheme,
  },
  htmlElementAlias: mdUIHtmlElementAlias,
} satisfies Plugin;

export * from "./components";
export * from "./theme";
export * from "./metadata/events";
export { mdui };

import * as mdui from "mdui";
import { mdUIHtmlElementAlias } from "./metadata/tags";
