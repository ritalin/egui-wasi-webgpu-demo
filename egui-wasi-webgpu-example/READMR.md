# egui-wasi-webgpu-example

This project is based on examples from `egui`, adapted to run as WebAssembly components using `WebGPU`.

## Modifications

- Assets are not embedded; they are dynamically loaded via `fetch`.
- Japanese fonts are downloaded at startup and applied to the UI.

## Limitations

- **Browser Compatibility**: Requires Chrome or Edge (Chromium-based browsers) due to the use of the `EditContext API` for text input.
- **Color Emojis**: Variation selector 16 (VS16) is rendered as "Tofu" (glyph not found).
- **IME** In Japanese, Unicode U+3000 char (Ideographic Space / Zenkaku Space) is currently not supported.
- **Hyperlink**: `Window.open()` has strict secrity requirements, so links copies to the clipboard instead of being opened the page.

## Credits

- **Examples**: Derived from the examples in [egui](https://github.com/emilk/egui/tree/main/examples).
- **Font**: Noto Serif JP Subset (based on Noto Serif JP by Google) — https://github.com/ixkaito/NotoSerifJP-subset (SIL Open Font License 1.1)
