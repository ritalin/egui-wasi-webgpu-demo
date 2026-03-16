use wasi_renderer::{render_core, bindings::{surface, webgpu}};

pub mod recorder_main;
pub mod recorder_triangle;
pub mod recorder_counter;

pub struct BitmapImage {
    _size: surface::FrameSize,
    image: image::RgbaImage,
}
impl render_core::ImageSpec for BitmapImage {
    fn key(&self) -> render_core::TextureKey {
        render_core::TextureKey::Managed(1)
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

    fn sampling(&self) -> render_core::SamplingOption {
        render_core::SamplingOption::simple(webgpu::GpuFilterMode::Linear, webgpu::GpuFilterMode::Nearest, webgpu::GpuAddressMode::ClampToEdge)
    }
}
