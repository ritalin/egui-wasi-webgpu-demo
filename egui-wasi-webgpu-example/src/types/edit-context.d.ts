declare global {
  interface EditContext extends EventTarget {
    // Sync with text content on egui
    updateText(rangeStart: number, rangeEnd: number, text: string): void;
    // Sync with selection range on egui
    updateSelection(start: number, end: number): void;
    // Show IME window
    updateControlBounds(controlBounds: DOMRect): void;
    // Update IME window position
    updateSelectionBounds(selectionBounds: DOMRect): void;
    // Handle event
    addEventListener(type: "textupdate", listener: (ev: TextUpdateEvent) => void): void;
    // current text
    text: string;
  }

  interface EditContextInit {
    text?: string;
    selectionStart?: number;
    selectionEnd?: number;
  }

  var EditContext: {
    prototype: EditContext;
    new (options?: EditContextInit): EditContext;
  };

  interface TextUpdateEvent extends Event {
    // The new string that is to replace the old string in the range.
    readonly text: string;
    // The start position of the range that is to be replaced.
    readonly updateRangeStart: number;
    // The end position of the range that is to be replaced.
    readonly updateRangeEnd: number;
    // The start position of the selection after the text replacement.
    readonly selectionStart: number;
    // The end position of the selection after the text replacement.
    readonly selectionEnd: number;
  }

  interface HTMLElement {
    editContext: EditContext | undefined;
  }

  interface Window {
    EditContext: {
      new (): EditContext;
    };
  }
}

export {};
