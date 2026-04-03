/** @module Interface local:immediate-renderer-example/render **/
export function createRenderer(context: RenderContext): Dispatcher;
export type Command = import('./local-immediate-renderer-example-interaction.js').Command;
export type Effect = import('./local-immediate-renderer-example-interaction.js').Effect;
export type RenderContext = import('./local-webgpu-runtime-surface.js').RenderContext;
export type Event = import('./local-immediate-renderer-types.js').Event;

export class CommandChannel {
  /**
   * This type does not have a public constructor.
   */
  private constructor();
  post(effects: Array<Effect>): void;
}

export class Dispatcher {
  /**
   * This type does not have a public constructor.
   */
  private constructor();
  eventChannel(): EventChannel;
  commandChannel(): CommandChannel;
  dispatch(): Array<Command>;
}

export class EventChannel {
  /**
   * This type does not have a public constructor.
   */
  private constructor();
  post(events: Array<Event>): void;
}
