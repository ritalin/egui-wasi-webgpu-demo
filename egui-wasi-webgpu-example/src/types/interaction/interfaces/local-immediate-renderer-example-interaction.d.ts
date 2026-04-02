/** @module Interface local:immediate-renderer-example/interaction **/
export type Route = string;
export type Url = string;
export interface ExternalAsset {
  source: Url,
  bytes: Uint8Array,
}
export interface ExternalFont {
  source: Url,
  name: string,
  bytes: Uint8Array,
}
export type Effect = EffectImageData | EffectFontData;
export interface EffectImageData {
  tag: 'image-data',
  val: ExternalAsset,
}
export interface EffectFontData {
  tag: 'font-data',
  val: ExternalFont,
}
/**
 * # Variants
 * 
 * ## `"default"`
 * 
 * ## `"none"`
 * 
 * ## `"context-menu"`
 * 
 * ## `"help"`
 * 
 * ## `"pointer"`
 * 
 * ## `"progress"`
 * 
 * ## `"wait"`
 * 
 * ## `"cell"`
 * 
 * ## `"crosshair"`
 * 
 * ## `"text"`
 * 
 * ## `"vertical-text"`
 * 
 * ## `"alias"`
 * 
 * ## `"copy"`
 * 
 * ## `"move"`
 * 
 * ## `"no-drop"`
 * 
 * ## `"not-allowed"`
 * 
 * ## `"grab"`
 * 
 * ## `"grabbing"`
 * 
 * ## `"all-scroll"`
 * 
 * ## `"col-resize"`
 * 
 * ## `"row-resize"`
 * 
 * ## `"n-resize"`
 * 
 * ## `"e-resize"`
 * 
 * ## `"s-resize"`
 * 
 * ## `"w-resize"`
 * 
 * ## `"ne-resize"`
 * 
 * ## `"nw-resize"`
 * 
 * ## `"se-resize"`
 * 
 * ## `"sw-resize"`
 * 
 * ## `"ew-resize"`
 * 
 * ## `"ns-resize"`
 * 
 * ## `"nesw-resize"`
 * 
 * ## `"nwse-resize"`
 * 
 * ## `"zoom-in"`
 * 
 * ## `"zoom-out"`
 */
export type CursorStyle = 'default' | 'none' | 'context-menu' | 'help' | 'pointer' | 'progress' | 'wait' | 'cell' | 'crosshair' | 'text' | 'vertical-text' | 'alias' | 'copy' | 'move' | 'no-drop' | 'not-allowed' | 'grab' | 'grabbing' | 'all-scroll' | 'col-resize' | 'row-resize' | 'n-resize' | 'e-resize' | 's-resize' | 'w-resize' | 'ne-resize' | 'nw-resize' | 'se-resize' | 'sw-resize' | 'ew-resize' | 'ns-resize' | 'nesw-resize' | 'nwse-resize' | 'zoom-in' | 'zoom-out';
export type ClipboardData = ClipboardDataText;
export interface ClipboardDataText {
  tag: 'text',
  val: string,
}
export interface ChangeSpec {
  offset: number,
  len: number,
  newValue?: string,
}
export interface CompositionBounds {
  left: number,
  top: number,
  width: number,
  height: number,
}
export interface OpenUrlOptions {
  newTab?: boolean,
}
export type Command = CommandOpenWindow | CommandRequestImage | CommandCursor | CommandClipboard | CommandOpenUrl | CommandChangeSet | CommandCompositionBounds;
export interface CommandOpenWindow {
  tag: 'open-window',
  val: Route,
}
export interface CommandRequestImage {
  tag: 'request-image',
  val: Array<Url>,
}
export interface CommandCursor {
  tag: 'cursor',
  val: CursorStyle,
}
export interface CommandClipboard {
  tag: 'clipboard',
  val: ClipboardData,
}
export interface CommandOpenUrl {
  tag: 'open-url',
  val: [string, OpenUrlOptions],
}
export interface CommandChangeSet {
  tag: 'change-set',
  val: Array<ChangeSpec>,
}
export interface CommandCompositionBounds {
  tag: 'composition-bounds',
  val: CompositionBounds,
}
