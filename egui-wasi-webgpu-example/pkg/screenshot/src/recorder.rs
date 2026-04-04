use std::{collections::BTreeMap};

use example_core::{Destination, ExampleCommand, ExampleEffect};

pub struct RecoderInner {
    state: AppState,
}
impl RecoderInner {
    const SCREENSHOT_ID: &str = "urn::ss:";

    pub fn new() -> Self {
        Self {
            state: AppState::default(),
        }
    }

    fn populate_viewport_command(&mut self, sources: &BTreeMap<egui::ViewportId, egui::ViewportOutput>, commands: &mut Vec<ExampleCommand>) {
        if let Some(source) = sources.get(&egui::ViewportId::ROOT) {
            for cmd in &source.commands {
                match cmd {
                    egui::ViewportCommand::Screenshot(_) => {
                        if let (_, ImageStatus::Pending) = self.state.screenshot_id {
                            continue;
                        }

                        self.state.screenshot_id.1 = ImageStatus::Pending;
                        let mut dests = vec![];

                        if self.state.redirect_to_self || self.state.continuously_take_screenshots {
                            dests.push(Destination::Origin);
                            self.state.redirect_to_self = false;
                        }
                        if self.state.save_to_clipboard {
                            dests.push(Destination::Clipboard);
                            self.state.save_to_clipboard = false;
                        }
                        commands.push(ExampleCommand::Screenshot(dests));
                    }
                    _ => (),
                }
            }
        }
    }
}

impl example_core::recorder::EguiWidgetRecorder for RecoderInner{
    fn setup_from(&mut self, ctx: &egui::Context) {
        ctx.set_theme(egui::Theme::Light);
    }

    fn apply_effect(&mut self, ctx: &egui::Context, effect: &ExampleEffect) {
        match effect {
            ExampleEffect::ImageData { bytes, .. } => {
                if let Ok(bytes) = into_premultiplied_image(bytes) {
                    let id = format!("{}{:10}", Self::SCREENSHOT_ID, 1);
                    ctx.forget_image(&id.clone());
                    ctx.include_bytes(id.clone(), bytes);
                    self.state.screenshot_id = (Some(id), ImageStatus::Ready);
                }
            }
            _ => (),
        }
    }

    fn bump_events(&mut self, _ctx: &egui::Context, _input: &mut egui::RawInput) {
        // discard
    }

    fn record(&mut self, ctx: &egui::Context, input: egui::RawInput, _unhandled_event: &example_core::UnhandledEvent, commands: &mut Vec<ExampleCommand>) -> egui::FullOutput {
        let output = ctx.run_ui(input, |ui| {
            egui::CentralPanel::default().show_inside(ui, |ui| {
                ui.horizontal(|ui| {
                    ui.checkbox(
                        &mut self.state.continuously_take_screenshots,
                        "continuously take screenshots",
                    );
                    if self.state.continuously_take_screenshots {
                        if ui.add(egui::Label::new("hover me!").sense(egui::Sense::hover())).hovered() {
                            ui.ctx().set_theme(egui::Theme::Dark);
                        }
                        else {
                            ui.ctx().set_theme(egui::Theme::Light);
                        }
                        ui.send_viewport_cmd(egui::ViewportCommand::Screenshot(Default::default()));
                    }
                    else {
                        let button = ui.add_enabled(
                            self.state.screenshot_id.1 == ImageStatus::Ready,
                            egui::Button::new("take screenshot!").small()
                        );
                        if button.clicked() {
                            self.state.redirect_to_self = true;
                            ui.send_viewport_cmd(egui::ViewportCommand::Screenshot(Default::default()));
                        }
                    }

                    if ui.button("save to clipboard").clicked() {
                        self.state.save_to_clipboard = true;
                        ui.send_viewport_cmd(egui::ViewportCommand::Screenshot(Default::default()));
                    }
                });

                ui.with_layout(egui::Layout::top_down(egui::Align::RIGHT), |ui| {
                    if let Some(id) = self.state.screenshot_id.0.as_ref() {
                        ui.image(id);
                    } else {
                        ui.spinner();
                    }
                });
            });
        });

        self.populate_viewport_command(&output.viewport_output, commands);

        output
    }
}

#[derive(Default, Clone, Copy, PartialEq)]
enum ImageStatus {
    #[default]
    Ready,
    Pending,
}

#[derive(Default)]
struct AppState {
    screenshot_id: (Option<String>, ImageStatus),
    redirect_to_self: bool,
    save_to_clipboard: bool,
    continuously_take_screenshots: bool,
}

fn into_premultiplied_image(souece: &[u8]) -> Result<Vec<u8>, image::ImageError> {
    let mut img = image::load_from_memory(souece)?.to_rgba8();

    // premultiply
    for pixel in img.pixels_mut() {
        let [r, g, b, a] = pixel.0;

        let a = a as u16;

        const K: f32 = 0.88;
        pixel.0 = [
            ((r as f32 * a as f32) / 255.0 / K) as u8,
            ((g as f32 * a as f32) / 255.0 / K) as u8,
            ((b as f32 * a as f32) / 255.0 / K) as u8,
            a as u8,
        ];
    }

    let mut out = Vec::new();
    img.write_to(
        &mut std::io::Cursor::new(&mut out),
        image::ImageFormat::Png,
    )?;

    Ok(out)
}
