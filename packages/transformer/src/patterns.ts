export const TEXT_NODE_TAGFUNC = /\b_\s*\.\s*t\s*`(.*?)`/g;
export const COMPONENT_FUNC = /\b_\s*\.\s*([a-zA-Z0-9_]+)\s*\(/g;
export const COMPONENT_FUNC_WITH_TYPE_PARAMS =
  /\b_\s*\.\s*([a-zA-Z0-9_]+)\s*\<([\s\S]+?)\>\s*\(/g;
