mod bindings;
mod recorder;

mod supports {
    pub mod egui_texture;
    pub mod egui_supports;
    pub mod command_supports;
}

#[derive(Debug, Clone)]
pub enum ExampleCommand {
    OpenWindow(String),
    RequestImage { paths: Vec<String> },
    Cursor(egui::CursorIcon),
    Clipboard(ClipboardData),
}

#[derive(Debug, Clone)]
pub enum ClipboardData {
    Text(String),
}

#[derive(Debug, Clone)]
pub enum ExampleEffect {
    ImageData{ url: String, bytes: Vec<u8> },
}
