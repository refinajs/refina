import {
  Component,
  Content,
  TriggerComponent,
  _,
  bindArgsToContent,
} from "refina";

export class MdControlledDialog extends Component {
  presistent = false;
  $main(open: boolean, title: Content, body: Content, actions?: Content): void {
    const presistentProps = this.presistent
      ? {}
      : { closeOnOverlayClick: true, closeOnEsc: true };
    _._mdui_dialog(
      {
        ...presistentProps,
        open,
      },
      _ => {
        _._div(
          {
            slot: "headline",
          },
          title,
        );
        _._div(
          {
            slot: "description",
          },
          body,
        );
        actions &&
          _._div(
            {
              slot: "action",
            },
            actions,
          );
      },
    );
  }
}

export class MdDialog extends TriggerComponent {
  presistent = false;
  opened = false;
  $main(
    trigger: Content<[open: (open?: boolean) => void]>,
    title: Content<[close: (open?: boolean) => void]>,
    body: Content<[close: (open?: boolean) => void]>,
    actions?: Content<[close: (open?: boolean) => void]>,
  ): this is {
    $ev: boolean;
  } {
    const open = (open = true) => {
      this.opened = open;
      this.$fire(open);
    };
    const close = (open = false) => {
      this.opened = open;
      this.$fire(open);
    };

    _.embed(bindArgsToContent(trigger, open));
    _.$props({ presistent: this.presistent });
    _(MdControlledDialog)(
      this.opened,
      bindArgsToContent(title, close),
      bindArgsToContent(body, close),
      actions && bindArgsToContent(actions, close),
    );

    return this.$fired;
  }
}
