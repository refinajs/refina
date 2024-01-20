import FluentUI from "../../plugin";
import { FAvatarActive, FAvatarColor, FAvatarShape } from "./types";
import useStyles from "./styles";
import { getColor } from "./colors";
import { Content } from "refina";
import { getInitials } from "./getInitials";

declare module "refina" {
  interface Components {
    /**
     * @param content Can be a string of name or image url, or a view function containing an icon.
     */
    fAvatar(
      content: Content,
      active?: FAvatarActive,
      shape?: FAvatarShape,
      color?: FAvatarColor,
    ): this is {
      $ev: void;
    };
  }
}

FluentUI.triggerComponents.fAvatar = function (_) {
  let imgHidden = false;
  return (
    content: Content,
    active: FAvatarActive = "unset",
    shape: FAvatarShape = "circular",
    color: FAvatarColor = "colorful",
  ) => {
    const resolvedColor =
      color === "colorful"
        ? typeof content === "function"
          ? "neutral"
          : getColor(typeof content === "function" ? "" : content.toString())
        : color;
    const styles = useStyles(shape, active, false, resolvedColor);

    let resolvedContent: Content;
    if (typeof content === "string") {
      if (content.includes("://")) {
        resolvedContent = _ => {
          styles.image();
          _._img({
            src: content,
            hidden: imgHidden,
            onerror() {
              imgHidden = true;
              _.$update();
            },
          });
        };
      } else {
        resolvedContent = _ => {
          styles.initials();
          _._span({}, getInitials(content.toString(), false));
        };
      }
    } else {
      resolvedContent = _ => {
        styles.icon();
        _._span({}, content);
      };
    }

    styles.root();
    _._span(
      {
        onclick: this.$fireWith(),
      },
      resolvedContent,
    );
  };
};
