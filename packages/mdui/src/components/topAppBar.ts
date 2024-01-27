import { Component, Content, _ } from "refina";

export class MdTopAppBar extends Component {
  $main(children: Content, append?: Content): void {
    _._mdui_top_app_bar(
      {},
      append
        ? _ => {
            _.embed(children);

            _.$css`flex-grow: 1`;
            _._div();

            _.embed(append);
          }
        : children,
    );
  }
}

export class MdTopAppBarTitle extends Component {
  $main(children: Content): void {
    _._mdui_top_app_bar_title({}, children);
  }
}
