export function fixElementSize(el: HTMLElement, is_vertical: boolean): { width: number; height: number } {
  const parent = el.parentElement;
  if (!parent) {
    console.log("fixElementSize/root", `tag: ${el.tagName}`, is_vertical ? window.innerHeight : window.innerWidth);
    return { width: window.innerWidth, height: window.innerHeight };
  }

  const parentSize = fixElementSize(parent, is_vertical);

  const left = Array.from(parent.children)
    .filter((c) => c != el)
    .map((c) => c.getBoundingClientRect())
    .reduce(
      (acc, v) =>
        is_vertical
          ? { width: acc.width, height: acc.height - v.height }
          : { width: acc.width - v.width, height: acc.height },
      parentSize,
    );

  console.log(
    "fixElementSize",
    `tag: ${el.tagName}`,
    `id/classes: ${el.id}/${el.className}`,
    `align: ${is_vertical ? "vertical" : "horizontal"}`,
    `value: ${left}`,
  );
  const elementSize = { width: Math.max(left.width, 0), height: Math.max(left.height, 0) };
  el.style.height = `${elementSize.height}px`;
  el.style.width = `${elementSize.width}px`;

  return elementSize;
}
