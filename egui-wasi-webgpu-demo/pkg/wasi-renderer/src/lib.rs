pub mod bindings;

use bindings::{types, surface};

pub mod recorder_core;
pub mod render_core;

#[derive(Clone, Copy)]
pub struct ScreenDescriptor {
    pub size: surface::FrameSize,
    pub scale_factor: f32,
}
impl ScreenDescriptor {
    pub fn into_scissor_rect(&self, clip_rect: render_core::Rect) -> render_core::ScissorRect {
        render_core::ScissorRect::from_clip_rect(clip_rect, self.size.width, self.size.height, self.scale_factor)
    }

    pub fn logical_size(&self) -> (f32, f32) {
        (
            self.size.width as f32 / self.scale_factor,
            self.size.height as f32 / self.scale_factor,
        )
    }
}

pub trait EngineCore<EngineError: std::error::Error> {
    fn push_event(&mut self, events: types::Event);
    fn push_event_all(&mut self, events: Vec<types::Event>);
    fn render(&mut self, canvas: &webgpu::GpuCanvasContext, screen: ScreenDescriptor) -> Result<Vec<types::UnhandleEvent>, EngineError>;
}

pub use bindings::export as _unused_export;

use crate::bindings::webgpu;
