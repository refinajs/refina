import {
  Content,
  PrimaryElRef,
  Model,
  TriggerComponent,
  _,
  byIndex,
  ref,
  unwrap,
} from "refina";
import { FTab } from "../tab";
import { tabIndicatorCssVars } from "./indicator.styles";
import useStyles from "./styles";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

function getTabRect(tabRef: PrimaryElRef): Rect {
  const element = tabRef.current!.$primaryEl!.node;
  const parentRect = element.parentElement?.getBoundingClientRect() ?? {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
  const tabRect = element.getBoundingClientRect();

  return {
    x: tabRect.x - parentRect.x,
    y: tabRect.y - parentRect.y,
    width: tabRect.width,
    height: tabRect.height,
  };
}

export class FTabList extends TriggerComponent {
  tabRefs = new Map<number, PrimaryElRef>();
  $main(
    selected: Model<number>,
    contents: Content[],
    disabled: (boolean | undefined)[] | boolean = false,
  ): this is {
    $ev: number;
  } {
    const selectedValue = unwrap(selected);
    const tabListDisabled = typeof disabled === "boolean" ? disabled : false;
    const tabDisabled =
      typeof disabled === "boolean" ? [] : disabled.map(d => d ?? false);

    const styles = useStyles(tabListDisabled);

    styles.root();
    _._div({}, _ =>
      _.for(contents, byIndex, (content, index) => {
        let tabRef = this.tabRefs.get(index);
        if (!tabRef) {
          tabRef = ref();
          this.tabRefs.set(index, tabRef);
        }
        const tabSelected = selectedValue === index;
        _.$app.pushOnetimeHook("afterModifyDOM", () => {
          const selectedTabRect = getTabRect(this.tabRefs.get(selectedValue)!);
          const thisTabRect = getTabRect(tabRef!);
          const buttonEl = tabRef!.current!.$primaryEl!.node;
          const animationOffset = selectedTabRect.x - thisTabRect.x;
          const animationScale = selectedTabRect.width / thisTabRect.width;
          buttonEl.style.setProperty(
            tabIndicatorCssVars.offsetVar,
            `${animationOffset}px`,
          );
          buttonEl.style.setProperty(
            tabIndicatorCssVars.scaleVar,
            `${animationScale}`,
          );
        });
        if (
          _.$ref(tabRef) &&
          _(FTab)(tabSelected, content, tabDisabled[index], tabSelected)
        ) {
          this.$updateModel(selected, index);
          this.$fire(index);
        }
      }),
    );
    return this.$fired;
  }
}
