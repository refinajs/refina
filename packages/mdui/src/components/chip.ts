import { Content, HTMLElementComponent, Model, ref, valueOf } from "refina";
import MdUI from "../plugin";

declare module "refina" {
  interface Components {
    MdChipProps: {
      icon: string;
      endIcon: string;
    };
    mdChip(inner: Content, disabled?: boolean): void;
  }
}
MdUI.outputComponents.mdChip = function (_) {
  return (inner, disabled = false) => {
    _._mdui_chip(
      {
        disabled,
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
      selected: Model<boolean>,
      inner: Content,
      disabled?: boolean,
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
          selected: valueOf(selected),
          disabled,
          onchange: () => {
            const newSelected = chipRef.current!.node.selected;
            _.$updateModel(selected, newSelected);
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
      inner: Content,
      disabled?: boolean,
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
        disabled,
        deleteIcon: this.$props.deleteIcon,
      },
      inner,
      {
        delete: this.$fireWith(),
      },
    );
  };
};
