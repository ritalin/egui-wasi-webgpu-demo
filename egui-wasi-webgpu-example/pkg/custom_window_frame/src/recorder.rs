use example_core::{CustomFrameCommand, CustomFrameEffect, ExampleCommand, ExampleEffect, UnhandledEvent, recorder};

use crate::frame;


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

impl recorder::EguiWidgetRecorder for RecoderInner{
    fn setup_from(&mut self, _ctx: &egui::Context) {
        // discard
    }

    fn apply_effect(&mut self, _ctx: &egui::Context, effect: &ExampleEffect) {
        match effect {
            ExampleEffect::CustomFrameEffect(CustomFrameEffect::Initialized(bounds)) => {
                self.state.window_frame.update_bounds(Some(bounds.min), Some(bounds.size()));
            }
            ExampleEffect::CustomFrameEffect(CustomFrameEffect::Changed(status)) => {
                self.state.window_frame.change_status(status);
            }
            _ => (),
        }
    }

    fn bump_events(&mut self, _ctx: &egui::Context, _input: &mut egui::RawInput) {
    }

    fn record(&mut self, ctx: &egui::Context, mut input: egui::RawInput, unhandled_event: &UnhandledEvent, commands: &mut Vec<ExampleCommand>) -> egui::FullOutput {
        if let Some(viewport) = input.viewports.get_mut(&egui::ViewportId::ROOT) {
            viewport.maximized = Some(self.state.window_frame.is_maximized());
            viewport.minimized = Some(self.state.window_frame.is_minimized());
        }

        let output = ctx.run_ui(input, |cx| {
            self.state.window_frame.create_frame(cx, "egui with custom frame", |ui| {
                ui.label("This is just the contents of the window.");
                ui.horizontal(|ui| {
                    ui.label("egui theme:");
                    egui::widgets::global_theme_preference_buttons(ui);
                });
            });
        });

        if let Some(_) = unhandled_event.activate {
            commands.push(ExampleCommand::CustomFrame(CustomFrameCommand::Initialize(example_core::WindowFrameStatus::Normal)));
        }

        self.state.window_frame.handle_viewport_output(&output.viewport_output, commands);

        output
    }
}

#[derive(Default)]
struct AppState {
    window_frame: frame::WindowFrame,
}

// update-custom-frame(custom-frame-info)
// custom-frame-info {
//     initialize,
//     maximize,
//     minimize,
//     drag-move(x, y),
// }
