import { defineStyles, makeStyles } from "@refina/griffel";

const portalMountNodeStyles = makeStyles({
  root: {
    // Creates new stacking context to prevent z-index issues
    // https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context
    //
    // Also keeps a portal on top of a page to prevent scrollbars from appearing
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,

    zIndex: 1000000,
  },
});

export default () =>
  defineStyles({
    root: [portalMountNodeStyles.root],
  });
