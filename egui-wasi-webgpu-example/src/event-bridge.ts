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
    canvas.addEventListener("click", (ev) => {
      const rect = canvas.getBoundingClientRect();
      callback([
        {
          tag: "pointer",
          val: { x: ev.clientX - rect.left, y: ev.clientY - rect.top },
        },
        {
          tag: "mouse-down",
          val: "left",
        },
        {
          tag: "mouse-up",
          val: "left",
        },
      ]);
    });
  }

  static show(canvas: HTMLCanvasElement) {
    const dialog = canvas.parentElement as HTMLDialogElement;
    dialog.showModal();
  }
}
