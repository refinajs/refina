export default {
  TEXT_NODE_TAGFUNC: /(?<![_$#a-zA-Z0-9])_\s*\.\s*t\s*`(.*?)`/g,
  COMPONENT_FUNC:
    /(?<![_$#a-zA-Z0-9])_\s*\.\s*([a-zA-Z0-9_]+)\s*(?:\<([\s\S]+?)\>)?\s*\(/g,
  DIRECT_CALL: /(?<![_$#a-zA-Z0-9])_\s*\(\s*([^{)]+?)\s*\)(?!\s*[{])/g,
};
