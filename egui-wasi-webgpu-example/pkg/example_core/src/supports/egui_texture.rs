use wasi_renderer::{recorder_core::RecordOutput, ScreenDescriptor};
use wasi_renderer::{render_core, bindings::{surface, webgpu}};

use crate::ExampleCommand;

pub struct EguiOutput {
    screen: ScreenDescriptor,
    shapes: Vec<egui::ClippedPrimitive>,
    textures: egui::epaint::textures::TexturesDelta,
    commands: Vec<ExampleCommand>,
}
impl EguiOutput {
    pub fn new(
        screen: ScreenDescriptor,
        shapes: Vec<egui::ClippedPrimitive>,
        textures: egui::TexturesDelta,
        commands: Vec<ExampleCommand>) -> Self
    {
        Self { screen, shapes, textures, commands }
    }
}

impl<'a> RecordOutput for EguiOutput {
    type ImageSpec<'s> = EguiTexture<'s>;
    type Textures<'s> = EguiTextureSet<'s>;
    type RequestCommand = crate::ExampleCommand;

    fn clear_color<'s>(&'s self) -> Option<webgpu::GpuColor> {
        Some(webgpu::GpuColor{ r: 0.0, g: 0.0, b: 0.0, a: 0.0 })
    }

    fn meshes<'s>(&'s self) -> Vec<Option<render_core::Mesh<'s>>> {
        self.shapes.iter()
            .map(|p| -> Option<render_core::Mesh> {
                match &p.primitive {
                    egui::epaint::Primitive::Mesh(mesh) => {
                        Some(render_core::Mesh {
                            key: match mesh.texture_id {
                                egui::TextureId::Managed(id) => render_core::TextureKey::Managed(id),
                                egui::TextureId::User(_) => render_core::TextureKey::Default,
                            },
                            vertices: &mesh.vertices,
                            indices: &mesh.indices,
                            scissor_rect: self.screen.into_scissor_rect(p.clip_rect),
                        })
                    }
                    egui::epaint::Primitive::Callback(_callback) => None,
                }
            })
            .collect()
    }

    fn textures<'s>(&'s self) -> EguiTextureSet<'s> {
        EguiTextureSet::new(self.textures.set.iter())
    }

    fn removed_textures(&self) -> Vec<render_core::TextureKey> {
        self.textures.free.iter()
            .map(|id| match id {
                egui::TextureId::Managed(id) => render_core::TextureKey::Managed(*id),
                egui::TextureId::User(_) => render_core::TextureKey::Default,
            })
            .collect()
    }

    fn command_requests(&self) -> Vec<Self::RequestCommand> {
        self.commands.clone()
    }
}

pub struct EguiTexture<'a> {
    id: &'a egui::TextureId,
    image: &'a egui::epaint::ImageDelta,
}

impl<'a> render_core::ImageSpec for EguiTexture<'a> {
    fn key(&self) -> render_core::TextureKey {
        match self.id {
            egui::TextureId::Managed(id) => render_core::TextureKey::Managed(*id),
            egui::TextureId::User(_) => render_core::TextureKey::Default,
        }
    }

    fn data(&self) -> &[u8] {
        match &self.image.image {
            egui::ImageData::Color(data) => bytemuck::cast_slice(&data.pixels),
        }
    }

    fn dest_position(&self) -> Option<(u32, u32)> {
        self.image.pos.map(|[x, y]| (x as u32, y as u32))
    }

    fn size(&self) -> surface::FrameSize {
        surface::FrameSize{
            width: self.image.image.width() as u32,
            height: self.image.image.height() as u32,
        }
    }

    fn sampling(&self) -> render_core::SamplingOption {
        let mag_filter = match self.image.options.magnification {
            egui::TextureFilter::Nearest => webgpu::GpuFilterMode::Nearest,
            egui::TextureFilter::Linear => webgpu::GpuFilterMode::Linear,
        };
        let min_filter = match self.image.options.minification {
            egui::TextureFilter::Nearest => webgpu::GpuFilterMode::Nearest,
            egui::TextureFilter::Linear => webgpu::GpuFilterMode::Linear,
        };
        let mipmap_filter = match self.image.options.mipmap_mode {
            Some(egui::TextureFilter::Linear) | None => webgpu::GpuMipmapFilterMode::Linear,
            Some(egui::TextureFilter::Nearest) => webgpu::GpuMipmapFilterMode::Nearest,
        };
        let wrap_mode = match self.image.options.wrap_mode {
            egui::TextureWrapMode::ClampToEdge => webgpu::GpuAddressMode::ClampToEdge,
            egui::TextureWrapMode::Repeat => webgpu::GpuAddressMode::Repeat,
            egui::TextureWrapMode::MirroredRepeat => webgpu::GpuAddressMode::MirrorRepeat,
        };

        render_core::SamplingOption {
            mag_filter,
            min_filter,
            mipmap_filter,
            u_wrap_mode: wrap_mode,
            v_wrap_mode: wrap_mode,
        }
    }
}

pub struct EguiTextureSet<'a> {
    textures: std::slice::Iter<'a, (egui::TextureId, egui::epaint::ImageDelta)>,
}
impl<'a> EguiTextureSet<'a> {
    pub fn new(textures: std::slice::Iter<'a, (egui::TextureId, egui::epaint::ImageDelta)>) -> Self {
        Self { textures }
    }
}

impl<'a> Iterator for EguiTextureSet<'a> {
    type Item = EguiTexture<'a>;

    fn next(&mut self) -> Option<Self::Item> {
        self.textures.next().map(|(id, image)| Self::Item { id, image })
    }
}

impl<'a> Default for EguiTextureSet<'a> {
    fn default() -> Self {
        Self { textures: [].iter() }
    }
}
