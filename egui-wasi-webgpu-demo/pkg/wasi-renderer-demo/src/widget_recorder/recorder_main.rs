use egui::RawInput;
use wasi_renderer::{ScreenDescriptor, recorder_core, bindings::types};

use crate::{supports::{egui_supports, egui_texture::{EguiOutput, EguiTexture, EguiTextureSet}}};

pub struct MainWidgetRecorder {
    egui_context: egui::Context,
}
impl MainWidgetRecorder {
    pub fn new() -> Self {
        let egui_context = egui::Context::default();
        egui_context.set_theme(egui::Theme::Light);

        Self {
            egui_context,
        }
    }
}

impl recorder_core::Recorder for MainWidgetRecorder {
    type ImageSpec<'s> = EguiTexture<'s>;
    type ImageSpecs<'s> = EguiTextureSet<'s>;
    type Effect = ();
    type Output<'s> = EguiOutput;

    fn preset_textures<'s>(&'s self) -> Self::ImageSpecs<'s> {
        EguiTextureSet::default()
    }

    fn record<'s, I>(&'s mut self, screen: ScreenDescriptor, events: &[types::Event], _effects: I) -> Result<Self::Output<'s>, recorder_core::RecorderError>
    where
        I: IntoIterator,
        I::Item: Into<()>,
    {
        let mut input = RawInput::default();
        egui_supports::populate_events(events, &screen, &mut input);

        let mut unhandled_event = vec![];

        // log::debug!("ppp: {:?}", input.viewports.get(&egui::ViewportId::ROOT).unwrap().native_pixels_per_point);

        let output = self.egui_context.run(input, |cx| {
            egui::CentralPanel::default().show(cx, |ui| {
                ui.with_layout(egui::Layout::top_down_justified(egui::Align::Min), |ui| {
                    ui.label(egui::RichText::new("Menu").size(16.0));

                    let b = egui::Button::new(egui::RichText::new("Show Triangle").size(24.0).strong()).min_size(egui::Vec2::new(0.0, 60.0));
                    if ui.add(b).clicked() {
                        // println!("CLICKED: Show Triangle");
                        unhandled_event.push(types::UnhandleEvent::OpenWindow("route://app/polygon".into()));
                    }
                    let b = egui::Button::new(egui::RichText::new("Counter app").size(24.0).strong()).min_size(egui::Vec2::new(0.0, 60.0));
                    if ui.add(b).clicked() {
                        unhandled_event.push(types::UnhandleEvent::OpenWindow("route://app/counter".into()));
                    }
                });
            });
        });
        let shapes = self.egui_context.tessellate(output.shapes, screen.scale_factor);

        // println!("(record) shapes/len: {}", shapes.len());
        // println!("(record) texture/len: {}", output.textures_delta.set.len());
        // println!("(record) shape/{:?}", shapes.iter().map(|s| &s.primitive).collect::<Vec<_>>());

        Ok(EguiOutput::new(
            screen,
            shapes,
            output.textures_delta,
            unhandled_event,
        ))
    }
}
