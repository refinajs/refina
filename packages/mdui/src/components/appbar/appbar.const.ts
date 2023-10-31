export const appbarClassNameMap = {
  toolbar: "mdui-appbar-with-toolbar",
  tab: "mdui-appbar-with-tab",
  both: "mdui-appbar-with-tab-larger",
  neither: "",
} as const;

export type AppbarType = keyof typeof appbarClassNameMap;
