use std::{collections::BTreeMap, sync::atomic};

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

    fn populate_viewport_command(&self, sources: &BTreeMap<egui::ViewportId, egui::ViewportOutput>, commands: &mut Vec<ExampleCommand>) {
        if let Some(source) = sources.get(&egui::ViewportId::ROOT) {
            for cmd in &source.commands {
                match cmd {
                    egui::ViewportCommand::Screenshot(_) => {
                        let mut dests = vec![Destination::Origin];

                        commands.push(ExampleCommand::Screenshot(dests));
                    }
                    _ => (),
                }
            }
        }
    }}

thread_local! {
    static COUNTER: atomic::AtomicU64 = atomic::AtomicU64::new(0);
}

fn next_id() -> u64 {
    COUNTER.with(|c| c.fetch_add(1, atomic::Ordering::Relaxed))
}

impl example_core::recorder::EguiWidgetRecorder for RecoderInner{
    fn setup_from(&mut self, ctx: &egui::Context) {
        ctx.set_theme(egui::Theme::Light);
    }

    fn apply_effect(&mut self, ctx: &egui::Context, effect: &ExampleEffect) {
        match effect {
            ExampleEffect::ImageData { bytes, .. } => {
                let id = format!("{}{:10}", Self::SCREENSHOT_ID, next_id());
                ctx.include_bytes(id.clone(), bytes.clone());
                self.state.screenshot_id = Some(id);
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
                    if ui.button("take screenshot!").clicked() {
                        ui.send_viewport_cmd(egui::ViewportCommand::Screenshot(Default::default()));
                    }
                });

                ui.with_layout(egui::Layout::top_down(egui::Align::RIGHT), |ui| {
                    if let Some(id) = self.state.screenshot_id.as_ref() {
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

#[derive(Default)]
struct AppState {
    screenshot_id: Option<String>,
    save_to_clipboard: bool,
    continuously_take_screenshots: bool,
}
