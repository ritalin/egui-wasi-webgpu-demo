import type {
  EventCopy,
  EventCut,
  EventPaste,
  HistoryOps,
  Keys as KeyEventPayload,
  KeyOptions,
  ModifierOptions,
  Event as DispatchEvent,
} from "./types/event/interfaces/local-immediate-renderer-types";
import type { Route } from "./command-handler";
import type { EditEventSource } from "./edit-event-source";

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

  static bind(eventSource: EditEventSource, callback: (events: DispatchEvent[]) => any) {
    eventSource.editHost.addEventListener("pointerdown", (ev) => {
      eventSource.editHost.setPointerCapture(ev.pointerId);

      const scaleFactor = window.devicePixelRatio;
      const rect = eventSource.editHost.getBoundingClientRect();

      callback([
        makeModifierOptions(ev),
        {
          tag: "viewport-bounds",
          val: [
            { left: rect.left * scaleFactor, top: rect.top * scaleFactor },
            { width: rect.width * scaleFactor, height: rect.height * scaleFactor },
          ],
        },
        {
          tag: "pointer",
          val: { left: ev.clientX * scaleFactor, top: ev.clientY * scaleFactor },
        },
        {
          tag: "mouse-down",
          val: "left",
        },
      ]);
    });
    eventSource.editHost.addEventListener("pointerup", (ev) => {
      eventSource.editHost.releasePointerCapture(ev.pointerId);

      const scaleFactor = window.devicePixelRatio;
      const rect = eventSource.editHost.getBoundingClientRect();

      callback([
        makeModifierOptions(ev),
        {
          tag: "viewport-bounds",
          val: [
            { left: rect.left * scaleFactor, top: rect.top * scaleFactor },
            { width: rect.width * scaleFactor, height: rect.height * scaleFactor },
          ],
        },
        {
          tag: "pointer",
          val: { left: ev.clientX * scaleFactor, top: ev.clientY * scaleFactor },
        },
        {
          tag: "mouse-up",
          val: "left",
        },
      ]);
    });
    eventSource.editHost.addEventListener("pointermove", (ev) => {
      const scaleFactor = window.devicePixelRatio;
      const rect = eventSource.editHost.getBoundingClientRect();

      callback([
        makeModifierOptions(ev),
        {
          tag: "viewport-bounds",
          val: [
            { left: rect.left * scaleFactor, top: rect.top * scaleFactor },
            { width: rect.width * scaleFactor, height: rect.height * scaleFactor },
          ],
        },
        {
          tag: "pointer",
          val: { left: ev.clientX * scaleFactor, top: ev.clientY * scaleFactor },
        },
        {
          tag: "mouse-move",
        },
      ]);
    });
    eventSource.editHost.addEventListener("wheel", (ev) => {
      ev.preventDefault();
      const scaleFactor = window.devicePixelRatio;
      const rect = eventSource.editHost.getBoundingClientRect();

      callback([
        makeModifierOptions(ev),
        {
          tag: "viewport-bounds",
          val: [
            { left: rect.left * scaleFactor, top: rect.top * scaleFactor },
            { width: rect.width * scaleFactor, height: rect.height * scaleFactor },
          ],
        },
        {
          tag: "pointer",
          val: { left: ev.clientX * scaleFactor, top: ev.clientY * scaleFactor },
        },
        {
          tag: "mouse-wheel",
          val: {
            deltaX: ev.deltaX,
            deltaY: ev.deltaY,
            wheelUnit: makeWheelUnit(ev.deltaMode),
          },
        },
      ]);
    });

    eventSource.editHost.addEventListener("keydown", async (ev) => {
      if (ev.isComposing) return;

      const combo = keyCombinationType(ev);
      console.log("DOM-event/keydown", combo, ev.code);

      if (combo) {
        switch (combo.tag) {
          case "clipboard": {
            eventSource.enterDOMOnputMode();
            return;
          }
          case "history": {
            ev.preventDefault();
            callback([{ tag: combo.tag, val: combo.type }]);
            return;
          }
        }
      }

      eventSource.restoreEditMode();
      console.log("DOM-event/keydown - edditable?", eventSource.editHost.contentEditable);

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
    eventSource.editHost.addEventListener("keyup", (ev) => {
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

    eventSource.oncompositionstart = () => {
      eventSource.restoreEditMode();
      console.log("composition/start", `state: ${eventSource.text}`);

      callback([
        { tag: "request-composition-bounds", val: { tag: "character-bounds", val: undefined } },
        { tag: "update-composition-state", val: { tag: "start" } },
      ]);
    };
    eventSource.ontextupdate = (ev) => {
      console.log("composition/update(rollbacked)", `state: ${eventSource.text}`);

      callback([
        {
          tag: "update-composition-state",
          val: { tag: "pre-edit", val: ev.text },
        },
        // {
        //   tag: "update-composition-state",
        //   val: { tag: "selection-range", val: { offset, len } },
        // },
      ]);
    };
    eventSource.oncompositionend = (ev) => {
      console.log("composition/oncompositionend", `state: ${ev.text}`);
      callback([{ tag: "update-composition-state", val: { tag: "commit", val: ev.text } }]);
    };

    eventSource.editHost.addEventListener("beforeinput", (ev) => {
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

    eventSource.editHost.addEventListener(
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
    eventSource.editHost.addEventListener("cut", (ev) => {
      console.log("DOM-event/cut");
      ev.preventDefault();
      callback([
        {
          tag: "cut",
        },
      ]);
    });
    eventSource.editHost.addEventListener(
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

function makeWheelUnit(deltaMode: number) {
  switch (deltaMode) {
    case WheelEvent.DOM_DELTA_PIXEL: {
      return "logical-pixel";
    }
    case WheelEvent.DOM_DELTA_LINE: {
      return "line";
    }
    case WheelEvent.DOM_DELTA_PAGE: {
      return "page";
    }
    default: {
      return "logical-pixel";
    }
  }
}
