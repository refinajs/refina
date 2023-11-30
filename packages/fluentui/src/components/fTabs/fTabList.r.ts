import {
  Content,
  Context,
  D,
  DArray,
  Ref,
  TriggerComponent,
  byIndex,
  getD,
  ref,
} from "refina";
import FluentUI from "../../plugin";
import { tabIndicatorCssVars } from "./animatedIndicator.styles";
import "./fTab.r";
import { FTab } from "./fTab.r";
import styles from "./fTabList.styles";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

function getTabRect(tabRef: Ref<FTab>): Rect {
  const element = tabRef.current!.buttonRef.current!.node;
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

@FluentUI.triggerComponent("fTabList")
export class FTabList extends TriggerComponent<number> {
  tabRefs = new Map<number, Ref<FTab>>();
  main(
    _: Context,
    selected: D<number>,
    contents: DArray<Content>,
    disabled: DArray<boolean | undefined> | D<boolean> = false,
  ): void {
    const selectedValue = getD(selected),
      disabledRawValue = getD(disabled);
    const tabListDisabled =
      typeof disabledRawValue === "boolean" ? disabledRawValue : false;
    const tabDisabled =
      typeof disabledRawValue === "boolean"
        ? []
        : disabledRawValue.map(d => getD(d) ?? false);

    styles.root(tabListDisabled)(_);
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
          const buttonEl = tabRef!.current!.buttonRef.current!.node;
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
          _.$setD(selected, index);
          this.$fire(index);
        }
      }),
    );
  }
}

declare module "refina" {
  interface TriggerComponents {
    fTabList: FTabList;
  }
}
