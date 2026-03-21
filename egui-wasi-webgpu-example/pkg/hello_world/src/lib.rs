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
    RequestImage { path: String },
    Cursor(egui::CursorIcon),
}

#[derive(Debug, Clone)]
pub enum ExampleEffect {
    ImageData{ url: String, bytes: Vec<u8> },
}
