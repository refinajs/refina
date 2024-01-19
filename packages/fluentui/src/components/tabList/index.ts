import { Content, MainElRef, Model, byIndex, ref, valueOf } from "refina";
import FluentUI from "../../plugin";
import { tabIndicatorCssVars } from "./indicator.styles";
import styles from "./styles";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

function getTabRect(tabRef: MainElRef): Rect {
  const element = tabRef.current!.$mainEl!.node;
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

declare module "refina" {
  interface Components {
    fTabList(
      selected: Model<number>,
      contents: Content[],
      disabled?: (boolean | undefined)[] | boolean,
    ): this is {
      $ev: number;
    };
  }
}
FluentUI.triggerComponents.fTabList = function (_) {
  const tabRefs = new Map<number, MainElRef>();
  return (selected, contents, disabled = false) => {
    const selectedValue = valueOf(selected);
    const tabListDisabled = typeof disabled === "boolean" ? disabled : false;
    const tabDisabled =
      typeof disabled === "boolean" ? [] : disabled.map(d => d ?? false);

    styles.root(tabListDisabled)(_);
    _._div({}, _ =>
      _.for(contents, byIndex, (content, index) => {
        let tabRef = tabRefs.get(index);
        if (!tabRef) {
          tabRef = ref();
          tabRefs.set(index, tabRef);
        }
        const tabSelected = selectedValue === index;
        _.$app.pushOnetimeHook("afterModifyDOM", () => {
          const selectedTabRect = getTabRect(tabRefs.get(selectedValue)!);
          const thisTabRect = getTabRect(tabRef!);
          const buttonEl = tabRef!.current!.$mainEl!.node;
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
          _.fTab(tabSelected, content, tabDisabled[index], tabSelected)
        ) {
          _.$updateModel(selected, index);
          this.$fire(index);
        }
      }),
    );
  };
};
