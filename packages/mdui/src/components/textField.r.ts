import { TextField } from "mdui";
import { D, HTMLElementComponent, getD, ref } from "refina";
import MdUI from "../plugin";

export type TextFieldVariant = TextField["variant"];
declare module "refina" {
  interface Components {
    mdTextField(
      value: D<string>,
      label?: D<string>,
      disabled?: D<boolean>,
      varient?: TextFieldVariant,
    ): this is {
      $ev: string;
    };
  }
}
MdUI.triggerComponents.mdTextField = function (_) {
  const inputRef = ref<HTMLElementComponent<"mdui-text-field">>();
  return (value, label, disabled = false, varient = "filled") => {
    _.$ref(inputRef) &&
      _._mdui_text_field({
        value: getD(value),
        label: getD(label),
        disabled: getD(disabled),
        variant: varient,
        oninput: () => {
          const newValue = inputRef.current!.node.value;
          _.$setD(value, newValue);
          this.$fire(newValue);
        },
      });
  };
};

declare module "refina" {
  interface Components {
    mdOutlinedTextField(
      value: D<string>,
      label?: D<string>,
      disabled?: D<boolean>,
    ): this is {
      $ev: string;
    };
  }
}
MdUI.triggerComponents.mdOutlinedTextField = function (_) {
  return (value, label) => _.mdTextField(value, label, false, "outlined");
};

declare module "refina" {
  interface Components {
    mdPasswordInput(
      value: D<string>,
      label?: D<string>,
      disabled?: D<boolean>,
      varient?: TextFieldVariant,
    ): this is {
      $ev: string;
    };
  }
}
MdUI.triggerComponents.mdPasswordInput = function (_) {
  const inputRef = ref<HTMLElementComponent<"mdui-text-field">>();
  return (value, label, disabled = false, varient = "filled") => {
    _.$ref(inputRef) &&
      _._mdui_text_field({
        value: getD(value),
        label: getD(label),
        disabled: getD(disabled),
        variant: varient,
        type: "password",
        togglePassword: true,
        oninput: () => {
          const newValue = inputRef.current!.node.value;
          _.$setD(value, newValue);
          this.$fire(newValue);
        },
      });
  };
};

declare module "refina" {
  interface Components {
    mdOutlinedPasswordInput(
      value: D<string>,
      label?: D<string>,
      disabled?: D<boolean>,
    ): this is {
      $ev: string;
    };
  }
}
MdUI.triggerComponents.mdOutlinedPasswordInput = function (_) {
  return (value, label) => _.mdPasswordInput(value, label, false, "outlined");
};

declare module "refina" {
  interface Components {
    MdTextareaProps: {
      rows: number | [min?: number, max?: number];
    };
    mdTextarea(
      value: D<string>,
      label?: D<string>,
      disabled?: D<boolean>,
      varient?: TextFieldVariant,
    ): this is {
      $ev: string;
    };
  }
}
MdUI.triggerComponents.mdTextarea = function (_) {
  const inputRef = ref<HTMLElementComponent<"mdui-text-field">>();
  return (
    value: D<string>,
    label?: D<string>,
    disabled: D<boolean> = false,
    varient: TextFieldVariant = "filled",
  ) => {
    const rowsProps = Array.isArray(this.$props.rows)
      ? {
          autosize: true,
          minRows: this.$props.rows[0],
          maxRows: this.$props.rows[1],
        }
      : {
          rows: this.$props.rows ?? 3,
        };

    _.$ref(inputRef) &&
      _._mdui_text_field({
        value: getD(value),
        label: getD(label),
        disabled: getD(disabled),
        variant: varient,
        ...rowsProps,
        oninput: () => {
          const newValue = inputRef.current!.node.value;
          _.$setD(value, newValue);
          this.$fire(newValue);
        },
      });
  };
};

declare module "refina" {
  interface Components {
    mdOutlinedTextarea(
      value: D<string>,
      label?: D<string>,
      disabled?: D<boolean>,
    ): this is {
      $ev: string;
    };
  }
}
MdUI.triggerComponents.mdOutlinedTextarea = function (_) {
  return (value, label) => _.mdTextarea(value, label, false, "outlined");
};
