import { Content, D, HTMLElementComponent, getD, ref } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    MdChipProps: {
      icon: string;
      endIcon: string;
    };
    mdChip(inner: D<Content>, disabled?: D<boolean>): void;
  }
}
MdUI.outputComponents.mdChip = function (_) {
  return (inner, disabled = false) => {
    _._mdui_chip(
      {
        disabled: getD(disabled),
        icon: this.$props.icon,
        endIcon: this.$props.endIcon,
      },
      inner,
    );
  };
};

declare module "refina" {
  interface Components {
    MdDeletableChipProps: {
      deleteIcon: string;
    };
    mdSelectableChip(
      selected: D<boolean>,
      inner: D<Content>,
      disabled?: D<boolean>,
    ): this is {
      $ev: boolean;
    };
  }
}
MdUI.triggerComponents.mdSelectableChip = function (_) {
  const chipRef = ref<HTMLElementComponent<"mdui-chip">>();
  return (selected, inner, disabled = false) => {
    _.$ref(chipRef) &&
      _._mdui_chip(
        {
          selectable: true,
          selected: getD(selected),
          disabled: getD(disabled),
          onchange: () => {
            const newSelected = chipRef.current!.node.selected;
            _.$setD(selected, newSelected);
            this.$fire(newSelected);
          },
          selectedIcon: this.$props.selectedIcon,
        },
        inner,
      );
  };
};

declare module "refina" {
  interface Components {
    MdSelectableChipProps: {
      selectedIcon: string;
    };
    mdDeletableChip(
      inner: D<Content>,
      disabled?: D<boolean>,
    ): this is {
      $ev: void;
    };
  }
}
MdUI.triggerComponents.mdDeletableChip = function (_) {
  return (inner, disabled = false) => {
    _._mdui_chip(
      {
        deletable: true,
        disabled: getD(disabled),
        deleteIcon: this.$props.deleteIcon,
      },
      inner,
      {
        delete: this.$fireWith(),
      },
    );
  };
};
