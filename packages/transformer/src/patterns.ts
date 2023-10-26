export const TEXT_NODE_TAGFUNC = /_\s*\.\s*t\s*`(.*?)`/g;
export const COMPONENT_FUNC = /_\s*\.\s*([a-zA-Z0-9_]+)\s*\(/g;
export const COMPONENT_FUNC_WITH_TYPE_PARAMS =
  /_\s*\.\s*([a-zA-Z0-9_]+)\s*\<([\s\S]+?)\>\s*\(/g;
