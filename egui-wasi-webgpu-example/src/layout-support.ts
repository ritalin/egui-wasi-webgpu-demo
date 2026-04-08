export function fixElementSize(el: HTMLElement, is_vertical: boolean): { width: number; height: number } {
  const rect = fixElementSizeInternal(el, is_vertical);
  return { width: rect.width, height: rect.height };
}

function fixElementSizeInternal(el: HTMLElement, is_vertical: boolean): DOMRect {
  const parent = el.parentElement;
  if (!parent) {
    console.log("fixElementSize/root", `tag: ${el.tagName}`, is_vertical ? window.innerHeight : window.innerWidth);
    return new DOMRect(0, 0, window.innerWidth, window.innerHeight);
  }

  const parentSize = fixElementSizeInternal(parent, is_vertical);
  const rect = el.getBoundingClientRect();

  const elementRect = Array.from(parent.children)
    .filter((c) => c != el)
    .reduce((acc, c) => {
      const childRect = c.getBoundingClientRect();
      const styles = getComputedStyle(c);

      const marginTop = parseFloat(styles.marginTop) || 0;
      const marginBottom = parseFloat(styles.marginBottom) || 0;
      const marginLeft = parseFloat(styles.marginLeft) || 0;
      const marginRight = parseFloat(styles.marginRight) || 0;
      const accCopy = new DOMRect();

      if (is_vertical) {
        if (childRect.right <= rect.left) {
          accCopy.x = Math.max(childRect.right + marginRight, acc.x);
          accCopy.y = acc.y;
          accCopy.width = Math.min(acc.right - accCopy.x, acc.width);
          accCopy.height = acc.height;
        } else if (childRect.left >= rect.right) {
          accCopy.x = acc.x;
          accCopy.y = acc.y;
          accCopy.width = Math.min(childRect.left - marginLeft - accCopy.x, acc.width);
          accCopy.height = acc.height;
        } else if (childRect.bottom <= rect.top) {
          accCopy.x = acc.x;
          accCopy.y = Math.max(childRect.bottom + marginBottom, acc.y);
          accCopy.width = acc.width;
          accCopy.height = Math.min(acc.bottom - accCopy.y, acc.height);
        } else {
          accCopy.x = acc.x;
          accCopy.y = acc.y;
          accCopy.width = acc.width;
          accCopy.height = Math.min(childRect.top - marginTop - accCopy.y, acc.height);
        }
      } else {
        if (childRect.right <= rect.left) {
          accCopy.x = Math.max(childRect.right + marginRight, acc.x);
          accCopy.y = acc.y;
          accCopy.width = Math.min(acc.right - accCopy.x, acc.width);
          accCopy.height = acc.height;
        } else if (childRect.left >= rect.right) {
          accCopy.x = acc.x;
          accCopy.y = acc.y;
          accCopy.width = Math.min(childRect.left - marginLeft, acc.width);
          accCopy.height = acc.height;
        } else if (childRect.bottom <= rect.top) {
          accCopy.x = acc.x;
          accCopy.y = Math.max(childRect.bottom + marginBottom, acc.y);
          accCopy.width = acc.width;
          accCopy.height = Math.min(acc.bottom - accCopy.y, acc.height);
        } else if (childRect.top >= rect.bottom) {
          accCopy.x = acc.x;
          accCopy.y = acc.y;
          accCopy.width = acc.width;
          accCopy.height = Math.min(childRect.top - marginTop, acc.height);
        }
      }

      return accCopy;
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

  elementRect.x -= margins.left + paddings.left;
  elementRect.y -= margins.top + paddings.top;
  elementRect.width = Math.max(elementRect.width - (margins.left + paddings.left + margins.right + paddings.right), 0);
  elementRect.height = Math.max(
    elementRect.height - (margins.top + paddings.top + margins.bottom + paddings.bottom),
    0,
  );

  el.style.width = `${elementRect.width}px`;
  el.style.height = `${elementRect.height}px`;

  return elementRect;
}

type Insets = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};
