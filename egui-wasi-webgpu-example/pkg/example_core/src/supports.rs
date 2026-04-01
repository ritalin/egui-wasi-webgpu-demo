mod egui_texture;
pub mod egui_supports;
pub mod command_supports;

pub use egui_texture::{EguiTextureSet, EguiTexture, EguiOutput};
pub use egui_supports::{populate_events, push_platform_output, create_text_change_set};

pub struct KeyWrapper<'a>(pub &'a wasi_renderer::bindings::types::Keys);
