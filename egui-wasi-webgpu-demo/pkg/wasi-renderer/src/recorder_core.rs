use crate::{ScreenDescriptor, render_core, types};

#[derive(Debug, thiserror::Error)]
pub enum RecorderError {

}

pub trait Recorder {
    type ImageSpec<'s>: render_core::ImageSpec + 's where Self: 's;
    type ImageSpecs<'s>: Iterator<Item = Self::ImageSpec<'s>> + 's where Self: 's;
    type Effect;
    type Output<'s>: RecordOutput + 's where Self: 's;

    fn preset_textures<'s>(&'s self) -> Self::ImageSpecs<'s>;
    fn record<'s, I>(
        &'s mut self,
        screen: ScreenDescriptor,
        events: &[types::Event],
        effects: I) -> Result<Self::Output<'s>, RecorderError>
    where
        I: IntoIterator,
        I::Item: Into<Self::Effect>,
    ;
}

pub trait RecordOutput {
    type ImageSpec<'s>: render_core::ImageSpec + 's where Self: 's;
    type Textures<'s>: Iterator<Item =Self::ImageSpec<'s>> + 's where Self: 's;
    type RequestCommand;

    fn meshes<'s>(&'s self) -> Vec<Option<render_core::Mesh<'s>>>;
    fn textures<'s>(&'s self) -> Self::Textures<'s>;
    fn removed_textures(&self) -> Vec<render_core::TextureKey>;
    fn unhandle_events(&self) -> Vec<types::UnhandleEvent>;
    fn command_requests(&self) -> Vec<Self::RequestCommand>;
}
