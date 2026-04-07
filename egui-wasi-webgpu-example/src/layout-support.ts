export function fixElementSize(el: HTMLElement, is_vertical: boolean): { width: number; height: number } {
  const parent = el.parentElement;
  if (!parent) {
    console.log("fixElementSize/root", `tag: ${el.tagName}`, is_vertical ? window.innerHeight : window.innerWidth);
    return { width: window.innerWidth, height: window.innerHeight };
  }

  const parentSize = fixElementSize(parent, is_vertical);

  const left = Array.from(parent.children)
    .filter((c) => c != el)
    .reduce((acc, c) => {
      const bounds = c.getBoundingClientRect();
      const styles = getComputedStyle(c);

      const vmargin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
      const hmargin = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);

      if (is_vertical) {
        return { width: acc.width - hmargin, height: acc.height - (bounds.height + vmargin) };
      } else {
        return { width: acc.width - (bounds.width + hmargin), height: acc.height - vmargin };
      }
    }, parentSize);

  const styles = getComputedStyle(el);
  const margins: Insets = {
    left: parseFloat(styles.marginLeft) || 0,
    top: parseFloat(styles.marginTop) || 0,
    right: parseFloat(styles.marginRight) || 0,
    bottom: parseFloat(styles.marginBottom) || 0,
  };
  const paddings: Insets = {
    left: parseFloat(styles.paddingLeft) || 0,
    top: parseFloat(styles.paddingTop) || 0,
    right: parseFloat(styles.paddingRight) || 0,
    bottom: parseFloat(styles.paddingBottom) || 0,
  };

  console.log(
    "fixElementSize",
    `tag: ${el.tagName}`,
    `id/classes: ${el.id}/${el.className}`,
    `align: ${is_vertical ? "vertical" : "horizontal"}`,
    `value/width: ${left.width}, height: ${left.height}`,
    `margin/top: ${margins.top}, bottom: ${margins.bottom}`,
    `padding/top: ${paddings.top}, bottom: ${paddings.bottom}`,
  );

  const elementSize = {
    width: Math.max(left.width - margins.left - margins.right - paddings.left - paddings.right, 0),
    height: Math.max(left.height - margins.top - margins.bottom - paddings.top - paddings.bottom, 0),
  };
  el.style.height = `${elementSize.height}px`;
  el.style.width = `${elementSize.width}px`;

  return elementSize;
}

type Insets = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};
