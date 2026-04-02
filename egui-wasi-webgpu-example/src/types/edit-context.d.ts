declare global {
  interface EditContext {
    // Sync with text content on egui
    updateText(rangeStart: number, rangeEnd: number, text: string): void;
    // Sync with selection range on egui
    updateSelection(start: number, end: number): void;
    // Update IME window displaying range
    updateControlBounds(controlBounds: DOMRect): void;
    // Update IME window position
    updateSelectionBounds(selectionBounds: DOMRect): void;
    // Update Preedit bounds
    updateCharacterBounds(rangeStart: number, characterBounds: DOMRect[]): void;
    // Handle event
    addEventListener(type: "compositionstart", listener: (ev: CompositionEvent) => void): void;
    addEventListener(type: "textupdate", listener: (ev: TextUpdateEvent) => void): void;
    addEventListener(type: "textformatupdate", listener: (ev: TextFormatUpdateEvent) => void): void;
    addEventListener(type: "characterboundsupdate", listener: (ev: CharacterBoundsUpdateEvent) => void): void;
    addEventListener(type: "compositionend", listener: (ev: CompositionEvent) => void): void;
    // current text
    text: string;
    readonly selectionStart: number;
    readonly selectionEnd: number;
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

  interface TextFormatUpdateEvent extends Event {
    getTextFormats(): TextFormat[];
  }

  interface TextFormat {
    // An offset that respresents the position before the first codepoint that should be decorated.
    readonly rangeStart: number;
    // An offset that respresents the position after the last codepoint that should be decorated.
    readonly rangeEnd: number;
    // The preferred underline style of the decorated text range.
    readonly underlineStyle: UnderlineStyle;
    // The preferred underline thickness of the decorated text range.
    readonly underlineThickness: UnderlineThickness;
  }

  type UnderlineStyle = "none" | "solid" | "dotted" | "dashed" | "wavy";
  type UnderlineThickness = "none" | "thin" | "thick";

  interface CharacterBoundsUpdateEvent extends Event {
    // The start position of the range where the character bounds are needed by Text Input Service
    readonly rangeStart: number;
    // The end position of the range where the character bounds are needed by Text Input Service
    readonly rangeEnd: number;
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
