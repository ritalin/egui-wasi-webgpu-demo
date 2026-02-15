use std::marker::PhantomData;

use egui::{RawInput, Vec2};

use crate::supports::{egui_supports, egui_texture::{EguiOutput, EguiTexture, EguiTextureSet}};

pub struct CounterWidgetRecorder<'a> {
    egui_context: egui::Context,
    values: Vec<usize>,
    _marker: PhantomData<&'a ()>
}

impl<'a> CounterWidgetRecorder<'a> {
    pub fn new() -> Self {
        let egui_context = egui::Context::default();

        Self { egui_context, values: vec![0], _marker: PhantomData }
    }
}

impl<'a> super::Recorder for CounterWidgetRecorder<'a> {
    type ImageSpec = EguiTexture<'a>;
    type ImageSpecs = EguiTextureSet<'a>;
    type Output = EguiOutput;

    fn preset_textures(&self) -> Self::ImageSpecs {
        EguiTextureSet::default()
    }

    fn record(&mut self, screen: super::ScreenDescriptor, events: &[crate::bindings::immediate_renderer_world::local::immediate_renderer::types::Event]) -> Result<Self::Output, anyhow::Error> {
        let mut input = RawInput::default();
        egui_supports::populate_events(events, &screen, &mut input);

        let unhandled_event = vec![];

        let output = self.egui_context.run(input, |cx| {
            egui::CentralPanel::default().show(cx, |ui| {
                ui.with_layout(egui::Layout::top_down_justified(egui::Align::Min), |ui| {
                    for (i, value) in self.values.iter_mut().enumerate() {
                        egui::Frame::group(ui.style()).show(ui, |ui| {
                            ui.horizontal(|ui| {
                                ui.label("Value#".to_string() + &(i+1).to_string());

                                ui.add_sized(
                                    Vec2::new(64.0, 24.0),
                                    egui::TextEdit::singleline(&mut value.to_string())
                                        .horizontal_align(egui::Align::Max)
                                        .frame(false)
                                        .background_color(egui::Color32::TRANSPARENT)
                                        .font(egui::TextStyle::Heading)
                                        .interactive(false)
                                );

                                let dec = ui.add_enabled(*value > 0, egui::Button::new("-").min_size(Vec2::new(32.0, 24.0)));
                                if dec.clicked() {
                                    if *value > 0 { *value -= 1 }
                                }

                                let inc = ui.add(egui::Button::new("+").min_size(Vec2::new(32.0, 24.0)));
                                if inc.clicked() {
                                    *value += 1;
                                }
                            });
                        });
                    }

                    ui.horizontal(|ui| {
                        let add = ui.add_enabled(self.values.len() < 10, egui::Button::new("add counter").min_size(Vec2::new(64.0, 24.0)));
                        if add.clicked() {
                            self.values.push(0);
                        }
                        let del = ui.add_enabled(self.values.len() > 1, egui::Button::new("remove last counter").min_size(Vec2::new(64.0, 24.0)));
                        if del.clicked() {
                            self.values.pop();
                        }
                    });
                });
            });
        });
        let shapes = self.egui_context.tessellate(output.shapes, screen.scale_factor);

        Ok(EguiOutput::new(
            screen,
            shapes,
            output.textures_delta,
            unhandled_event,
        ))
    }
}
