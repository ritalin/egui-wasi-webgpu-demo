use crate::{bindings::immediate_renderer_world::{local::immediate_renderer::{surface, types}, wasi::webgpu::webgpu}, renderer, widget_recorder::{RecordOutput, ScreenDescriptor}};

pub struct EguiOutput {
    screen: ScreenDescriptor,
    shapes: Vec<egui::ClippedPrimitive>,
    textures: egui::epaint::textures::TexturesDelta,
    events: Vec<types::UnhandleEvent>,
}
impl EguiOutput {
    pub fn new(screen: ScreenDescriptor, shapes: Vec<egui::ClippedPrimitive>, textures: egui::TexturesDelta, unhandled_event: Vec<types::UnhandleEvent>) -> Self {
        Self { screen, shapes, textures, events: unhandled_event }
    }
}

impl<'a> RecordOutput for EguiOutput {
    type ImageSpec<'s> = EguiTexture<'s>;
    type Textures<'s> = EguiTextureSet<'s>;

    fn meshes<'s>(&'s self) -> Vec<Option<renderer::Mesh<'s>>> {
        self.shapes.iter()
            .map(|p| -> Option<renderer::Mesh> {
                match &p.primitive {
                    epaint::Primitive::Mesh(mesh) => {
                        Some(renderer::Mesh {
                            key: match mesh.texture_id {
                                egui::TextureId::Managed(id) => renderer::TextureKey::Managed(id),
                                egui::TextureId::User(_) => renderer::TextureKey::Default,
                            },
                            vertices: &mesh.vertices,
                            indices: &mesh.indices,
                            scissor_rect: self.screen.into_scissor_rect(p.clip_rect),
                        })
                    }
                    epaint::Primitive::Callback(_callback) => None,
                }
            })
            .collect()
    }

    fn textures<'s>(&'s self) -> EguiTextureSet<'s> {
        EguiTextureSet::new(self.textures.set.iter())
    }

    fn removed_textures(&self) -> Vec<renderer::TextureKey> {
        self.textures.free.iter()
            .map(|id| match id {
                egui::TextureId::Managed(id) => renderer::TextureKey::Managed(*id),
                egui::TextureId::User(_) => renderer::TextureKey::Default,
            })
            .collect()
    }

    fn unhandle_events(&self) -> Vec<types::UnhandleEvent> {
        self.events.clone()
    }
}

pub struct EguiTexture<'a> {
    id: &'a egui::TextureId,
    image: &'a egui::epaint::ImageDelta,
}

impl<'a> renderer::ImageSpec for EguiTexture<'a> {
    fn key(&self) -> renderer::TextureKey {
        match self.id {
            egui::TextureId::Managed(id) => renderer::TextureKey::Managed(*id),
            egui::TextureId::User(_) => renderer::TextureKey::Default,
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

    fn sampling(&self) -> renderer::SamplingOption {
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

        renderer::SamplingOption {
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
    pub fn new(textures: std::slice::Iter<'a, (egui::TextureId, epaint::ImageDelta)>) -> Self {
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
