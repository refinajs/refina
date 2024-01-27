import {
  Component,
  Content,
  Model,
  TriggerComponent,
  _,
  elementRef,
  unwrap,
} from "refina";

export class MdChip extends Component {
  icon?: string;
  endIcon?: string;
  $main(children: Content, disabled = false): void {
    _._mdui_chip(
      {
        disabled,
        icon: this.icon,
        endIcon: this.endIcon,
      },
      children,
    );
  }
}

export class MdSelectableChip extends TriggerComponent {
  selectedIcon?: string;
  chipRef = elementRef<"mdui-chip">();
  $main(
    selected: Model<boolean>,
    children: Content,
    disabled = false,
  ): this is {
    $ev: boolean;
  } {
    _.$ref(this.chipRef);
    _._mdui_chip(
      {
        selectable: true,
        selected: unwrap(selected),
        disabled,
        onchange: () => {
          const newSelected = this.chipRef.current!.node.selected;
          this.$updateModel(selected, newSelected);
          this.$fire(newSelected);
        },
        selectedIcon: this.selectedIcon,
      },
      children,
    );
    return this.$fired;
  }
}

export class MdDeletableChip extends TriggerComponent<void> {
  deleteIcon?: string;
  $main(
    children: Content,
    disabled = false,
  ): this is {
    $ev: void;
  } {
    _._mdui_chip(
      {
        deletable: true,
        disabled,
        deleteIcon: this.deleteIcon,
      },
      children,
      {
        delete: this.$fireWith(),
      },
    );
    return this.$fired;
  }
}
