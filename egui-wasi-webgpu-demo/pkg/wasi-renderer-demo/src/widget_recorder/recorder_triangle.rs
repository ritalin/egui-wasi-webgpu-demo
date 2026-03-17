// Based on the excellent tutorial "Learn wgpu" by Ben Hansen.
// Original: https://sotrh.github.io/learn-wgpu/
// Licensed under Apache-2.0 or MIT.

use anyhow::Context;
use wasi_renderer::{ScreenDescriptor, recorder_core, render_core, bindings::{surface, types}};

use crate::widget_recorder::BitmapImage;

const SAMPLE_IAMGE: &'static [u8] = include_bytes!("../../assets/img/happy-tree.png");

pub struct TriangleRecorder;

impl recorder_core::Recorder for TriangleRecorder {
    type ImageSpec = BitmapImage;
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

    fn record(&mut self, screen: ScreenDescriptor, _events: &[types::Event]) -> Result<Self::Output, recorder_core::RecorderError> {
        Ok(TriangleOutput::new(screen))
    }
}

pub struct TriangleOutput {
    vertices: Vec<render_core::Vertex>,
    scissor_rect: render_core::ScissorRect,
}

impl TriangleOutput {
    fn new(screen: ScreenDescriptor) -> Self {
        let vertices = VERTEXIES.iter()
            .map(|v| {
                let x = (1.0 + v.position[0]) / 2.0 * screen.size.width as f32 / screen.scale_factor;
                let y = (1.0 - v.position[1]) / 2.0 * screen.size.height as f32 / screen.scale_factor;

                render_core::Vertex{
                    pos: render_core::Pos2{ x, y },
                    uv: render_core::Pos2{ x: v.uv[0], y: v.uv[1] },
                    color: render_core::Color32::from_rgba_premultiplied(v.color[0], v.color[1], v.color[2], v.color[3]),
                }
            })
            .collect::<Vec<_>>()
        ;
        let (tl, rb) = vertices.iter().fold((render_core::Pos2::new(f32::MAX, f32::MAX), render_core::Pos2::ZERO), |(tl, rb), v| {
            (tl.min(v.pos), rb.max(v.pos))
        });
        let scissor_rect = screen.into_scissor_rect(render_core::Rect::from_min_max(tl, rb));

        // println!("Vertices: {vertices:?}");
        Self {
            vertices,
            scissor_rect,
        }
    }
}

impl recorder_core::RecordOutput for TriangleOutput {
    type ImageSpec<'s> = BitmapImage;
    type Textures<'s> = std::vec::IntoIter<BitmapImage>;

    fn meshes<'s>(&'s self) -> Vec<Option<render_core::Mesh<'s>>> {
        let mesh = render_core::Mesh{
            key: render_core::TextureKey::Managed(1),
            vertices: &self.vertices,
            indices: INDICES,
            scissor_rect: self.scissor_rect,
        };

        vec![Some(mesh)]
    }

    fn textures<'s>(&'s self) -> std::vec::IntoIter<super::BitmapImage> {
        vec![].into_iter()
    }

    fn removed_textures(&self) -> Vec<render_core::TextureKey> {
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
