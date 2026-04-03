
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
    fn setup_from(&mut self, _ctx: &egui::Context) {
        // discard
    }

    fn apply_effect(&mut self, _ctx: &egui::Context, effect: &example_core::ExampleEffect) {
        if effect == &example_core::ExampleEffect::RequestCloseQuery {
            self.state.closing_status = ClosingStatus::Query;
        }
    }

    fn bump_events(&mut self, _ctx: &egui::Context, _input: &mut egui::RawInput) {
        // discard
    }

    fn record(&mut self, ctx: &egui::Context, input: egui::RawInput, _unhandled_event: &example_core::UnhandledEvent, _commands: &mut Vec<example_core::ExampleCommand>) -> egui::FullOutput {
        let output = ctx.run_ui(input, |ui| {
            egui::CentralPanel::default().show_inside(ui, |ui| {
                ui.heading("Try to close the window");
                ui.checkbox(&mut self.state.show_confirmation_dialog, "With confirm");

                if ui.button("Request close").clicked() {
                    ui.send_viewport_cmd(
                        if self.state.show_confirmation_dialog {egui::ViewportCommand::CancelClose}
                        else {egui::ViewportCommand::Close}
                    );
                }
            });

            if self.state.closing_status == ClosingStatus::Query {
                egui::Window::new("Do you want to quit?")
                    .collapsible(false)
                    .resizable(false)
                    .show(ui.ctx(), |ui| {
                        ui.horizontal(|ui| {
                            if ui.button("No").clicked() {
                                self.state.closing_status = ClosingStatus::Pending;
                            }

                            if ui.button("Yes").clicked() {
                                self.state.closing_status = ClosingStatus::Accepted;
                                ui.send_viewport_cmd(egui::ViewportCommand::Close);
                            }
                        });
                    });
            }
        });
        output
    }
}

#[derive(Default, Clone, Copy, PartialEq)]
enum ClosingStatus {
    #[default]
    Pending,
    Query,
    Accepted,
}

#[derive(Default)]
struct AppState {
    show_confirmation_dialog: bool,
    closing_status: ClosingStatus,
}
