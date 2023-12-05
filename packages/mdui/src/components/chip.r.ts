import {
  Content,
  Context,
  D,
  HTMLElementComponent,
  OutputComponent,
  TriggerComponent,
  getD,
  ref,
} from "refina";
import MdUI from "../plugin";

@MdUI.outputComponent("mdChip")
export class MdChip extends OutputComponent<{
  icon: string;
  endIcon: string;
}> {
  main(_: Context, inner: D<Content>, disabled: D<boolean> = false): void {
    _._mdui_chip(
      {
        disabled: getD(disabled),
        icon: this.$props.icon,
        endIcon: this.$props.endIcon,
      },
      inner,
    );
  }
}

@MdUI.triggerComponent("mdSelectableChip")
export class MdSelectableChip extends TriggerComponent<
  boolean,
  {
    selectedIcon: string;
  }
> {
  chipRef = ref<HTMLElementComponent<"mdui-chip">>();
  main(
    _: Context,
    selected: D<boolean>,
    inner: D<Content>,
    disabled: D<boolean> = false,
  ): void {
    _.$ref(this.chipRef) &&
      _._mdui_chip(
        {
          selectable: true,
          selected: getD(selected),
          disabled: getD(disabled),
          onchange: () => {
            const newSelected = this.chipRef.current!.node.selected;
            _.$setD(selected, newSelected);
            this.$fire(newSelected);
          },
          selectedIcon: this.$props.selectedIcon,
        },
        inner,
      );
  }
}

@MdUI.triggerComponent("mdDeletableChip")
export class MdDeletableChip extends TriggerComponent<
  void,
  {
    deleteIcon: string;
  }
> {
  chipRef = ref<HTMLElementComponent<"mdui-chip">>();
  main(_: Context, inner: D<Content>, disabled: D<boolean> = false): void {
    _._mdui_chip(
      {
        deletable: true,
        disabled: getD(disabled),
        deleteIcon: this.$props.deleteIcon,
      },
      inner,
      {
        delete: () => {
          this.$fire();
        },
      },
    );
  }
}

declare module "refina" {
  interface OutputComponents {
    mdChip: MdChip;
  }
  interface TriggerComponents {
    mdSelectableChip: MdSelectableChip;
    mdDeletableChip: MdDeletableChip;
  }
}