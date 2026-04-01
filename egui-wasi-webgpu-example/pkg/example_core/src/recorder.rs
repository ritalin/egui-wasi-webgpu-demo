use std::marker::PhantomData;

use wasi_renderer::{ScreenDescriptor, bindings::types, recorder_core};

use crate::{ExampleCommand, ExampleEffect, UnhandledEvent, supports::{self, EguiOutput, EguiTexture, EguiTextureSet}};

pub struct EguiRecoder<'a, RecorderInner: EguiWidgetRecorder + 'a> {
    egui_context: egui::Context,
    in_compositioning: bool,
    inner: RecorderInner,
    _phantom: PhantomData<&'a ()>,
}
impl<'a, RecorderInner: EguiWidgetRecorder + 'a> EguiRecoder<'a, RecorderInner> {
    pub fn new(inner: RecorderInner) -> Self {
        let egui_context = egui::Context::default();
        egui_extras::install_image_loaders(&egui_context);

        Self {
            egui_context,
            in_compositioning: false,
            inner,
            _phantom: PhantomData,
        }
    }

    fn apply_effects(&mut self, effects: impl Iterator<Item = ExampleEffect>) {
        for effect in effects {
            self.inner.apply_effect(&self.egui_context, &effect);

            match effect {
                ExampleEffect::FontData { name, bytes, url } => {
                    println!("*** Apply font/name: {}, path: {}, size: {}", name, url, bytes.len());
                    let font_data = egui::FontData::from_owned(bytes);
                    let font_families = vec![epaint::text::InsertFontFamily{
                        family: egui::FontFamily::Proportional,
                        priority: epaint::text::FontPriority::Highest,
                    }];

                    self.egui_context.add_font(epaint::text::FontInsert::new(&name, font_data, font_families));
                }
                _ => (),
            }
        }
    }
}

impl<'a, RecorderInner: EguiWidgetRecorder + 'a> recorder_core::Recorder for EguiRecoder<'a, RecorderInner> {
    type ImageSpec<'s> = EguiTexture<'s> where 'a: 's;
    type ImageSpecs<'s> = EguiTextureSet<'s> where 'a: 's;
    type Effect = ExampleEffect;
    type Output<'s> = EguiOutput where 'a: 's;

    fn preset_textures<'s>(&'s self) -> Self::ImageSpecs<'s> {
        EguiTextureSet::default()
    }

    fn record<'s, I>(&'s mut self, screen: ScreenDescriptor, events: &[types::Event], effects: I) -> Result<Self::Output<'s>, recorder_core::RecorderError>
    where
        I: IntoIterator,
        I::Item: Into<Self::Effect>,
    {
        let mut input = egui::RawInput::default();
        let unhandled_event = supports::populate_events(events, &screen, &mut self.in_compositioning, &mut input);

        self.apply_effects(effects.into_iter().map(|c| c.into()));

        let mut commands = vec![];
        let output = self.inner.record(&self.egui_context, input, &unhandled_event, &mut commands);
        let shapes = self.egui_context.tessellate(output.shapes, screen.scale_factor);

        supports::push_platform_output(&self.egui_context, output.platform_output, &mut commands);

        Ok(EguiOutput::new(
            screen,
            shapes,
            output.textures_delta,
            vec![],
            commands
        ))
    }
}

pub trait EguiWidgetRecorder {
    fn apply_effect(&mut self, ctx: &egui::Context, effect: &ExampleEffect);
    fn record(&mut self, ctx: &egui::Context, input: egui::RawInput, unhandled_event: &UnhandledEvent, commands: &mut Vec<ExampleCommand>) -> egui::FullOutput;
}
