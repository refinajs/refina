import * as keys from "@fluentui/keyboard-keys";
import { FiCheckmarkFilled } from "@refina/fluentui-icons/checkmark";
import { FiChevronDownRegular } from "@refina/fluentui-icons/chevronDown";
import {
  HTMLElementComponent,
  Model,
  TriggerComponent,
  _,
  bySelf,
  elementRef,
  ref,
  unwrap,
} from "refina";
import { usePositioning } from "../../positioning";
import { FPortal } from "../portal";
import useListboxStyles from "./listbox.styles";
import useOptionStyles from "./option.styles";
import useDropdownStyles from "./styles";
import { FDropdownAppearance } from "./types";

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

export class FDropdown<OptionValue extends string> extends TriggerComponent {
  appearance: FDropdownAppearance = "outline";
  activeIndex = 0;
  focusVisible = false;
  ignoreNextBlur = false;
  open = false;
  buttonEl = elementRef<"button">();

  $main(
    selected: Model<OptionValue | "">,
    options: OptionValue[],
    disabled: boolean | boolean[] = false,
    placeholder?: string,
  ): this is {
    $ev: OptionValue;
  } {
    const selectedValue = unwrap(selected);

    const rootDisabled = typeof disabled === "boolean" ? disabled : false;
    const disabledOptions =
      typeof disabled === "boolean"
        ? new Set<number>()
        : new Set(disabled.map((v, i) => (v ? i : -1)));

    const rootRef = ref<HTMLElementComponent<"div">>();
    const { targetRef, containerRef } = _(usePositioning)(
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
      this.open,
    );

    if (this.open) {
      _.$app.pushOnetimeHook("afterModifyDOM", () => {
        containerRef.current!.$primaryEl!.node.style.width = `${
          rootRef.current!.$primaryEl!.node.clientWidth
        }px`;
      });
    }

    const selectOption = (index: number) => {
      if (index === -1 || rootDisabled || disabledOptions.has(index)) {
        return;
      }
      const option = options[index];
      this.$updateModel(selected, option);
      this.$fire(option);
    };

    const dropdownStyles = useDropdownStyles(
      this.appearance,
      rootDisabled,
      false,
      selectedValue === "" && placeholder !== undefined,
    );

    dropdownStyles.root();
    _.$ref(rootRef) &&
      _._div({}, _ => {
        dropdownStyles.button();
        _.$ref(this.buttonEl, targetRef) &&
          _._button(
            {
              onblur: () => {
                if (!this.ignoreNextBlur) {
                  this.open = false;
                }
                this.ignoreNextBlur = false;
                this.$update();
              },
              onclick: () => {
                this.open = !this.open;
                this.$update();
              },
              onfocus: () => {
                this.$update();
              },
              onkeydown: ev => {
                const action = getDropdownActionFromKey(ev, this.open);
                const maxIndex = options.length - 1;
                let newIndex = this.activeIndex;

                switch (action) {
                  case "Open":
                    ev.preventDefault();
                    this.focusVisible = true;
                    this.open = true;
                    break;
                  case "Close":
                    // stop propagation for escape key to avoid dismissing any parent popups
                    ev.stopPropagation();
                    ev.preventDefault();
                    this.open = false;
                    break;
                  case "CloseSelect":
                    if (!disabledOptions.has(this.activeIndex)) {
                      this.open = false;
                    }
                  // fallthrough
                  case "Select":
                    this.activeIndex !== -1 && selectOption(this.activeIndex);
                    ev.preventDefault();
                    break;
                  case "Tab":
                    this.activeIndex !== -1 && selectOption(this.activeIndex);
                    break;
                  default:
                    newIndex = getIndexFromAction(
                      action,
                      this.activeIndex,
                      maxIndex,
                    );
                }

                if (newIndex !== this.activeIndex) {
                  // prevent default page scroll/keyboard action if the index changed
                  ev.preventDefault();
                  this.activeIndex = newIndex;
                  this.focusVisible = true;
                }
                this.$update();
              },
              onmouseover: () => {
                this.focusVisible = false;
                this.$update();
              },
            },
            _ => {
              _.t(selectedValue === "" ? placeholder ?? "" : selectedValue);

              dropdownStyles.expandIcon();
              _._span({}, _ => _(FiChevronDownRegular)());
            },
          );
        if (this.open) {
          const listboxStyles = useListboxStyles();

          _(FPortal)(
            _ =>
              dropdownStyles.listbox() &&
              listboxStyles.root() &&
              _.$ref(containerRef) &&
              _._div(
                {
                  onclick: () => {
                    this.buttonEl.current!.node.focus();
                    this.$update();
                  },
                  onmouseover: () => {
                    this.focusVisible = false;
                    this.$update();
                  },
                  onmousedown: () => {
                    this.ignoreNextBlur = true;
                    this.$update();
                  },
                  onkeydown: ev => {
                    const action = getDropdownActionFromKey(ev, this.open);
                    const maxIndex = options.length - 1;
                    let newIndex = this.activeIndex;

                    switch (action) {
                      case "Select":
                      case "CloseSelect":
                        this.activeIndex !== -1 &&
                          selectOption(this.activeIndex);
                        break;
                      default:
                        newIndex = getIndexFromAction(
                          action,
                          this.activeIndex,
                          maxIndex,
                        );
                    }

                    if (newIndex !== this.activeIndex) {
                      // prevent default page scroll/keyboard action if the index changed
                      ev.preventDefault();
                      this.activeIndex = newIndex;
                      this.focusVisible = true;
                    }
                    this.$update();
                  },
                },
                _ =>
                  _.for(options, bySelf, (option, index) => {
                    const active = index === this.activeIndex;
                    const selected = option === selectedValue;
                    const optionDisabled = disabledOptions.has(index);

                    const optionStyles = useOptionStyles(
                      active,
                      this.focusVisible,
                      optionDisabled,
                      selected,
                      false,
                    );

                    optionStyles.root();
                    _._div(
                      {
                        onclick: ev => {
                          if (optionDisabled) {
                            ev.preventDefault();
                          } else {
                            this.open = false;
                          }
                          this.activeIndex = index;
                          selectOption(index);
                          this.$update();
                        },
                      },
                      _ => {
                        optionStyles.checkIcon();
                        _(FiCheckmarkFilled)();
                        _.t(option);
                      },
                    );
                  }),
              ),
          );
        }
      });
    return this.$fired;
  }
}

export class FUnderlineDropdown<
  OptionValue extends string,
> extends FDropdown<OptionValue> {
  appearance = "underline" as const;
}

export * from "./types";
