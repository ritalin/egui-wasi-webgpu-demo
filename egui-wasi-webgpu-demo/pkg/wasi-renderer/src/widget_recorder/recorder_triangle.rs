use anyhow::Context;
use crate::{bindings::immediate_renderer_world::{local::immediate_renderer::{surface, types}}, renderer, widget_recorder::ScreenDescriptor};

const SAMPLE_IAMGE: &'static [u8] = include_bytes!("../../assets/img/happy-tree.png");

pub struct TriangleRecorder;

impl super::Recorder for TriangleRecorder {
    type ImageSpec = super::BitmapImage;
    type ImageSpecs = std::vec::IntoIter<Self::ImageSpec>;
    type Output = TriangleOutput;

    fn preset_textures(&self) -> Self::ImageSpecs {
        let image = image::load_from_memory(SAMPLE_IAMGE).context("fauld to load sample image").unwrap().to_rgba8();
        let (width, height) = image.dimensions();

        vec![super::BitmapImage {
            image,
            _size: surface::FrameSize { width, height }
        }].into_iter()
    }

    fn record(&mut self, screen: super::ScreenDescriptor, _events: &[types::Event]) -> Result<Self::Output, anyhow::Error> {
        Ok(TriangleOutput::new(screen))
    }
}

pub struct TriangleOutput {
    vertices: Vec<renderer::Vertex>,
    scissor_rect: renderer::ScissorRect,
}

impl TriangleOutput {
    fn new(screen: ScreenDescriptor) -> Self {
        let vertices = VERTEXIES.iter()
            .map(|v| {
                let x = (1.0 + v.position[0]) / 2.0 * screen.size.width as f32 / screen.scale_factor;
                let y = (1.0 - v.position[1]) / 2.0 * screen.size.height as f32 / screen.scale_factor;

                renderer::Vertex{
                    pos: renderer::Pos2{ x, y },
                    uv: renderer::Pos2{ x: v.uv[0], y: v.uv[1] },
                    color: renderer::Color32::from_rgba_premultiplied(v.color[0], v.color[1], v.color[2], v.color[3]),
                }
            })
            .collect::<Vec<_>>()
        ;
        let (tl, rb) = vertices.iter().fold((renderer::Pos2::new(f32::MAX, f32::MAX), renderer::Pos2::ZERO), |(tl, rb), v| {
            (tl.min(v.pos), rb.max(v.pos))
        });
        let scissor_rect = screen.into_scissor_rect(renderer::Rect::from_min_max(tl, rb));

        // println!("Vertices: {vertices:?}");
        Self {
            vertices,
            scissor_rect,
        }
    }
}

impl super::RecordOutput for TriangleOutput {
    type ImageSpec<'s> = super::BitmapImage;
    type Textures<'s> = std::vec::IntoIter<super::BitmapImage>;

    fn meshes<'s>(&'s self) -> Vec<Option<renderer::Mesh<'s>>> {
        let mesh = renderer::Mesh{
            key: renderer::TextureKey::Managed(1),
            vertices: &self.vertices,
            indices: INDICES,
            scissor_rect: self.scissor_rect,
        };

        vec![Some(mesh)]
    }

    fn textures<'s>(&'s self) -> std::vec::IntoIter<super::BitmapImage> {
        vec![].into_iter()
    }

    fn removed_textures(&self) -> Vec<renderer::TextureKey> {
        vec![]
    }

    fn unhandle_events(&self) -> Vec<types::UnhandleEvent> {
        vec![]
    }
}

#[derive(Clone, Copy, Debug)]
struct InputVertex {
    position: [f32; 3],
    uv: [f32; 2],
    color: [u8; 4],
}

const VERTEXIES: &[InputVertex] = &[
    InputVertex{ position: [0.0, 0.5, 0.0], uv: [0.5, 0.0], color: [255, 0, 0, 255] },
    InputVertex{ position: [-0.5, -0.5, 0.0], uv: [0.0, 1.0], color: [0, 255, 0, 255] },
    InputVertex{ position: [0.5, -0.5, 0.0], uv: [1.0, 1.0], color: [0, 0, 255, 255] },
];

const INDICES: &[u32] = &[
    0, 1, 2
];
