use std::collections::hash_map;

use crate::bindings::immediate_renderer_world::{local::immediate_renderer::surface, wasi::webgpu::webgpu};

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd)]
pub struct SamplingOption {
    pub mag_filter: webgpu::GpuFilterMode,
    pub min_filter: webgpu::GpuFilterMode,
    pub mipmap_filter: webgpu::GpuMipmapFilterMode,
    pub u_wrap_mode: webgpu::GpuAddressMode,
    pub v_wrap_mode: webgpu::GpuAddressMode,
}
impl SamplingOption {
    pub const fn simple(mag_filter: webgpu::GpuFilterMode, min_filter: webgpu::GpuFilterMode, wrap_mode: webgpu::GpuAddressMode) -> Self {
        let mipmap_filter = match min_filter {
            webgpu::GpuFilterMode::Nearest => webgpu::GpuMipmapFilterMode::Nearest,
            webgpu::GpuFilterMode::Linear => webgpu::GpuMipmapFilterMode::Linear,
        };

        Self {
            mag_filter,
            min_filter,
            mipmap_filter,
            u_wrap_mode: wrap_mode,
            v_wrap_mode: wrap_mode,
        }
    }
}
impl std::hash::Hash for SamplingOption {
    fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
        (self.mag_filter as u32).hash(state);
        (self.min_filter as u32).hash(state);
        (self.mipmap_filter as u32).hash(state);
        (self.u_wrap_mode as u32).hash(state);
        (self.v_wrap_mode as u32).hash(state);
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Hash)]
pub enum TextureKey {
    Default,
    Managed(u64),
    // Custom(u64),
}

pub struct TextureBindEntry {
    bind_group: webgpu::GpuBindGroup,
    texture: webgpu::GpuTexture,
}

pub trait ImageSpec {
    fn key(&self) -> TextureKey;
    fn data(&self) -> &[u8];
    fn dest_position(&self) -> Option<(u32, u32)>;
    fn size(&self) -> surface::FrameSize;
    fn sampling(&self) -> SamplingOption;
}

pub struct TextureCache {
    map: ahash::AHashMap<TextureKey, TextureBindEntry>,
    samplers: ahash::AHashMap<SamplingOption, webgpu::GpuSampler>,
    format: webgpu::GpuTextureFormat,
    group_layout: webgpu::GpuBindGroupLayout,
}
impl TextureCache {
    const DEFAULT_SAMPLER_OPT: SamplingOption = SamplingOption::simple(webgpu::GpuFilterMode::Linear, webgpu::GpuFilterMode::Nearest, webgpu::GpuAddressMode::ClampToEdge);

    pub fn new(device: &webgpu::GpuDevice, format: webgpu::GpuTextureFormat, group_layout: webgpu::GpuBindGroupLayout) -> Self {
        let size = webgpu::GpuExtent3D{ width: 1, height: Some(1), depth_or_array_layers: Some(1) };
        let default_sampler = new_sampler(device, &Self::DEFAULT_SAMPLER_OPT);
        let texture_fallback = new_texture(device, format, size);
        let group_fallback = new_bind_grpup(device, &group_layout, &texture_fallback.create_view(None), &default_sampler);

        device.queue().write_texture_with_copy(
            &webgpu::GpuTexelCopyTextureInfo {
                texture: &texture_fallback,
                mip_level: Some(0),
                origin: None,
                aspect: Some(webgpu::GpuTextureAspect::All),
            },
            &[255, 255, 255, 255],
            webgpu::GpuTexelCopyBufferLayout {
                offset: Some(0),
                bytes_per_row: Some(4),
                rows_per_image: Some(1),
            },
            size,
        );

        let samplers = ahash::AHashMap::from([(Self::DEFAULT_SAMPLER_OPT, default_sampler)]);
        let map = ahash::AHashMap::from([(TextureKey::Default, TextureBindEntry{ bind_group: group_fallback, texture: texture_fallback })]);

        // println!("texture/format: {format:?}");
        Self {
            map,
            samplers,
            format,
            group_layout,
        }
    }

    pub fn update_cache<'a, T: ImageSpec + 'a>(&mut self, device: &webgpu::GpuDevice, images: impl Iterator<Item = T>) {
        let queue = device.queue();

        for img in images {
            log::debug!("New texture/key: {:?}", img.key());

            let size = webgpu::GpuExtent3D{
                width: img.size().width,
                height: Some(img.size().height),
                depth_or_array_layers: Some(1),
            };

            let entry = match self.map.entry(img.key()) {
                hash_map::Entry::Occupied(entry) => {
                    entry
                }
                hash_map::Entry::Vacant(entry) => {
                    let texture = new_texture(device, self.format, size);
                    let sampling = img.sampling();
                    let sampler = self.samplers.entry(sampling)
                        .or_insert_with(|| new_sampler(device, &sampling))
                    ;
                    let bind_group = new_bind_grpup(device, &self.group_layout, &texture.create_view(None), &sampler);

                    entry.insert_entry(TextureBindEntry { bind_group, texture })
                }
            };

            queue.write_texture_with_copy(
                &webgpu::GpuTexelCopyTextureInfo {
                    texture: &entry.get().texture,
                    mip_level: Some(0),
                    origin: img.dest_position().map(|(x, y)| webgpu::GpuOrigin3D{ x: Some(x), y: Some(y), z: Some(0) }),
                    aspect: Some(webgpu::GpuTextureAspect::All),
                },
                img.data(),
                webgpu::GpuTexelCopyBufferLayout {
                    offset: Some(0),
                    bytes_per_row: Some(size.width * 4),
                    rows_per_image: size.height,
                },
                size,
            );
        }
    }

    pub fn get_bind_group(&self, key: TextureKey) -> &webgpu::GpuBindGroup {
        if let Some(group) = self.map.get(&key) {
            return &group.bind_group;
        }

        // eprintln!("bind group is not found ({key:?}), use fallback bind group (entry/len: {})", self.map.len());

        &self.map.get(&TextureKey::Default).unwrap().bind_group
    }

    pub fn remove_from_cache(&mut self, keys: &[TextureKey]) {
        for k in keys {
            self.map.remove(k);
        }
    }
}

fn new_texture(device: &webgpu::GpuDevice, format: webgpu::GpuTextureFormat, size: webgpu::GpuExtent3D) -> webgpu::GpuTexture {
    let desc = webgpu::GpuTextureDescriptor {
        label: None,
        size,
        mip_level_count: Some(1),
        sample_count: Some(1),
        dimension: Some(webgpu::GpuTextureDimension::D2),
        format,
        usage: webgpu::GpuTextureUsage::texture_binding() | webgpu::GpuTextureUsage::copy_dst(),
        view_formats: None,
    };
    device.create_texture(&desc)
}

fn new_sampler(device: &webgpu::GpuDevice, sampling: &SamplingOption) -> webgpu::GpuSampler {
    let desc = webgpu::GpuSamplerDescriptor {
        label: None,
        address_mode_u: Some(sampling.u_wrap_mode),
        address_mode_v: Some(sampling.v_wrap_mode),
        address_mode_w: None,
        mag_filter: Some(sampling.mag_filter),
        min_filter: Some(sampling.min_filter),
        mipmap_filter: Some(sampling.mipmap_filter),
        lod_min_clamp: None,
        lod_max_clamp: None,
        compare: None,
        max_anisotropy: None,
    };
    device.create_sampler(Some(&desc))
}

fn new_bind_grpup(device: &webgpu::GpuDevice, layout: &webgpu::GpuBindGroupLayout, view: &webgpu::GpuTextureView, sampler: &webgpu::GpuSampler) -> webgpu::GpuBindGroup {
    let desc = webgpu::GpuBindGroupDescriptor {
        label: None,
        layout,
        entries: vec![
            webgpu::GpuBindGroupEntry {
                binding: 0,
                resource: webgpu::GpuBindingResource::GpuTextureView(&view),
            },
            webgpu::GpuBindGroupEntry {
                binding: 1,
                resource: webgpu::GpuBindingResource::GpuSampler(sampler)
            },
        ],
    };

    device.create_bind_group(&desc)
}
