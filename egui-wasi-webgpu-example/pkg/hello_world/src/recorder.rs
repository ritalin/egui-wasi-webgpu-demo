use example_core::{ChangeSpec, ExampleCommand, ExampleEffect};

pub struct RecoderInner {
    state: AppState,
}
impl RecoderInner {
    pub fn new() -> Self {
        Self {
            state: AppState::default(),
        }
    }
}

impl example_core::recorder::EguiWidgetRecorder for RecoderInner{
    fn apply_effect(&mut self, ctx: &egui::Context, effect: &ExampleEffect) {
        match effect {
            ExampleEffect::ImageData{ bytes, url } => {
                match self.state.logo.as_mut() {
                    Some((old_url, status@ImageStatus::Ready)) if url == old_url => (),
                    _ => {
                        println!("url: {url}, bytes: {}", bytes.len());
                        ctx.include_bytes(url.clone(), bytes.clone());
                        self.state.logo = Some((url.clone(), ImageStatus::Ready));
                    }
                }
            }
            _ => (),
        }
    }

    fn bump_events(&mut self, _ctx: &egui::Context, _input: &mut egui::RawInput) {
        // discard
    }

    fn record(&mut self, ctx: &egui::Context, input: egui::RawInput, unhandled_event: &example_core::UnhandledEvent, commands: &mut Vec<ExampleCommand>) -> egui::FullOutput {
        if let Some(_) = unhandled_event.activate {
            commands.push(ExampleCommand::ChangeSet(vec![
                ChangeSpec { offset: 0, len: 0, new_value: Some(self.state.name.clone()) }
            ]));
        }

        let mut request_img = None;

        let output = ctx.run_ui(input, |cx| {
            egui::CentralPanel::default().show_inside(cx, |ui| {
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

        if let Some(url) = request_img {
            commands.push(ExampleCommand::RequestImage{ paths: vec![url] });
        }

        output
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
