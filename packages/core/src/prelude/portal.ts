import { $contextFunc, _ } from "../context";
import { Content, DOMPortalComponent } from "../dom";

export const portal = $contextFunc(ckey =>
  /**
   * Render content to the end of the root element.
   *
   * This is usefull when you want to render a dialog or a tooltip
   *  that should not be affected by the parent element's styles.
   */
  (children: Content): void => {
    let portal = _.$lowlevel.$$currentRefNode[ckey] as
      | DOMPortalComponent
      | undefined;
    if (!portal) {
      portal = new DOMPortalComponent(_.$app.root.node);
      _.$lowlevel.$$currentRefNode[ckey] = portal;
    }

    const updateContext = _.$updateContext?.$lowlevel;
    if (updateContext) {
      updateContext.$$fulfillRef(portal);

      updateContext.$app.root.pendingPortals.push(portal);

      updateContext.$$updateDOMContent(portal, children);
    } else {
      const recvContext = _.$recvContext!.$lowlevel;

      recvContext.$$processDOMElement(ckey, children);
    }
  },
);
