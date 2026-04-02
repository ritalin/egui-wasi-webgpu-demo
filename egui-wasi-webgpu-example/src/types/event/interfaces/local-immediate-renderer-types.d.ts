/** @module Interface local:immediate-renderer/types **/
export interface ModifierPressed {
  left?: boolean,
  right?: boolean,
}
export interface ModifierOptions {
  ctrl: ModifierPressed,
  shift: ModifierPressed,
  alt: ModifierPressed,
  superKey: ModifierPressed,
}
export interface Location {
  x: number,
  y: number,
}
/**
 * # Variants
 * 
 * ## `"left"`
 * 
 * ## `"right"`
 * 
 * ## `"middle"`
 * 
 * ## `"back"`
 * 
 * ## `"forward"`
 */
export type MouseButton = 'left' | 'right' | 'middle' | 'back' | 'forward';
/**
 * # Variants
 * 
 * ## `"logical-pixel"`
 * 
 * ## `"line"`
 * 
 * ## `"page"`
 */
export type MouseWheelUnit = 'logical-pixel' | 'line' | 'page';
export interface MouseWheel {
  deltaX: number,
  deltaY: number,
  wheelUnit: MouseWheelUnit,
}
export interface KeyOptions {
  repeat?: boolean,
}
/**
 * # Variants
 * 
 * ## `"enter"`
 * 
 * ## `"tab"`
 * 
 * ## `"space"`
 */
export type WhitespaceKey = 'enter' | 'tab' | 'space';
/**
 * # Variants
 * 
 * ## `"backspace"`
 * 
 * ## `"delete"`
 */
export type EditKey = 'backspace' | 'delete';
/**
 * # Variants
 * 
 * ## `"escape"`
 */
export type UiKey = 'escape';
/**
 * # Variants
 * 
 * ## `"arrow-down"`
 * 
 * ## `"arrow-left"`
 * 
 * ## `"arrow-right"`
 * 
 * ## `"arrow-up"`
 */
export type NaviKey = 'arrow-down' | 'arrow-left' | 'arrow-right' | 'arrow-up';
export type Keys = KeysWhitespace | KeysEdit | KeysUi | KeysNavi;
export interface KeysWhitespace {
  tag: 'whitespace',
  val: WhitespaceKey,
}
export interface KeysEdit {
  tag: 'edit',
  val: EditKey,
}
export interface KeysUi {
  tag: 'ui',
  val: UiKey,
}
export interface KeysNavi {
  tag: 'navi',
  val: NaviKey,
}
/**
 * # Variants
 * 
 * ## `"undo"`
 * 
 * ## `"redo"`
 */
export type HistoryOps = 'undo' | 'redo';
export interface CompositionRange {
  offset: number,
  len: number,
}
export type CompositionState = CompositionStateStart | CompositionStateSelectionRange | CompositionStatePreEdit | CompositionStateCommit;
export interface CompositionStateStart {
  tag: 'start',
}
export interface CompositionStateSelectionRange {
  tag: 'selection-range',
  val: CompositionRange,
}
export interface CompositionStatePreEdit {
  tag: 'pre-edit',
  val: string,
}
export interface CompositionStateCommit {
  tag: 'commit',
  val: string,
}
export type CompositionBoundsReq = CompositionBoundsReqCharacterBounds;
export interface CompositionBoundsReqCharacterBounds {
  tag: 'character-bounds',
  val: CompositionRange | undefined,
}
export type Event = EventModifiers | EventPointer | EventMouseDown | EventMouseUp | EventMouseMove | EventMouseWheel | EventKeyDown | EventKeyUp | EventRequestCompositionBounds | EventUpdateCompositionState | EventHistory | EventCut | EventCopy | EventPaste | EventActivate | EventKeepFocus;
export interface EventModifiers {
  tag: 'modifiers',
  val: ModifierOptions,
}
export interface EventPointer {
  tag: 'pointer',
  val: Location,
}
export interface EventMouseDown {
  tag: 'mouse-down',
  val: MouseButton,
}
export interface EventMouseUp {
  tag: 'mouse-up',
  val: MouseButton,
}
export interface EventMouseMove {
  tag: 'mouse-move',
}
export interface EventMouseWheel {
  tag: 'mouse-wheel',
  val: MouseWheel,
}
export interface EventKeyDown {
  tag: 'key-down',
  val: [Keys, KeyOptions],
}
export interface EventKeyUp {
  tag: 'key-up',
  val: Keys,
}
export interface EventRequestCompositionBounds {
  tag: 'request-composition-bounds',
  val: CompositionBoundsReq,
}
export interface EventUpdateCompositionState {
  tag: 'update-composition-state',
  val: CompositionState,
}
export interface EventHistory {
  tag: 'history',
  val: HistoryOps,
}
export interface EventCut {
  tag: 'cut',
}
export interface EventCopy {
  tag: 'copy',
}
export interface EventPaste {
  tag: 'paste',
  val: string,
}
export interface EventActivate {
  tag: 'activate',
}
export interface EventKeepFocus {
  tag: 'keep-focus',
}
export type UnhandleEvent = UnhandleEventEvent | UnhandleEventOpenWindow;
export interface UnhandleEventEvent {
  tag: 'event',
  val: Event,
}
export interface UnhandleEventOpenWindow {
  tag: 'open-window',
  val: string,
}
