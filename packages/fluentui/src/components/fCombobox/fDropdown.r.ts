import * as keys from "@fluentui/keyboard-keys";
import "@refina/fluentui-icons/checkmark.r.ts";
import "@refina/fluentui-icons/chevronDown.r.ts";
import {
  D,
  DArray,
  DOMElementComponent,
  HTMLElementComponent,
  bySelf,
  getD,
  ref,
} from "refina";
import FluentUI from "../../plugin";
import "../../positioning";
import "../fPortal";
import dropdownStyles from "./fDropdown.styles";
import { DropdownAppearance } from "./fDropdown.types";
import listboxStyles from "./listbox.styles";
import optionStyles from "./option.styles";

/**
 * enum of actions available in any type of managed dropdown control
 * e.g. combobox, select, datepicker, menu
 */
type DropdownActions =
  | "Close"
  | "CloseSelect"
  | "First"
  | "Last"
  | "Next"
  | "None"
  | "Open"
  | "PageDown"
  | "PageUp"
  | "Previous"
  | "Select"
  | "Tab"
  | "Type";

/**
 * Converts a keyboard interaction into a defined action
 */
function getDropdownActionFromKey(
  e: KeyboardEvent,
  open: boolean = true,
): DropdownActions {
  const code = e.key;
  const { altKey, ctrlKey, key, metaKey } = e;

  // typing action occurs whether open or closed
  if (
    key.length === 1 &&
    code !== keys.Space &&
    !altKey &&
    !ctrlKey &&
    !metaKey
  ) {
    return "Type";
  }

  // handle opening the dropdown if closed
  if (!open) {
    if (
      code === keys.ArrowDown ||
      code === keys.ArrowUp ||
      code === keys.Enter ||
      code === keys.Space
    ) {
      return "Open";
    }

    // if the dropdown is closed and an action did not match the above, do nothing
    return "None";
  }

  // select or close actions
  if (
    (code === keys.ArrowUp && altKey) ||
    code === keys.Enter ||
    code === keys.Space
  ) {
    return "CloseSelect";
  }
  if (code === keys.Escape) {
    return "Close";
  }

  // navigation interactions
  if (code === keys.ArrowDown) {
    return "Next";
  }
  if (code === keys.ArrowUp) {
    return "Previous";
  }
  if (code === keys.Home) {
    return "First";
  }
  if (code === keys.End) {
    return "Last";
  }
  if (code === keys.PageUp) {
    return "PageUp";
  }
  if (code === keys.PageDown) {
    return "PageDown";
  }
  if (code === keys.Tab) {
    return "Tab";
  }

  // if nothing matched, return none
  return "None";
}

/**
 * Returns the requested option index from an action
 */
function getIndexFromAction(
  action: DropdownActions,
  currentIndex: number,
  maxIndex: number,
): number {
  switch (action) {
    case "Next":
      return Math.min(maxIndex, currentIndex + 1);
    case "Previous":
      return Math.max(0, currentIndex - 1);
    case "First":
      return 0;
    case "Last":
      return maxIndex;
    case "PageDown":
      return Math.min(maxIndex, currentIndex + 10);
    case "PageUp":
      return Math.max(0, currentIndex - 10);
    default:
      return currentIndex;
  }
}

declare module "refina" {
  interface Components {
    fDropdown<OptionValue extends string>(
      selected: D<OptionValue | "">,
      options: DArray<OptionValue>,
      disabled?: D<boolean | D<boolean>[]>,
      placeholder?: D<string>,
      appearance?: DropdownAppearance,
    ): this is {
      $ev: OptionValue;
    };
  }
}
FluentUI.triggerComponents.fDropdown = function (_) {
  let activeIndex = 0;
  let focusVisible = false;
  let ignoreNextBlur = false;
  let open = false;

  const buttonEl = ref<DOMElementComponent<"button">>();

  return (
    selected,
    options,
    disabled = false,
    placeholder,
    appearance = "outline",
  ) => {
    const selectedValue = getD(selected),
      optionsValue = getD(options),
      disabledValue = getD(disabled),
      placeholderValue = getD(placeholder);

    const rootDisabled =
      typeof disabledValue === "boolean" ? disabledValue : false;
    const disabledOptions =
      typeof disabledValue === "boolean"
        ? new Set<number>()
        : new Set(disabledValue.map((v, i) => (getD(v) ? i : -1)));

    const rootRef = ref<HTMLElementComponent<"div">>();
    const { targetRef, containerRef } = _.usePositioning(
      {
        position: "below" as const,
        align: "start" as const,
        offset: { crossAxis: 0, mainAxis: 2 },
        fallbackPositions: [
          "above",
          "after",
          "after-top",
          "before",
          "before-top",
        ],
      },
      open,
    );

    if (open) {
      _.$app.pushOnetimeHook("afterModifyDOM", () => {
        containerRef.current!.$mainEl!.node.style.width = `${
          rootRef.current!.$mainEl!.node.clientWidth
        }px`;
      });
    }

    const selectOption = (index: number) => {
      if (index === -1 || rootDisabled || disabledOptions.has(index)) {
        return;
      }
      const option = getD(optionsValue[index]);
      _.$setD(selected, option);
      this.$fire(option);
    };

    dropdownStyles.root(appearance, rootDisabled, false)(_);
    _.$ref(rootRef) &&
      _._div({}, _ => {
        dropdownStyles.button(
          selectedValue === "" && placeholder !== undefined,
          rootDisabled,
        )(_);
        _.$ref(buttonEl, targetRef) &&
          _._button(
            {
              onblur: () => {
                if (!ignoreNextBlur) {
                  open = false;
                }
                ignoreNextBlur = false;
                _.$update();
              },
              onclick: () => {
                open = !open;
                _.$update();
              },
              onfocus: () => {
                _.$update();
              },
              onkeydown: ev => {
                const action = getDropdownActionFromKey(ev, open);
                const maxIndex = optionsValue.length - 1;
                let newIndex = activeIndex;

                switch (action) {
                  case "Open":
                    ev.preventDefault();
                    focusVisible = true;
                    open = true;
                    break;
                  case "Close":
                    // stop propagation for escape key to avoid dismissing any parent popups
                    ev.stopPropagation();
                    ev.preventDefault();
                    open = false;
                    break;
                  case "CloseSelect":
                    if (!disabledOptions.has(activeIndex)) {
                      open = false;
                    }
                  // fallthrough
                  case "Select":
                    activeIndex !== -1 && selectOption(activeIndex);
                    ev.preventDefault();
                    break;
                  case "Tab":
                    activeIndex !== -1 && selectOption(activeIndex);
                    break;
                  default:
                    newIndex = getIndexFromAction(
                      action,
                      activeIndex,
                      maxIndex,
                    );
                }

                if (newIndex !== activeIndex) {
                  // prevent default page scroll/keyboard action if the index changed
                  ev.preventDefault();
                  activeIndex = newIndex;
                  focusVisible = true;
                }
                _.$update();
              },
              onmouseover: () => {
                focusVisible = false;
                _.$update();
              },
            },
            _ => {
              _.t(
                selectedValue === "" ? placeholderValue ?? "" : selectedValue,
              );

              dropdownStyles.expandIcon(rootDisabled)(_);
              _._span({}, _ => _.fiChevronDownRegular());
            },
          );
        if (open) {
          _.fPortal(
            _ =>
              dropdownStyles.listbox(_) &&
              listboxStyles.root(_) &&
              _.$ref(containerRef) &&
              _._div(
                {
                  onclick: () => {
                    buttonEl.current!.node.focus();
                    _.$update();
                  },
                  onmouseover: () => {
                    focusVisible = false;
                    _.$update();
                  },
                  onmousedown: () => {
                    ignoreNextBlur = true;
                    _.$update();
                  },
                  onkeydown: ev => {
                    const action = getDropdownActionFromKey(ev, open);
                    const maxIndex = optionsValue.length - 1;
                    let newIndex = activeIndex;

                    switch (action) {
                      case "Select":
                      case "CloseSelect":
                        activeIndex !== -1 && selectOption(activeIndex);
                        break;
                      default:
                        newIndex = getIndexFromAction(
                          action,
                          activeIndex,
                          maxIndex,
                        );
                    }

                    if (newIndex !== activeIndex) {
                      // prevent default page scroll/keyboard action if the index changed
                      ev.preventDefault();
                      activeIndex = newIndex;
                      focusVisible = true;
                    }
                    _.$update();
                  },
                },
                _ =>
                  _.for(options, bySelf, (option, index) => {
                    const optionValue = getD(option);
                    const active = index === activeIndex;
                    const selected = optionValue === selectedValue;
                    const optionDisabled = disabledOptions.has(index);
                    optionStyles.root(
                      active,
                      focusVisible,
                      optionDisabled,
                      selected,
                    )(_);
                    _._div(
                      {
                        onclick: ev => {
                          if (optionDisabled) {
                            ev.preventDefault();
                          } else {
                            open = false;
                          }
                          activeIndex = index;
                          selectOption(index);
                          _.$update();
                        },
                      },
                      _ => {
                        optionStyles.checkIcon(
                          optionDisabled,
                          selected,
                          false,
                        )(_);
                        _.fiCheckmarkFilled();
                        _.t(optionValue);
                      },
                    );
                  }),
              ),
          );
        }
      });
  };
};

declare module "refina" {
  interface Components {
    fUnderlineDropdown<OptionValue extends string>(
      selected: D<OptionValue | "">,
      options: DArray<OptionValue>,
      disabled?: D<boolean | D<boolean>[]>,
      placeholder?: D<string>,
    ): this is {
      $ev: OptionValue;
    };
  }
}
FluentUI.triggerComponents.fUnderlineDropdown = function (_) {
  return (selected, options, disabled, placeholder) => {
    _.fDropdown(selected, options, disabled, placeholder, "underline");
  };
};
