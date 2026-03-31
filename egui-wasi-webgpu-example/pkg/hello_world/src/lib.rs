use wasi_renderer::bindings::types;

mod bindings;
mod recorder;

mod supports {
    pub mod egui_texture;
    pub mod egui_supports;
    pub mod command_supports;

    pub struct KeyWrapper<'a>(pub &'a wasi_renderer::bindings::types::Keys);
}

#[derive(Debug, Clone)]
pub enum ExampleCommand {
    OpenWindow(String),
    RequestImage { paths: Vec<String> },
    Cursor(egui::CursorIcon),
    Clipboard(ClipboardData),
    ChangeSet(Vec<ChangeSpec>),
    CompositionBounds(egui::Rect),
}

#[derive(Debug, Clone)]
pub enum ClipboardData {
    Text(String),
}

#[derive(Debug, Clone)]
pub enum ExampleEffect {
    ImageData{ url: String, bytes: Vec<u8> },
    FontData{ url: String, name: String, bytes: Vec<u8> },
}

#[derive(Debug, Clone, Default)]
pub struct UnhandledEvent {
    pub activate: Option<()>,
    pub composition_sel_range: Option<types::CompositionRange>,
}

#[derive(Debug, Clone)]
pub struct ChangeSpec {
    pub offset: u32,
    pub len: u32,
    pub new_value: Option<String>,
}
