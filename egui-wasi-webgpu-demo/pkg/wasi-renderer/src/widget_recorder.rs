use crate::{bindings::immediate_renderer_world::{local::{immediate_renderer::types, webgpu_runtime::surface}, wasi::webgpu::webgpu}, renderer};

pub mod recorder_main;
pub mod recorder_triangle;
pub mod recorder_counter;

#[derive(Clone, Copy)]
pub struct ScreenDescriptor {
    pub size: surface::FrameSize,
    pub scale_factor: f32,
}
impl ScreenDescriptor {
    pub fn into_scissor_rect(&self, clip_rect: renderer::Rect) -> renderer::ScissorRect {
        renderer::ScissorRect::from_clip_rect(clip_rect, self.size.width, self.size.height, self.scale_factor)
    }

    pub fn logical_size(&self) -> (f32, f32) {
        (
            self.size.width as f32 / self.scale_factor,
            self.size.height as f32 / self.scale_factor,
        )
    }
}

pub trait Recorder {
    type ImageSpec: renderer::ImageSpec;
    type ImageSpecs: Iterator<Item = Self::ImageSpec>;
    type Output: RecordOutput;

    fn preset_textures(&self) -> Self::ImageSpecs;
    fn record(&mut self, screen: ScreenDescriptor, events: &[types::Event]) -> Result<Self::Output, anyhow::Error>;
}

pub trait RecordOutput {
    type ImageSpec<'s>: renderer::ImageSpec where Self: 's;
    type Textures<'s>: Iterator<Item =Self::ImageSpec<'s>> where Self: 's;

    fn meshes<'s>(&'s self) -> Vec<Option<renderer::Mesh<'s>>>;
    fn textures<'s>(&'s self) -> Self::Textures<'s>;
    fn removed_textures(&self) -> Vec<renderer::TextureKey>;
    fn unhandle_events(&self) -> Vec<types::UnhandleEvent>;
}

pub struct BitmapImage {
    _size: surface::FrameSize,
    image: image::RgbaImage,
}
impl renderer::ImageSpec for BitmapImage {
    fn key(&self) -> renderer::TextureKey {
        renderer::TextureKey::Managed(1)
    }

    fn data(&self) -> &[u8] {
        use image::EncodableLayout;
        self.image.as_bytes()
    }

    fn dest_position(&self) -> Option<(u32, u32)> {
        None
    }

    fn size(&self) -> surface::FrameSize {
        self._size
    }

    fn sampling(&self) -> renderer::SamplingOption {
        renderer::SamplingOption::simple(webgpu::GpuFilterMode::Linear, webgpu::GpuFilterMode::Nearest, webgpu::GpuAddressMode::ClampToEdge)
    }
}
