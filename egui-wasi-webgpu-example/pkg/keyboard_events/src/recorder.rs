use example_core::{ExampleCommand, ExampleEffect};

pub struct RecoderInner {
    state: Content,
}
impl RecoderInner {
    pub fn new() -> Self {
        Self {
            state: Content::default(),
        }
    }
}

impl example_core::recorder::EguiWidgetRecorder for RecoderInner{
    fn setup_from(&mut self, _ctx: &egui::Context) {
        // discard
    }

    fn apply_effect(&mut self, _ctx: &egui::Context, _effect: &ExampleEffect) {
        // discard
    }

    fn bump_events(&mut self, _ctx: &egui::Context, _input: &mut egui::RawInput) {
        // discard
    }

    fn record(&mut self, ctx: &egui::Context, input: egui::RawInput, _unhandled_event: &example_core::UnhandledEvent, _commands: &mut Vec<ExampleCommand>) -> egui::FullOutput {
        let output = ctx.run_ui(input, |ui| {
            egui::CentralPanel::default().show_inside(ui, |ui| {
                ui.heading("Press/Hold/Release example. Press Enter to test.");
                if ui.button("Clear").clicked() {
                    self.state.text.clear();
                }
                egui::ScrollArea::vertical()
                    .auto_shrink(false)
                    .stick_to_bottom(true)
                    .show(ui, |ui| {
                        ui.label(&self.state.text);
                    });

                if ui.input(|i| i.key_pressed(egui::Key::Enter)) {
                    self.state.text.push_str("\nPressed");
                }
                if ui.input(|i| i.key_down(egui::Key::Enter)) {
                    self.state.text.push_str("\nHeld");
                    ui.request_repaint(); // make sure we note the holding.
                }
                if ui.input(|i| i.key_released(egui::Key::Enter)) {
                    self.state.text.push_str("\nReleased");
                }
            });
        });
        output
    }
}

#[derive(Default)]
struct Content {
    text: String,
}
