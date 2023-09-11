export function matchPath(path: string, currentPath: string) {
  const params: Record<string, string> = {};
  let j = 0;
  for (let i = 0; i < path.length; i++) {
    if (path[i] === ":") {
      let paramName = "";
      while (++i < path.length && path[i] !== "/") {
        paramName += path[i];
      }

      let paramValue = "";
      while (j < currentPath.length && currentPath[j] !== "/") {
        paramValue += currentPath[j];
        j++;
      }

      params[paramName] = paramValue;
    } else {
      if (path[i] !== currentPath[j]) {
        return false;
      }
      j++;
    }
  }
  if (j !== currentPath.length) {
    return false;
  }
  return params;
}
