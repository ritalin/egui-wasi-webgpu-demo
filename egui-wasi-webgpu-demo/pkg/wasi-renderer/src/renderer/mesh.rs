use crate::renderer::{Rect, TextureKey, Vertex};

pub struct Mesh<'a> {
    pub key: TextureKey,
    pub vertices: &'a [Vertex],
    pub indices: &'a [u32],
    pub scissor_rect: ScissorRect,
}

pub struct MeshVectorIter<'a> {
    meshes: &'a [Option<Mesh<'a>>]
}
impl<'a> MeshVectorIter<'a> {
    pub fn new(meshes: &'a [Option<Mesh>]) -> Self {
        Self { meshes }
    }

    pub fn vertices(&self) -> impl Iterator<Item = &'a [Vertex]> {
        self.meshes.iter().flatten().map(|m| m.vertices)
    }

    pub fn indices(&self) -> impl Iterator<Item = &'a [u32]> {
        self.meshes.iter().flatten().map(|m| m.indices)
    }

    pub fn clip_rects(&self) -> impl Iterator<Item = ScissorRect> {
        self.meshes.iter().flatten().map(|m| m.scissor_rect)
    }

    pub fn keys(&self) -> impl Iterator<Item = TextureKey> {
        self.meshes.iter().flatten().map(|m| m.key)
    }

    pub fn len(&self) -> usize {
        self.meshes.len()
    }
}

#[derive(Debug)]
pub struct ResolvedMesh<'a> {
    pub vertex_buffer_range: &'a MeshRange<u64>,
    pub index_buffer_range: &'a MeshRange<u64>,
    pub draw_range: &'a MeshRange<u32>,
    pub scissor_rect: &'a ScissorRect,
    pub key: TextureKey,
}

pub struct ResolvedMeshSet {
    vertex_buffer_ranges: Vec<MeshRange<u64>>,
    index_buffer_ranges: Vec<MeshRange<u64>>,
    draw_ranges: Vec<MeshRange<u32>>,
    scissor_rects: Vec<ScissorRect>,
    keys: Vec<TextureKey>,
}

#[derive(Debug, Clone)]
pub struct MeshRange<T> {
    pub offset: T,
    pub len: T,
}

#[derive(Debug, Clone, Copy)]
pub struct ScissorRect {
    pub x: u32,
    pub y: u32,
    pub width: u32,
    pub height: u32,
}
impl ScissorRect {
    pub fn from_clip_rect(clip_rect: Rect, frame_width: u32, frame_height: u32, scale_factor: f32) -> Self {
        let x0 = (clip_rect.left() * scale_factor).round() as u32;
        let y0 = (clip_rect.top() * scale_factor).round() as u32;
        let x1 = (clip_rect.right() * scale_factor).round() as u32;
        let y1 = (clip_rect.bottom() * scale_factor).round() as u32;

        let x = x0.clamp(0, frame_width);
        let y = y0.clamp(0, frame_height);
        let w = u32::saturating_sub(x1.clamp(0, frame_width), x);
        let h = u32::saturating_sub(y1.clamp(0, frame_height), y);

        match ((w != 0), (h != 0)) {
            (true, true) => Self{ x: 0, y: 0, width: frame_width, height: frame_height },
            _ => Self{ x, y, width: w, height: h }
        }
    }
}

impl ResolvedMeshSet {
    pub fn new(capacity: usize, scissor_rects: Vec<ScissorRect>, keys: Vec<TextureKey>) -> Self {
        Self {
            vertex_buffer_ranges: Vec::with_capacity(capacity),
            index_buffer_ranges: Vec::with_capacity(capacity),
            draw_ranges: Vec::with_capacity(capacity),
            scissor_rects,
            keys,
        }
    }

    pub fn push_vertex(&mut self, offset: u32, len: u32, stride_size: u64) {
        self.vertex_buffer_ranges.push(MeshRange{ offset: offset as u64 * stride_size, len: len as u64 * stride_size });
    }

    pub fn push_index(&mut self, offset: u32, len: u32, stride_size: u64) {
        self.index_buffer_ranges.push(MeshRange{ offset: offset as u64 * stride_size, len: len as u64 * stride_size });
        self.draw_ranges.push(MeshRange{ offset, len });
    }

    pub fn iter(&self) -> impl Iterator<Item = ResolvedMesh<'_>> {
        debug_assert_eq!(self.vertex_buffer_ranges.len(), self.index_buffer_ranges.len());
        debug_assert_eq!(self.vertex_buffer_ranges.len(), self.draw_ranges.len());
        debug_assert_eq!(self.vertex_buffer_ranges.len(), self.keys.len());
        debug_assert_eq!(self.index_buffer_ranges.len(), self.draw_ranges.len());
        debug_assert_eq!(self.index_buffer_ranges.len(), self.keys.len());
        debug_assert_eq!(self.draw_ranges.len(), self.keys.len());

        let len = self.vertex_buffer_ranges.len();

        (0..len).map(|i| {
            ResolvedMesh {
                vertex_buffer_range: &self.vertex_buffer_ranges[i],
                index_buffer_range: &self.index_buffer_ranges[i],
                draw_range: &self.draw_ranges[i],
                scissor_rect: &self.scissor_rects[i],
                key: self.keys[i],
            }
        })
    }
}
