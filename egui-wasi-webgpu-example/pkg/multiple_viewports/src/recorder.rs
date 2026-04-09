use std::sync::{Arc, atomic};

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

    fn record(&mut self, ctx: &egui::Context, input: egui::RawInput, _unhandled_event: &example_core::UnhandledEvent, commands: &mut Vec<ExampleCommand>) -> egui::FullOutput {
        let output = ctx.run_ui(input, |ui| {
            egui::CentralPanel::default().show_inside(ui, |ui| {
                ui.label("Hello from the root viewport");

                ui.checkbox(
                    &mut self.state.show_immediate_viewport,
                    "Show immediate child viewport",
                );

                {
                    let mut show_deferred_viewport =
                        self.state.show_deferred_viewport.load(atomic::Ordering::Relaxed);
                    ui.checkbox(&mut show_deferred_viewport, "Show deferred child viewport");
                    self.state.show_deferred_viewport
                        .store(show_deferred_viewport, atomic::Ordering::Relaxed);
                }
            });
        });
        output
    }
}

#[derive(Default)]
struct AppState {
    /// Immediate viewports are show immediately, so passing state to/from them is easy.
    /// The downside is that their painting is linked with the parent viewport:
    /// if either needs repainting, they are both repainted.
    show_immediate_viewport: bool,

    /// Deferred viewports run independent of the parent viewport, which can save
    /// CPU if only some of the viewports require repainting.
    /// However, this requires passing state with `Arc` and locks.
    show_deferred_viewport: Arc<atomic::AtomicBool>,
}
