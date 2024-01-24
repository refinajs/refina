import { Component, Content, _ } from "refina";

export class MdTopAppBar extends Component {
  $main(inner: Content, append?: Content): void {
    _._mdui_top_app_bar(
      {},
      append
        ? _ => {
            _.embed(inner);

            _.$css`flex-grow: 1`;
            _._div();

            _.embed(append);
          }
        : inner,
    );
  }
}

export class MdTopAppBarTitle extends Component {
  $main(inner: Content): void {
    _._mdui_top_app_bar_title({}, inner);
  }
}
