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
    pub composition_bound_req: Option<()>,
}

#[derive(Debug, Clone)]
pub struct ChangeSpec {
    offset: u32,
    len: u32,
    new_value: Option<String>,
}
