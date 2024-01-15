export default {
  TEXT_NODE_TAGFUNC: /\b_\s*\.\s*t\s*`(.*?)`/g,
  COMPONENT_FUNC: /\b_\s*\.\s*([a-zA-Z0-9_]+)\s*(?:\<([\s\S]+?)\>)?\s*\(/g,
  DIRECT_CALL: /(?<![.$_#a-zA-Z0-9])_\s*\(\s*([^{]+?)\s*\)(?![{])/g,
};
