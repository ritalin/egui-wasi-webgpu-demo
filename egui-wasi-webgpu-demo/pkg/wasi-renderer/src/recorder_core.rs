use crate::{ScreenDescriptor, render_core, types};

#[derive(Debug, thiserror::Error)]
pub enum RecorderError {

}

pub trait Recorder {
    type ImageSpec: render_core::ImageSpec;
    type ImageSpecs: Iterator<Item = Self::ImageSpec>;
    type Output: RecordOutput;

    fn preset_textures(&self) -> Self::ImageSpecs;
    fn record(&mut self, screen: ScreenDescriptor, events: &[types::Event]) -> Result<Self::Output, RecorderError>;
}

pub trait RecordOutput {
    type ImageSpec<'s>: render_core::ImageSpec where Self: 's;
    type Textures<'s>: Iterator<Item =Self::ImageSpec<'s>> where Self: 's;

    fn meshes<'s>(&'s self) -> Vec<Option<render_core::Mesh<'s>>>;
    fn textures<'s>(&'s self) -> Self::Textures<'s>;
    fn removed_textures(&self) -> Vec<render_core::TextureKey>;
    fn unhandle_events(&self) -> Vec<types::UnhandleEvent>;
}
