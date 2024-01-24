import {
  Component,
  Content,
  TriggerComponent,
  _,
  bindArgsToContent,
} from "refina";

export class MdControlledNavDrawer extends Component {
  contained?: boolean;
  $main(open: boolean, inner: Content, modal = false): void {
    _._mdui_navigation_drawer(
      {
        open,
        contained: this.contained,
        modal: modal,
        closeOnEsc: modal,
        closeOnOverlayClick: modal,
      },
      inner,
    );
  }
}

export class MdNavDrawer extends TriggerComponent {
  contained?: boolean;
  opened = false;
  $main(
    trigger: Content<[open: (open?: boolean) => void]>,
    inner: Content<[close: (open?: boolean) => void]>,
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
      bindArgsToContent(inner, (open = false) => {
        this.opened = open;
        this.$fire(open);
      }),
      modal,
    );
    return this.$fired;
  }
}
