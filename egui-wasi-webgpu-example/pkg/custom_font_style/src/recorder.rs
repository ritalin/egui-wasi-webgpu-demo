use std::collections::BTreeMap;

pub struct RecoderInner {
    state: AppState,
}
impl RecoderInner {
    pub fn new() -> Self {
        Self {
            state: AppState,
        }
    }
}

impl example_core::recorder::EguiWidgetRecorder for RecoderInner{
    fn setup_from(&mut self, ctx: &egui::Context) {
        self.state.configure_text_styles(ctx);
    }

    fn apply_effect(&mut self, _ctx: &egui::Context, _effect: &example_core::ExampleEffect) {
        // discard
    }

    fn bump_events(&mut self, _ctx: &egui::Context, _input: &mut egui::RawInput) {
        // discard
    }

    fn record(&mut self, ctx: &egui::Context, input: egui::RawInput, _unhandled_event: &example_core::UnhandledEvent, _commands: &mut Vec<example_core::ExampleCommand>) -> egui::FullOutput {
        let output = ctx.run_ui(input, |ui| {
            ui.heading("Top Heading");
            ui.add_space(5.);
            ui.label(LOREM_IPSUM);
            ui.add_space(15.);
            ui.label(egui::RichText::new("Sub Heading").text_style(AppState::heading2()).strong());
            ui.monospace(LOREM_IPSUM);
            ui.add_space(15.);
            ui.label(egui::RichText::new("Context").text_style(AppState::heading3()).strong());
            ui.add_space(5.);
            ui.label(LOREM_IPSUM);
        });
        output
    }
}

struct AppState;
impl AppState {
    fn configure_text_styles(&self, ctx: &egui::Context) {
        use egui::FontFamily::{Monospace, Proportional};

        let text_styles: BTreeMap<egui::TextStyle, egui::FontId> = [
            (egui::TextStyle::Heading, egui::FontId::new(25.0, Proportional)),
            (Self::heading2(), egui::FontId::new(22.0, Proportional)),
            (Self::heading3(), egui::FontId::new(19.0, Proportional)),
            (egui::TextStyle::Body, egui::FontId::new(16.0, Proportional)),
            (egui::TextStyle::Monospace, egui::FontId::new(12.0, Monospace)),
            (egui::TextStyle::Button, egui::FontId::new(12.0, Proportional)),
            (egui::TextStyle::Small, egui::FontId::new(8.0, Proportional)),
        ]
        .into();
        ctx.all_styles_mut(move |style| style.text_styles = text_styles.clone());
    }

    #[inline]
    fn heading2() -> egui::TextStyle {
        egui::TextStyle::Name("Heading2".into())
    }

    #[inline]
    fn heading3() -> egui::TextStyle {
        egui::TextStyle::Name("ContextHeading".into())
    }
}

pub const LOREM_IPSUM: &str = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
