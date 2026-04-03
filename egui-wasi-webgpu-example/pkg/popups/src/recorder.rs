use example_core::{ExampleCommand, ExampleEffect};

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

    fn apply_effect(&mut self, _ctx: &egui::Context, _effect: &ExampleEffect) {
        // discard
    }

    fn bump_events(&mut self, _ctx: &egui::Context, _input: &mut egui::RawInput) {
        // discard
    }

    fn record(&mut self, ctx: &egui::Context, input: egui::RawInput, _unhandled_event: &example_core::UnhandledEvent, _commands: &mut Vec<ExampleCommand>) -> egui::FullOutput {
        let output = ctx.run_ui(input, |ui| {
            egui::CentralPanel::default().show_inside(ui, |ui| {
                ui.label("PopupCloseBehavior::CloseOnClick popup");
                egui::ComboBox::from_label("ComboBox")
                    .selected_text(format!("{}", self.state.number))
                    .show_ui(ui, |ui| {
                        for num in 0..10 {
                            ui.selectable_value(&mut self.state.number, num, format!("{num}"));
                        }
                    });

                ui.label("PopupCloseBehavior::CloseOnClickOutside popup");
                egui::ComboBox::from_label("Ignore Clicks")
                    .close_behavior(egui::PopupCloseBehavior::CloseOnClickOutside)
                    .selected_text("Select Numbers")
                    .show_ui(ui, |ui| {
                        ui.label("This popup will be open even if you click the checkboxes");
                        for (i, num) in self.state.numbers.iter_mut().enumerate() {
                            ui.checkbox(num, format!("Checkbox {}", i + 1));
                        }
                    });

                ui.label("PopupCloseBehavior::IgnoreClicks popup");
                let response = ui.button("Open");

                egui::Popup::menu(&response)
                    .close_behavior(egui::PopupCloseBehavior::IgnoreClicks)
                    .show(|ui| {
                        ui.set_min_width(310.0);
                        ui.label("This popup will be open until you press the button again");
                        ui.checkbox(&mut self.state.checkbox, "Checkbox");
                    });
            });
        });
        output
    }
}

#[derive(Default)]
struct AppState {
    checkbox: bool,
    number: u8,
    numbers: [bool; 10],
}
