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
    fn setup_from(&mut self, ctx: &egui::Context) {
        ctx.style_mut_of(egui::Theme::Light, AppState::use_light_green_accent);
        ctx.style_mut_of(egui::Theme::Dark, AppState::use_dark_purple_accent);
    }

    fn apply_effect(&mut self, _ctx: &egui::Context, _effect: &example_core::ExampleEffect) {
        // discarf
    }

    fn bump_events(&mut self, _ctx: &egui::Context, _input: &mut egui::RawInput) {
        // discard
    }

    fn record(&mut self, ctx: &egui::Context, input: egui::RawInput, _unhandled_event: &example_core::UnhandledEvent, commands: &mut Vec<example_core::ExampleCommand>) -> egui::FullOutput {
        let output = ctx.run_ui(input, |cx| {
            egui::CentralPanel::default().show_inside(cx, |ui| {
                ui.heading("egui using a customized style");
                ui.label("Switch between dark and light mode to see the different styles in action.");
                egui::global_theme_preference_buttons(ui);
                ui.separator();

                use egui_demo_lib::View;
                self.state.gallery.ui(ui);
            });
        });

        output
    }
}

#[derive(Default)]
struct AppState {
    gallery: egui_demo_lib::WidgetGallery,
}

impl AppState {
    fn use_light_green_accent(style: &mut egui::Style) {
        style.visuals.hyperlink_color = egui::Color32::from_rgb(18, 180, 85);
        style.visuals.text_cursor.stroke.color = egui::Color32::from_rgb(28, 92, 48);
        style.visuals.selection = egui::style::Selection {
            bg_fill: egui::Color32::from_rgb(157, 218, 169),
            stroke: egui::Stroke::new(1.0, egui::Color32::from_rgb(28, 92, 48)),
        };
    }

    fn use_dark_purple_accent(style: &mut egui::Style) {
        style.visuals.hyperlink_color = egui::Color32::from_rgb(202, 135, 227);
        style.visuals.text_cursor.stroke.color = egui::Color32::from_rgb(234, 208, 244);
        style.visuals.selection = egui::style::Selection {
            bg_fill: egui::Color32::from_rgb(105, 67, 119),
            stroke: egui::Stroke::new(1.0, egui::Color32::from_rgb(234, 208, 244)),
        };
    }
}
