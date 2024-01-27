import {
  Component,
  Content,
  TriggerComponent,
  _,
  bindArgsToContent,
} from "refina";

export class MdControlledNavDrawer extends Component {
  contained?: boolean;
  $main(open: boolean, children: Content, modal = false): void {
    _._mdui_navigation_drawer(
      {
        open,
        contained: this.contained,
        modal: modal,
        closeOnEsc: modal,
        closeOnOverlayClick: modal,
      },
      children,
    );
  }
}

export class MdNavDrawer extends TriggerComponent {
  contained?: boolean;
  opened = false;
  $main(
    trigger: Content<[open: (open?: boolean) => void]>,
    children: Content<[close: (open?: boolean) => void]>,
    modal = false,
  ): this is {
    $ev: boolean;
  } {
    _.embed(
      bindArgsToContent(trigger, (open = true) => {
        this.opened = open;
        this.$fire(open);
      }),
    );
    _.$props({ contained: this.contained });
    _(MdControlledNavDrawer)(
      this.opened,
      bindArgsToContent(children, (open = false) => {
        this.opened = open;
        this.$fire(open);
      }),
      modal,
    );
    return this.$fired;
  }
}
