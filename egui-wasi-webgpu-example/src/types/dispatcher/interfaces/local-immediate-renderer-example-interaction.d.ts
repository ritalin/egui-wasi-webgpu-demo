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
export interface Origin {
  left: number,
  top: number,
}
export interface Size {
  width: number,
  height: number,
}
export interface OpenUrlOptions {
  newTab?: boolean,
}
export interface CloseOptions {
  withQuery?: boolean,
}
export type Destination = DestinationOrigin | DestinationRoute | DestinationClipboard;
export interface DestinationOrigin {
  tag: 'origin',
}
export interface DestinationRoute {
  tag: 'route',
  val: Route,
}
export interface DestinationClipboard {
  tag: 'clipboard',
}
/**
 * # Variants
 * 
 * ## `"maximized"`
 * 
 * ## `"minimized"`
 * 
 * ## `"restored"`
 */
export type CustomFrameStatus = 'maximized' | 'minimized' | 'restored';
export type CustomFrameCommand = CustomFrameCommandInitialize | CustomFrameCommandMaximize | CustomFrameCommandMinimize | CustomFrameCommandRestore;
export interface CustomFrameCommandInitialize {
  tag: 'initialize',
  val: CustomFrameStatus,
}
export interface CustomFrameCommandMaximize {
  tag: 'maximize',
}
export interface CustomFrameCommandMinimize {
  tag: 'minimize',
  val: Size,
}
export interface CustomFrameCommandRestore {
  tag: 'restore',
  val: [Origin, Size],
}
export type Command = CommandOpenWindow | CommandCloseWindow | CommandRequestImage | CommandCursor | CommandClipboard | CommandOpenUrl | CommandChangeSet | CommandCompositionBounds | CommandScreenshot | CommandCustomFrame;
export interface CommandOpenWindow {
  tag: 'open-window',
  val: Route,
}
export interface CommandCloseWindow {
  tag: 'close-window',
  val: CloseOptions,
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
  val: [Origin, Size],
}
export interface CommandScreenshot {
  tag: 'screenshot',
  val: Array<Destination>,
}
export interface CommandCustomFrame {
  tag: 'custom-frame',
  val: CustomFrameCommand,
}
export type CustomFrameEffect = CustomFrameEffectInitialized | CustomFrameEffectChanged;
export interface CustomFrameEffectInitialized {
  tag: 'initialized',
  val: [Origin, Size],
}
export interface CustomFrameEffectChanged {
  tag: 'changed',
  val: CustomFrameStatus,
}
export type Effect = EffectImageData | EffectFontData | EffectRequestCloseQuery | EffectCustomFrameEffect;
export interface EffectImageData {
  tag: 'image-data',
  val: ExternalAsset,
}
export interface EffectFontData {
  tag: 'font-data',
  val: ExternalFont,
}
export interface EffectRequestCloseQuery {
  tag: 'request-close-query',
}
export interface EffectCustomFrameEffect {
  tag: 'custom-frame-effect',
  val: CustomFrameEffect,
}
