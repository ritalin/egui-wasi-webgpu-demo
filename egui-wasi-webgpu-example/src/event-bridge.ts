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
        {
          tag: "pointer",
          val: { x: ev.clientX - rect.left, y: ev.clientY - rect.top },
        },
        {
          tag: "mouse-move",
        },
      ]);
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
