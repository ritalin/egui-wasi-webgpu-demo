
mod bindings;
mod widget_recorder;

mod supports {
    pub mod egui_texture;
    pub mod egui_supports;

    pub struct KeyWrapper<'a>(pub &'a wasi_renderer::bindings::types::Keys);
}

#[derive(Debug, Clone)]
pub enum DemoCommand {
    OpenWindow(String),
}
