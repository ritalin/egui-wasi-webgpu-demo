use wasi_renderer::bindings::types;

pub mod bindings;
pub mod supports;
pub mod recorder;

#[derive(Debug, Clone)]
pub enum ExampleCommand {
    OpenWindow(String),
    CloseWindow { with_query: bool },
    RequestImage { paths: Vec<String> },
    Cursor(egui::CursorIcon),
    Clipboard(ClipboardData),
    OpenUrl(egui::OpenUrl),
    ChangeSet(Vec<ChangeSpec>),
    CompositionBounds(egui::Rect),
    Screenshot(Vec<Destination>),
    CustomFrame(CustomFrameCommand),
}

#[derive(Debug, Clone)]
pub enum ClipboardData {
    Text(String),
}

#[derive(Debug, Clone, PartialEq)]
pub enum ExampleEffect {
    ImageData{ url: String, bytes: Vec<u8> },
    FontData{ url: String, name: String, bytes: Vec<u8> },
    RequestCloseQuery,
    CustomFrameEffect(CustomFrameEffect),
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

#[derive(Debug, Clone)]
pub enum Destination {
    Origin,
    Route(String),
    Clipboard,
}

#[derive(Debug, Clone)]
pub enum CustomFrameCommand {
    Initialize(WindowFrameStatus),
    Maximize,
    Minimize(egui::Vec2),
    Restore(egui::Rect),
}

#[derive(Debug, Default, Copy, Clone, PartialEq)]
pub enum WindowFrameStatus {
    #[default]
    Normal,
    Maximize,
    Minimize,
}

#[derive(Debug, Clone, PartialEq)]
pub enum CustomFrameEffect {
    Initialized(egui::Rect),
    Changed(WindowFrameStatus),
}



pub use bindings::example_world::export;
