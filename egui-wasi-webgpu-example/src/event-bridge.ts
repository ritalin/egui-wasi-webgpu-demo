import type {
  EventCopy,
  EventCut,
  EventPaste,
  HistoryOps,
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

  static bind(canvas: HTMLCanvasElement, editHost: HTMLElement, callback: (events: DispatchEvent[]) => any) {
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

    const editContext = editHost.editContext;

    canvas.addEventListener("keydown", async (ev) => {
      if (ev.isComposing) return;

      const combo = keyCombinationType(ev);
      console.log("DOM-event/keydown", combo);

      if (combo) {
        switch (combo.tag) {
          case "clipboard": {
            enterDOMOnputMode(editHost);
            return;
          }
          case "history": {
            ev.preventDefault();
            callback([{ tag: combo.tag, val: combo.type }]);
            return;
          }
        }
      }

      restoreEditMode(editHost, editContext);
      console.log("DOM-event/keydown - edditable?", editHost.contentEditable);

      const modifiers = makeModifierOptions(ev);
      const payload = makeKeyEvent(ev);
      if (!payload) return;

      console.log("DOM-event/keydown - special-keys");
      const options: KeyOptions = { repeat: ev.repeat };

      if (ev.key == "Escape") {
        callback([modifiers, { tag: "key-down", val: [payload, options] }]);
        return;
      }

      ev.preventDefault();
      callback([modifiers, { tag: "key-down", val: [payload, options] }]);
    });
    canvas.addEventListener("keyup", (ev) => {
      console.log("DOM-event/keyup");
      if (ev.isComposing) return;
      if (keyCombinationType(ev)) return;

      const modifiers = makeModifierOptions(ev);
      const payload = makeKeyEvent(ev);
      if (!payload) return;

      console.log("DOM-event/keyup - special-keys");

      if (ev.key == "Escape") {
        callback([modifiers, { tag: "key-up", val: payload }]);
        return;
      }

      ev.preventDefault();
      callback([modifiers, { tag: "key-up", val: payload }]);
    });

    canvas.addEventListener("beforeinput", (ev) => {
      console.info("beforeinput", ev.inputType);
      switch (ev.inputType) {
        case "historyUndo": {
          ev.preventDefault();
          callback([{ tag: "history", val: "undo" }]);
          break;
        }
        case "historyRedo": {
          ev.preventDefault();
          callback([{ tag: "history", val: "redo" }]);
          break;
        }
        case "insertText": {
          if (ev.data) {
            ev.preventDefault();
            callback([{ tag: "update-composition-state", val: { tag: "commit", val: ev.data } }]);
          }
          break;
        }
      }
    });

    canvas.addEventListener(
      "copy",
      (ev) => {
        ev.preventDefault();
        callback([
          {
            tag: "copy",
          },
        ]);
      },
      { capture: true },
    );
    canvas.addEventListener("cut", (ev) => {
      console.log("DOM-event/cut");
      ev.preventDefault();
      callback([
        {
          tag: "cut",
        },
      ]);
    });
    canvas.addEventListener(
      "paste",
      (ev) => {
        console.log("DOM-event/paste#2");
        ev.preventDefault();
        const data = ev.clipboardData?.getData("text/plain");
        if (data == undefined) return;

        callback([
          {
            tag: "paste",
            val: data,
          },
        ]);
      },
      { capture: true },
    );
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

type ClipboardEventType = (EventCut | EventCopy | EventPaste)["tag"];
type KeyCombinationType = { tag: "clipboard"; type: ClipboardEventType } | { tag: "history"; type: HistoryOps };

const isMac = /Mac|iPhone|iPod|iPad/.test(navigator.platform);

function keyCombinationType(ev: KeyboardEvent): KeyCombinationType | undefined {
  const hasModifier = isMac ? ev.metaKey : ev.ctrlKey;
  if (!hasModifier) return undefined;

  switch (ev.key.toLowerCase()) {
    case "x":
      return { tag: "clipboard", type: "cut" };
    case "c":
      return { tag: "clipboard", type: "copy" };
    case "v":
      return { tag: "clipboard", type: "paste" };
    case "z": {
      return { tag: "history", type: ev.shiftKey ? "redo" : "undo" };
    }
    default:
      return undefined;
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

function enterDOMOnputMode(editHost: HTMLElement) {
  if (editHost.editContext) {
    editHost.editContext = undefined;
    editHost.removeAttribute("contentEditable");
  }
}

export function restoreEditMode(editHost: HTMLElement, editContext: EditContext | undefined) {
  if (!editHost.editContext) {
    editHost.editContext = editContext;
    editHost.contentEditable = "true";
  }
}
