
mod bindings;
mod widget_recorder;

mod supports {
    pub mod egui_texture;
    pub mod egui_supports;
}

#[derive(Debug, Clone)]
pub enum DemoCommand {
    OpenWindow(String),
}
