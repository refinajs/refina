import { RFormData } from "./base";

export * from "./rCheckbox.r";
export * from "./rForm.r";
export * from "./rPassword.r";
export * from "./rTextField.r";

export function formData<T extends RFormData>(
  defaultValue: Partial<T> = {},
): T {
  return defaultValue as T;
}
