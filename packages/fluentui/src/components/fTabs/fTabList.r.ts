import {
  Content,
  D,
  DArray,
  Ref,
  TriggerComponent,
  TriggerComponentContext,
  byIndex,
  getD,
  ref,
  triggerComponent,
} from "refina";
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
  const element = tabRef.current!.buttonEl.current!.node;
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

@triggerComponent("fTabList")
export class FTabList extends TriggerComponent<number> {
  tabLastAnimatedFroms = new Map<number, Ref<FTab>>();
  tabAnimationOffsets = new Map<number, number>();
  tabAnimationScales = new Map<number, number>();
  previousSelected: Ref<FTab> | null = null;
  tabRefs = new Map<number, Ref<FTab>>();

  playAnimation(selectedValue: number, selectedTabRef: Ref<FTab>, selectedTabRect: Rect) {
    if (this.previousSelected === null) {
      this.tabLastAnimatedFroms.clear();
      return;
    }
    const previousSelectedTabRect = getTabRect(this.previousSelected);
    for (const index of this.tabRefs.keys()) {
      if (index === selectedValue) {
        if (this.tabLastAnimatedFroms.get(index) !== this.previousSelected) {
          this.tabAnimationOffsets.set(index, previousSelectedTabRect.x - selectedTabRect.x);
          this.tabAnimationScales.set(index, previousSelectedTabRect.width / selectedTabRect.width);
          this.tabLastAnimatedFroms.set(index, this.previousSelected);
          this.app.pushHook("afterModifyDOM", () => {
            setTimeout(() => {
              this.tabAnimationOffsets.set(index, 0);
              this.tabAnimationScales.set(index, 1);
              this.app.update();
            }, 0);
          });
        }
      } else {
        this.tabLastAnimatedFroms.delete(index);
        if (this.previousSelected) {
          this.tabAnimationOffsets.set(index, 0);
          this.tabAnimationScales.set(index, 1);
        }
      }
    }
  }

  main(
    _: TriggerComponentContext<number, this>,
    selected: D<number>,
    contents: DArray<Content>,
    disabled: DArray<boolean | undefined> | D<boolean> = false,
  ): void {
    const selectedValue = getD(selected),
      disabledRawValue = getD(disabled);
    const tabListDisabled = typeof disabledRawValue === "boolean" ? disabledRawValue : false;
    const tabDisabled = typeof disabledRawValue === "boolean" ? [] : disabledRawValue.map((d) => getD(d) ?? false);
    styles.root(tabListDisabled)(_);
    _._div({}, () =>
      _.for(contents, byIndex, (content, index) => {
        let tabRef = this.tabRefs.get(index);
        if (!tabRef) {
          tabRef = ref();
          this.tabRefs.set(index, tabRef);
        }
        const animationOffset = this.tabAnimationOffsets.get(index) ?? 0,
          animationScale = this.tabAnimationScales.get(index) ?? 1;
        const animating = animationOffset === 0 && animationScale === 1;
        _.$css`${tabIndicatorCssVars.offsetVar}: ${animationOffset}px;
               ${tabIndicatorCssVars.scaleVar}: ${animationScale}`;
        if (_.$ref(tabRef) && _.fTab(selectedValue === index, content, tabDisabled[index], animating)) {
          this.previousSelected = this.tabRefs.get(selectedValue) ?? null;
          _.$setD(selected, index);
          this.playAnimation(index, tabRef, getTabRect(tabRef));
          _.$fire(index);
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
