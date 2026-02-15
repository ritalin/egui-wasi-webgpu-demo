use crate::{bindings::immediate_renderer_world::{local::immediate_renderer::surface, wasi::webgpu::webgpu::{self, GpuBufferUsage}}};

pub use epaint::{Vertex, Pos2, Color32, Rect};

mod mesh;
pub use mesh::{Mesh, ScissorRect, MeshVectorIter, ResolvedMeshSet};

mod texture;
use anyhow::Context;
pub use texture::{ImageSpec, TextureKey, SamplingOption};

pub struct Renderer {
    device: webgpu::GpuDevice,
    queue: webgpu::GpuQueue,
    pipeline: webgpu::GpuRenderPipeline,
    vertex_buffer: webgpu::GpuBuffer,
    vertex_staging: Vec<u8>,
    index_buffer: webgpu::GpuBuffer,
    index_staging: Vec<u8>,
    uniform_buffer: webgpu::GpuBuffer,
    _uniform_bind_group_layout: webgpu::GpuBindGroupLayout,
    uniform_bind_group: webgpu::GpuBindGroup,
    texture_cache: texture::TextureCache,
}
impl Renderer {
    const MIN_BUFFER_SIZE: usize = 4096;

    pub fn new(context: &surface::RenderContext) -> Self
    {
        let device = context.get_device();
        let uniform_bind_group_layout = context.get_uniform_layout();
        let texture_bind_group_layout = context.get_texture_layout();
        let format = context.get_canvas().get_configuration().unwrap().format;

        let vertex_buffer = new_buffer(&device, Self::MIN_BUFFER_SIZE as u64, webgpu::GpuBufferUsage::vertex(), Some("Vertex buffer".into()));
        let index_buffer = new_buffer(&device, Self::MIN_BUFFER_SIZE as u64, webgpu::GpuBufferUsage::index(), Some("Index buffer".into()));
        let uniform_buffer = new_buffer(&device, UniformInfo::stride_size(), webgpu::GpuBufferUsage::uniform(), Some("uniform buffer".into()));

        let uniform_bind_group = device.create_bind_group(&UniformInfo::desc(&uniform_bind_group_layout, &uniform_buffer));

        let texture_cache = texture::TextureCache::new(&device, format, texture_bind_group_layout);

        Self {
            queue: device.queue(),
            device,
            pipeline: context.get_pipeline(),
            vertex_buffer,
            vertex_staging: vec![0; Self::MIN_BUFFER_SIZE],
            index_buffer,
            index_staging: vec![0; Self::MIN_BUFFER_SIZE],
            uniform_buffer,
            _uniform_bind_group_layout: uniform_bind_group_layout,
            uniform_bind_group,
            texture_cache,
        }
    }

    pub fn update_mesh<'a>(&mut self, meshes: MeshVectorIter<'a>) -> Result<ResolvedMeshSet, anyhow::Error> {
        let mut result = ResolvedMeshSet::new(meshes.len(), meshes.clip_rects().collect(), meshes.keys().collect());

        let buf_size = meshes.vertices().fold(0, |acc, m| acc + m.len()) * Vertex::stride_size() as usize;
        self.send_vertex_internal(buf_size, meshes.vertices(), &mut result).context("failed to send vertex")?;

        let buf_size = meshes.indices().fold(0, |acc, i| acc + i.len()) * size_of::<u32>();
        self.send_index_internal(buf_size, meshes.indices(), &mut result).context("failed to send index")?;
        Ok(result)
    }

    fn send_vertex_internal<'a>(&mut self, buf_size: usize, vertices: impl Iterator<Item = &'a [Vertex]>, result: &mut ResolvedMeshSet) -> Result<(), anyhow::Error> {
        let (stage, buffer) = (&mut self.vertex_staging, &mut self.vertex_buffer);

        // log::debug!("[B] Vertex buffer/current: {}, staging: {}, required: {buf_size}, need?: {}", buffer.size(), stage.capacity(), stage.capacity() < buf_size);

        if stage.capacity() < buf_size {
            let new_size = buf_size.next_power_of_two().max(Self::MIN_BUFFER_SIZE);
            // log::debug!("Vertex buffer resizing...({} -> {})", stage.capacity(), new_size);
            stage.resize(new_size, 0);
            *buffer = new_buffer(&self.device, new_size as u64, webgpu::GpuBufferUsage::vertex(), Some("Vertex buffer".into()));
            // log::debug!("Vertex buffer resized/len: {}", buffer.size());
        }

        stage.clear();

        let mut offset = 0;

        for v in vertices {
            let bytes = bytemuck::cast_slice(v);
            let size = v.len() as u32;
            stage.extend_from_slice(bytes);

            result.push_vertex(offset, size, Vertex::stride_size());

            // println!("vertex/offset: {offset}, size: {}", bytes.len());
            offset += size;
        }

        self.queue.write_buffer_with_copy(&buffer, 0, &stage, Some(0), Some(stage.len() as u64))?;

        // println!("[A] Vertex buffer send/offset: {offset}, byte-offset: {byte_offset}, buffer/len: {}, stage/len: {}, stride: {}", buffer.size(), stage.len(), Vertex::stride_size());
        // println!("----------------------------------------");
        Ok(())
    }

    fn send_index_internal<'a>(&mut self, buf_size: usize, indices: impl Iterator<Item = &'a [u32]>, result: &mut ResolvedMeshSet) -> Result<(), anyhow::Error> {
        let (stage, buffer) = (&mut self.index_staging, &mut self.index_buffer);

        // println!("Index buffer/current: {}, staging: {}, required: {buf_size}", buffer.size(), stage.capacity());

        if stage.capacity() < buf_size {
            let new_size = buf_size.next_power_of_two().max(Self::MIN_BUFFER_SIZE);
            stage.resize(new_size, 0);
            *buffer = new_buffer(&self.device, new_size as u64, webgpu::GpuBufferUsage::index(), Some("Index buffer".into()));
        }

        stage.clear();

        let mut offset = 0;

        for i in indices {
            let bytes = bytemuck::cast_slice(i);
            let size = i.len() as u32;
            stage.extend_from_slice(bytes);

            result.push_index(offset, size, size_of::<u32>() as u64);

            // println!("Index/offset: {offset}, size: {}", bytes.len());
            offset += size;
        }

        self.queue.write_buffer_with_copy(buffer, 0, stage, Some(0), Some(stage.len() as u64))?;

        // println!("[A] Index buffer send/offset: {offset}, byte-offset: {byte_offset}, buffer/len: {}, stage/len: {}, stride/size: {}", buffer.size(), stage.len(), size_of::<u32>() as u64);
        // println!("----------------------------------------");
        Ok(())
    }

    pub fn send_uniform(&self, uniform_info: UniformInfo) -> Result<(), anyhow::Error> {
        // log::debug!("uniform: {uniform_info:?}");

        let bytes = bytemuck::bytes_of(&uniform_info);
        self.queue.write_buffer_with_copy(&self.uniform_buffer, 0, bytes, Some(0), None)?;
        Ok(())
    }

    pub fn send_texture<'a, T: texture::ImageSpec + 'a>(&mut self, images: impl Iterator<Item = T>) {
        self.texture_cache.update_cache(&self.device, images);
    }

    pub fn render(&self, surface_texture: webgpu::GpuTexture, meshes: ResolvedMeshSet) -> Result<(), anyhow::Error> {
        let view = surface_texture.create_view(None);

        let desc = webgpu::GpuCommandEncoderDescriptor { label: Some("Command encoder".into()) };
        let enc = self.device.create_command_encoder(Some(&desc));

        let desc = webgpu::GpuRenderPassDescriptor {
            label: Some("Render pass".into()),
            color_attachments: vec![
                Some(webgpu::GpuRenderPassColorAttachment {
                    view: &view,
                    depth_slice: None,
                    resolve_target: None,
                    clear_value: None,
                    load_op: webgpu::GpuLoadOp::Load,
                    store_op: webgpu::GpuStoreOp::Store,
                }),
            ],
            depth_stencil_attachment: None,
            occlusion_query_set: None,
            timestamp_writes: None,
            max_draw_count: None,
        };
        let pass = enc.begin_render_pass(&desc);
        pass.set_pipeline(&self.pipeline);
        pass.set_bind_group(0, Some(&self.uniform_bind_group), None, None, None)?;

        for mesh in meshes.iter() {
            pass.set_scissor_rect(mesh.scissor_rect.x, mesh.scissor_rect.y, mesh.scissor_rect.width, mesh.scissor_rect.height);
            pass.set_vertex_buffer(0, Some(&self.vertex_buffer), Some(mesh.vertex_buffer_range.offset), Some(mesh.vertex_buffer_range.len));
            pass.set_index_buffer(&self.index_buffer, webgpu::GpuIndexFormat::Uint32, Some(mesh.index_buffer_range.offset as u64), Some(mesh.index_buffer_range.len));
            pass.set_bind_group(1, Some(self.texture_cache.get_bind_group(mesh.key)), None, None, None).context("Faild to get texture bind group")?;
            // println!("Draw/mesh(vertex): {:?}, mesh(index): {:?}, draw_index: {:?}", &mesh.vertex_buffer_range, &mesh.index_buffer_range, &mesh.draw_range);
            pass.draw_indexed(mesh.draw_range.len, Some(1), None, None, Some(0));
        }

        pass.end();

        self.queue.submit(&[&enc.finish(None)]);
        Ok(())
    }

    pub fn remove_textures(&mut self, keys: &[TextureKey]) {
        self.texture_cache.remove_from_cache(keys);
    }
}

fn new_buffer(device: &webgpu::GpuDevice, size: u64, usage: webgpu::GpuFlagsConstant, label: Option<String>) -> webgpu::GpuBuffer {
    let desc = webgpu::GpuBufferDescriptor {
        label,
        size,
        usage: usage | GpuBufferUsage::copy_dst(),
        mapped_at_creation: None,
    };
    device.create_buffer(&desc)
}

pub trait BufferSpec: Sized {
    fn stride_size() -> u64 {
        size_of::<Self>() as u64
    }
}

impl BufferSpec for Vertex {}

#[derive(Debug, Copy, Clone, bytemuck::Pod, bytemuck::Zeroable)]
#[repr(C)]
pub struct UniformInfo {
    pub screen_size: [f32; 2],
    pub dithering: u32,
    pub texture_filtering: u32,
}
impl UniformInfo {
    fn desc<'a>(layout: &'a webgpu::GpuBindGroupLayout, buffer: &'a webgpu::GpuBuffer) -> webgpu::GpuBindGroupDescriptor<'a> {
        webgpu::GpuBindGroupDescriptor {
            label: Some("uniform bind group".into()),
            layout,
            entries: vec![
                webgpu::GpuBindGroupEntry {
                    binding: 0,
                    resource: webgpu::GpuBindingResource::GpuBufferBinding(webgpu::GpuBufferBinding {
                        buffer,
                        offset: Some(0),
                        size: None,
                    })
                }
            ]
        }
    }

    pub fn from_size(size: surface::FrameSize, scale_factor: f32) -> Self {
        Self {
            screen_size: [size.width as f32 / scale_factor, size.height as f32 / scale_factor],
            dithering: 0,
            texture_filtering: 0,
        }
    }
}
impl BufferSpec for UniformInfo {}
