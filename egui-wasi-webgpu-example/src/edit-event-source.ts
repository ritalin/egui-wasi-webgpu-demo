import type { CompositionBounds } from "pkg/interfaces/local-immediate-renderer-example-interaction";

export class EditEventSource {
  #editHost: HTMLCanvasElement;
  #context: globalThis.EditContext;
  ontextupdate?: (event: TextUpdateEvent) => any;
  oncompositionstart?: () => any;
  oncompositionend?: (event: TextUpdateEvent) => any;

  constructor(canvas: HTMLCanvasElement) {
    const editContext = new EditContext();
    canvas.contentEditable = "true";
    canvas.tabIndex = 0;
    canvas.editContext = editContext;

    this.#editHost = canvas;
    this.#context = editContext;
    this.ontextupdate = undefined;
    this.oncompositionstart = undefined;
    this.oncompositionend = undefined;
    this.attachEvents();
  }

  get editHost(): HTMLCanvasElement {
    return this.#editHost;
  }

  get text(): string {
    return this.#context.text;
  }
  enterDOMOnputMode() {
    if (this.#editHost.editContext) {
      this.#editHost.editContext = undefined;
      this.#editHost.removeAttribute("contentEditable");
    }
  }

  restoreEditMode() {
    if (!this.#editHost.editContext) {
      this.#editHost.editContext = this.#context;
      this.#editHost.contentEditable = "true";
    }
  }

  updateText(selectionStart: number, selectionEnd: number, text: string) {
    console.debug(
      "EditEventSource::updateText",
      `context/text: ${this.#context.text}, start: ${this.#context.selectionStart}, end: ${this.#context.selectionEnd}`,
      `event/text: ${text}, start: ${selectionStart}, end: ${selectionEnd}`,
    );
  }

  updateCompositionBounds(bounds: CompositionBounds) {
    // console.log(
    //   `composition-bounds/new: (left: ${bounds.left}, top: ${bounds.top}, width: ${bounds.width}, height: ${bounds.height}`,
    // );
    const boundingRect = this.#editHost.getBoundingClientRect();

    // console.log(
    //   `bounding-rect/new: (left: ${boundingRect.left}, top: ${boundingRect.top}, width: ${boundingRect.width}, height: ${boundingRect.height}`,
    // );

    bounds.left += boundingRect.left;
    bounds.top += boundingRect.top;

    this.#context.updateSelectionBounds(new DOMRect(bounds.left, bounds.top, bounds.width, bounds.height));
  }

  private attachEvents() {
    this.#context.addEventListener("compositionstart", (_ev) => {
      // reset changes
      this.#context.updateText(0, this.#context.text.length, "");

      if (this.oncompositionstart) {
        this.oncompositionstart();
      }
    });
    this.#context.addEventListener("textupdate", (ev) => {
      console.debug(
        "textupdate:before",
        `context/text: ${this.#context.text}, start: ${this.#context.selectionStart}, end: ${this.#context.selectionEnd}`,
        `ev/text: ${ev.text}`,
      );

      if (this.ontextupdate) {
        this.ontextupdate({ text: ev.text });
      }
    });
    this.#context.addEventListener("compositionend", (ev) => {
      // reset changes
      this.#context.updateText(0, this.#context.text.length, "");
      console.debug(
        "**** compositionend",
        `ev/text: ${ev.data}`,
        `context/text: ${this.#context.text}, start: ${this.#context.selectionStart}, end: ${this.#context.selectionEnd}`,
      );
      if (this.oncompositionend) {
        this.oncompositionend({ text: ev.data });
      }
    });
  }
}

export type TextUpdateEvent = {
  text: string;
};
