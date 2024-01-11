import { TextField } from "mdui";
import { HTMLElementComponent, Model, ref, valueOf } from "refina";
import MdUI from "../plugin";

export type TextFieldVariant = TextField["variant"];
declare module "refina" {
  interface Components {
    mdTextField(
      value: Model<string>,
      label?: string,
      disabled?: boolean,
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
        value: valueOf(value),
        label,
        disabled,
        variant: varient,
        oninput: () => {
          const newValue = inputRef.current!.node.value;
          _.$updateModel(value, newValue);
          this.$fire(newValue);
        },
      });
  };
};

declare module "refina" {
  interface Components {
    mdOutlinedTextField(
      value: Model<string>,
      label?: string,
      disabled?: boolean,
    ): this is {
      $ev: string;
    };
  }
}
MdUI.triggerComponents.mdOutlinedTextField = function (_) {
  return (value, label) =>
    _.mdTextField(value, label, false, "outlined") && this.$fire(_.$ev);
};

declare module "refina" {
  interface Components {
    mdPasswordInput(
      value: Model<string>,
      label?: string,
      disabled?: boolean,
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
        value: valueOf(value),
        label,
        disabled,
        variant: varient,
        type: "password",
        togglePassword: true,
        oninput: () => {
          const newValue = inputRef.current!.node.value;
          _.$updateModel(value, newValue);
          this.$fire(newValue);
        },
      });
  };
};

declare module "refina" {
  interface Components {
    mdOutlinedPasswordInput(
      value: Model<string>,
      label?: string,
      disabled?: boolean,
    ): this is {
      $ev: string;
    };
  }
}
MdUI.triggerComponents.mdOutlinedPasswordInput = function (_) {
  return (value, label) =>
    _.mdPasswordInput(value, label, false, "outlined") && this.$fire(_.$ev);
};

declare module "refina" {
  interface Components {
    MdTextareaProps: {
      rows: number | [min?: number, max?: number];
    };
    mdTextarea(
      value: Model<string>,
      label?: string,
      disabled?: boolean,
      varient?: TextFieldVariant,
    ): this is {
      $ev: string;
    };
  }
}
MdUI.triggerComponents.mdTextarea = function (_) {
  const inputRef = ref<HTMLElementComponent<"mdui-text-field">>();
  return (value, label, disabled = false, varient = "filled") => {
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
        value: valueOf(value),
        label,
        disabled,
        variant: varient,
        ...rowsProps,
        oninput: () => {
          const newValue = inputRef.current!.node.value;
          _.$updateModel(value, newValue);
          this.$fire(newValue);
        },
      });
  };
};

declare module "refina" {
  interface Components {
    mdOutlinedTextarea(
      value: Model<string>,
      label?: string,
      disabled?: boolean,
    ): this is {
      $ev: string;
    };
  }
}
MdUI.triggerComponents.mdOutlinedTextarea = function (_) {
  return (value, label) =>
    _.mdTextarea(value, label, false, "outlined") && this.$fire(_.$ev);
};
