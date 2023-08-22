export * from "./rCheckbox.r";
export * from "./rForm.r";
export * from "./rTextField.r";

export function formData<T extends object>(defaultValue: Partial<T> = {}): T {
  return defaultValue as T;
}
