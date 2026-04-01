use egui::{RawInput};
use wasi_renderer::{ScreenDescriptor, bindings::types, recorder_core};

use example_core::{ChangeSpec, ExampleCommand, ExampleEffect, supports::{egui_supports, EguiOutput, EguiTexture, EguiTextureSet}};

pub struct RecoderInner {
    egui_context: egui::Context,
    state: AppState,
    in_compositioning: bool,
}
impl RecoderInner {
    pub fn new() -> Self {
        let egui_context = egui::Context::default();
        egui_extras::install_image_loaders(&egui_context);

        Self {
            egui_context,
            state: AppState::default(),
            in_compositioning: false,
        }
    }

    fn apply_effects(&mut self, effects: impl Iterator<Item = ExampleEffect>) {
        for effect in effects {
            match effect {
                ExampleEffect::ImageData{ bytes, url } => {
                    match self.state.logo.as_mut() {
                        Some((old_url, status@ImageStatus::Ready)) if &url == old_url => (),
                        _ => {
                            println!("url: {url}, bytes: {}", bytes.len());
                            self.egui_context.include_bytes(url.clone(), bytes.clone());
                            self.state.logo = Some((url, ImageStatus::Ready));
                        }
                    }
                }
                ExampleEffect::FontData { name, bytes, url } => {
                    println!("*** Apply font/name: {}, path: {}, size: {}", name, url, bytes.len());
                    let font_data = egui::FontData::from_owned(bytes);
                    let font_families = vec![epaint::text::InsertFontFamily{
                        family: egui::FontFamily::Proportional,
                        priority: epaint::text::FontPriority::Highest,
                    }];

                    self.egui_context.add_font(epaint::text::FontInsert::new(&name, font_data, font_families));
                }
            }
        }
    }
}

struct AppState {
    name: String,
    age: u32,
    logo: Option<(String, ImageStatus)>,
}
impl Default for AppState {
    fn default() -> Self {
        Self {
            name: "Arthur".to_owned(),
            age: 42,
            logo: None,
        }
    }
}

enum ImageStatus { Pending, Ready }

impl recorder_core::Recorder for RecoderInner {
    type ImageSpec<'s> = EguiTexture<'s>;
    type ImageSpecs<'s> = EguiTextureSet<'s>;
    type Effect = ExampleEffect;
    type Output<'s> = EguiOutput;

    fn preset_textures<'s>(&'s self) -> Self::ImageSpecs<'s> {
        EguiTextureSet::default()
    }

    fn record<'s, I>(&'s mut self, screen: ScreenDescriptor, events: &[types::Event], effects: I) -> Result<Self::Output<'s>, recorder_core::RecorderError>
    where
        I: IntoIterator,
        I::Item: Into<Self::Effect>,
    {
        let mut input = RawInput::default();
        let unhandled_event = egui_supports::populate_events(events, &screen, &mut self.in_compositioning, &mut input);

        let mut commands = vec![];

        let mut request_img = None;

        self.apply_effects(effects.into_iter().map(|c| c.into()));

        let output = self.egui_context.run(input, |cx| {
            egui::CentralPanel::default().show(cx, |ui| {
                ui.heading("My egui Application");
                ui.horizontal(|ui| {
                    let name_label = ui.label("Your name: ");
                    let res = ui.text_edit_singleline(&mut self.state.name)
                        .labelled_by(name_label.id)
                    ;
                    if res.changed() && res.has_focus() {
                        // if let Some() = res.
                    }
                });
                ui.add(egui::Slider::new(&mut self.state.age, 0..=120).text("age"));
                if ui.button("Increment").clicked() {
                    self.state.age += 1;
                }
                ui.colored_label(egui::Color32::LIGHT_GREEN, format!("Hello '{}', age {}", self.state.name, self.state.age));

                match self.state.logo.as_mut() {
                    None => {
                        let url = "/assets/ferris.png".to_string();
                        request_img = Some(url.clone());
                        self.state.logo = Some((url, ImageStatus::Pending));
                    }
                    Some((url, ImageStatus::Ready)) => {
                        ui.image(url.clone());
                    }
                    _ => (),
                };
            });
        });
        let shapes = self.egui_context.tessellate(output.shapes, screen.scale_factor);

        if let Some(url) = request_img {
            commands.push(ExampleCommand::RequestImage{ paths: vec![url] });
        }
        egui_supports::push_platform_output(&self.egui_context, output.platform_output, &mut commands);

        for (id, _delta) in &output.textures_delta.set {
            println!("id: {:?}, ", id);
        }

        if let Some(_) = unhandled_event.activate {
            commands.push(ExampleCommand::ChangeSet(vec![
                ChangeSpec { offset: 0, len: 0, new_value: Some(self.state.name.clone()) }
            ]));
        }

        Ok(EguiOutput::new(
            screen,
            shapes,
            output.textures_delta,
            vec![],
            commands
        ))
    }
}
