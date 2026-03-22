import type {
  Keys as KeyEventPayload,
  KeyOptions,
  ModifierOptions,
} from "pkg/interfaces/local-immediate-renderer-types";
import type { Route } from "./command-handler";
import type { Event as DispatchEvent } from "pkg/interfaces/local-immediate-renderer-example-render";

export class DomEventBridge {
  static findCanvas(route: Route): HTMLCanvasElement | undefined {
    let id;
    switch (route) {
      case "route://app/main": {
        id = "#main-window";
        break;
      }
    }

    const canvas = document.querySelector(id);
    if (canvas instanceof HTMLCanvasElement) {
      return canvas;
    }

    return undefined;
  }

  static bind(canvas: HTMLCanvasElement, callback: (events: DispatchEvent[]) => any) {
    canvas.addEventListener("pointerdown", (ev) => {
      const rect = canvas.getBoundingClientRect();
      callback([
        makeModifierOptions(ev),
        {
          tag: "pointer",
          val: { x: ev.clientX - rect.left, y: ev.clientY - rect.top },
        },
        {
          tag: "mouse-down",
          val: "left",
        },
      ]);
    });
    canvas.addEventListener("pointerup", (ev) => {
      const rect = canvas.getBoundingClientRect();
      callback([
        makeModifierOptions(ev),
        {
          tag: "pointer",
          val: { x: ev.clientX - rect.left, y: ev.clientY - rect.top },
        },
        {
          tag: "mouse-up",
          val: "left",
        },
      ]);
    });
    canvas.addEventListener("pointermove", (ev) => {
      const rect = canvas.getBoundingClientRect();
      callback([
        makeModifierOptions(ev),
        {
          tag: "pointer",
          val: { x: ev.clientX - rect.left, y: ev.clientY - rect.top },
        },
        {
          tag: "mouse-move",
        },
      ]);
    });
    canvas.addEventListener("keydown", (ev) => {
      if (ev.isComposing) return;
      if (isClipboardOperation(ev)) return;

      const modifiers = makeModifierOptions(ev);
      const payload = makeKeyEvent(ev);
      if (!payload) return;

      const options: KeyOptions = { repeat: ev.repeat };

      if (ev.key == "Escape") {
        callback([modifiers, { tag: "key-down", val: [payload, options] }]);
        return;
      }

      ev.preventDefault();
      callback([modifiers, { tag: "key-down", val: [payload, options] }]);
    });
    canvas.addEventListener("keyup", (ev) => {
      if (ev.isComposing) return;
      if (isClipboardOperation(ev)) return;

      const modifiers = makeModifierOptions(ev);
      const payload = makeKeyEvent(ev);
      if (!payload) return;

      if (ev.key == "Escape") {
        callback([modifiers, { tag: "key-up", val: payload }]);
        return;
      }

      ev.preventDefault();
      callback([modifiers, { tag: "key-up", val: payload }]);
    });
    canvas.addEventListener("copy", (ev) => {
      ev.preventDefault();
      callback([
        {
          tag: "copy",
        },
      ]);
    });
    canvas.addEventListener("cut", (ev) => {
      ev.preventDefault();
      callback([
        {
          tag: "cut",
        },
      ]);
    });
    canvas.addEventListener("paste", (ev) => {
      ev.preventDefault();
      const data = ev.clipboardData?.getData("text/plain");
      if (data == undefined) return;

      callback([
        {
          tag: "paste",
          val: data,
        },
      ]);
    });
  }

  static show(canvas: HTMLCanvasElement) {
    const dialog = canvas.parentElement as HTMLDialogElement;
    dialog.showModal();
  }
}

type ModifierKeys = Pick<MouseEvent | KeyboardEvent, "ctrlKey" | "shiftKey" | "altKey" | "metaKey">;

function makeModifierOptions(ev: ModifierKeys): DispatchEvent {
  const modifiers: ModifierOptions = {
    ctrl: { left: ev.ctrlKey },
    shift: { left: ev.shiftKey },
    alt: { left: ev.altKey },
    superKey: { left: ev.metaKey },
  };

  return { tag: "modifiers", val: modifiers };
}

function isClipboardOperation(ev: KeyboardEvent): boolean {
  if (!ev.ctrlKey) return false;

  switch (ev.key.toLowerCase()) {
    case "x":
    case "c":
    case "v":
      return true;
    default:
      return false;
  }
}

function makeKeyEvent(ev: KeyboardEvent): KeyEventPayload | undefined {
  switch (ev.key) {
    case "Enter":
      return { tag: "whitespace", val: "enter" };
    case "Tab":
      return { tag: "whitespace", val: "tab" };
    case " ":
      return { tag: "whitespace", val: "space" };
    case "Backspace":
      return { tag: "edit", val: "backspace" };
    case "Delete":
      return { tag: "edit", val: "delete" };
    case "Escape":
      return { tag: "ui", val: "escape" };
    case "ArrowDown":
      return { tag: "navi", val: "arrow-down" };
    case "ArrowLeft":
      return { tag: "navi", val: "arrow-left" };
    case "ArrowRight":
      return { tag: "navi", val: "arrow-right" };
    case "ArrowUp":
      return { tag: "navi", val: "arrow-up" };
    default:
      return undefined;
  }
}
