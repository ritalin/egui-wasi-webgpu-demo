use example_core::{ChangeSpec, ExampleCommand, ExampleEffect};

use crate::keypad;

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
    fn apply_effect(&mut self, _ctx: &egui::Context, _effect: &ExampleEffect) {
        // discard
    }

    fn bump_events(&mut self, ctx: &egui::Context, input: &mut egui::RawInput) {
        self.state.keypad.bump_events(ctx, input);
    }

    fn record(
        &mut self,
        ctx: &egui::Context,
        input: egui::RawInput,
        unhandled_event: &example_core::UnhandledEvent,
        commands: &mut Vec<ExampleCommand>) -> egui::FullOutput
    {
        if let Some(_) = unhandled_event.activate {
            commands.push(ExampleCommand::ChangeSet(vec![
                ChangeSpec { offset: 0, len: 0, new_value: Some(self.state.name.clone()) }
            ]));
        }

        let output = ctx.run_ui(input, |cx| {
            egui::Window::new("Custom Keypad")
                .default_pos([100.0, 100.0])
                .title_bar(true)
                .show(cx, |ui| {
                    ui.horizontal(|ui| {
                        ui.label("Your name: ");
                        ui.text_edit_singleline(&mut self.state.name);
                    });
                    ui.add(egui::Slider::new(&mut self.state.age, 0..=120).text("age"));
                    if ui.button("Increment").clicked() {
                        self.state.age += 1;
                    }
                    ui.label(format!("Hello '{}', age {}", self.state.name, self.state.age));
                })
            ;
            self.state.keypad.show(ctx);
        });

        output
    }
}

struct AppState {
    name: String,
    age: u32,
    keypad: keypad::Keypad,
}

impl AppState {}

impl Default for AppState {
    fn default() -> Self {
        Self {
            name: "Arthur".to_owned(),
            age: 42,
            keypad: keypad::Keypad::new(),
        }
    }
}
