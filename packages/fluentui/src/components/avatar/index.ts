import { Content, TriggerComponent, _ } from "refina";
import { getColor } from "./colors";
import { getInitials } from "./getInitials";
import useStyles from "./styles";
import { FAvatarActive, FAvatarColor, FAvatarShape } from "./types";

export class FAvatar extends TriggerComponent<void> {
  imgHidden = false;
  /**
   * @param content Can be a string of name or image url, or a fragment containing an icon.
   */
  $main(
    content: Content,
    active: FAvatarActive = "unset",
    shape: FAvatarShape = "circular",
    color: FAvatarColor = "colorful",
  ): this is {
    $ev: void;
  } {
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
            hidden: this.imgHidden,
            onerror: () => {
              this.imgHidden = true;
              this.$update();
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
    return this.$fired;
  }
}
