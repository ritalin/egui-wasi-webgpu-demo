use std::collections::BTreeMap;

use egui::UiBuilder;
use example_core::{CustomFrameCommand, ExampleCommand, WindowFrameStatus};

#[derive(Default)]
pub struct WindowFrame {
    origin: egui::Pos2,
    size: egui::Vec2,
    status: WindowFrameStatus,
    dragging_delta: Option<egui::Vec2>,
}
impl WindowFrame {
    const TITLEBAR_HEIGHT: f32 = 32.0;
    const FRAME_BUTTON_HEIGHT:f32 = 12.0;

    pub fn create_frame(&mut self, ui: &mut egui::Ui, title: &str, add_contents: impl FnOnce(&mut egui::Ui)) {
        let panel_frame = egui::Frame::new()
            .fill(ui.global_style().visuals.window_fill())
            .corner_radius(10)
            .stroke(ui.global_style().visuals.widgets.noninteractive.fg_stroke)
            .outer_margin(1); // so the stroke is within the bounds

        panel_frame.show(ui, |ui| {
            let app_rect = ui.max_rect();

            ui.expand_to_include_rect(app_rect); // Expand frame to include it all

            let title_bar_height = Self::TITLEBAR_HEIGHT;
            let title_bar_rect = {
                let mut rect = app_rect;
                rect.max.y = rect.min.y + title_bar_height;
                rect
            };
            self.title_bar_ui(ui, title_bar_rect, title);

            if !self.is_minimized() {
                // Add the contents:
                let content_rect = {
                    let mut rect = app_rect;
                    rect.min.y = title_bar_rect.max.y;
                    rect
                }
                .shrink(4.0);
                let mut content_ui = ui.new_child(UiBuilder::new().max_rect(content_rect));
                add_contents(&mut content_ui);
            }
        });
    }

    fn title_bar_ui(&mut self, ui: &mut egui::Ui, title_bar_rect: egui::Rect, title: &str) {
        use egui::{Align2, FontId, Id, PointerButton, Sense, vec2};

        let painter = ui.painter();

        let title_bar_response = ui.interact(
            title_bar_rect,
            Id::new("title_bar"),
            Sense::click_and_drag(),
        );

        // Paint the title:
        painter.text(
            title_bar_rect.center(),
            Align2::CENTER_CENTER,
            title,
            FontId::proportional(20.0),
            ui.style().visuals.text_color(),
        );

        // Paint the line under the title:
        painter.line_segment(
            [
                title_bar_rect.left_bottom() + vec2(1.0, 0.0),
                title_bar_rect.right_bottom() + vec2(-1.0, 0.0),
            ],
            ui.visuals().widgets.noninteractive.bg_stroke,
        );

        // Interact with the title bar (drag to move window):
        if title_bar_response.double_clicked() {
            println!("*** window-frame/status: {:?}", self.status);
            match ui.input(|i| i.viewport().maximized.unwrap_or(false)) {
                false if self.status == WindowFrameStatus::Minimize => {
                    // Minimize -> Normal
                    ui.send_viewport_cmd(egui::ViewportCommand::Maximized(false));
                }
                false => {
                    // Normal -> maximize
                    ui.send_viewport_cmd(egui::ViewportCommand::Maximized(true));
                }
                true => {
                    // Maximize -> Normal
                    ui.send_viewport_cmd(egui::ViewportCommand::Maximized(false));
                }
            }
        }

        if title_bar_response.drag_started_by(PointerButton::Primary) {
            let p1 = ui.input(|ss| ss.pointer.press_origin());
            let p2 = ui.input(|ss| ss.pointer.latest_pos());
            println!("*** drag_start: p#1: {p1:?}, p#2: {p2:?}");

            self.dragging_delta = Some(egui::Vec2::default());
            ui.send_viewport_cmd(egui::ViewportCommand::StartDrag);
        }
        if let Some(delta) = self.dragging_delta.as_mut() {
            if title_bar_response.dragged_by(PointerButton::Primary) {
                let p0 = ui.input(|ss| ss.pointer.press_origin());
                let p1 = ui.input(|ss| ss.pointer.latest_pos());
                let r1 = ui.viewport(|ss| ss.input.viewport().outer_rect);

                if let (Some(p0), Some(p1), Some(r1)) = (p0, p1, r1) {
                    *delta = p1 + r1.min.to_vec2() - self.origin - p0.to_vec2();
                    let p = self.origin + *delta ;
                    ui.send_viewport_cmd(egui::ViewportCommand::CursorPosition(p));
                    ui.send_viewport_cmd(egui::ViewportCommand::StartDrag);
                }
            }
            if title_bar_response.drag_stopped_by(PointerButton::Primary) {
                println!("*** drag_end");
                self.origin += *delta;
                self.dragging_delta = None;
            }
        }

        let builder = UiBuilder::new()
            .max_rect(title_bar_rect)
            .layout(egui::Layout::right_to_left(egui::Align::Center))
        ;
        ui.scope_builder(builder, |ui| {
            ui.spacing_mut().item_spacing.x = 0.0;
            ui.visuals_mut().button_frame = false;
            ui.add_space(8.0);
            self.close_maximize_minimize(ui);
        });
    }

    /// Show some close/maximize/minimize buttons for the native window.
    fn close_maximize_minimize(&mut self, ui: &mut egui::Ui) {
        use egui::{Button, RichText};

        let button_height = Self::FRAME_BUTTON_HEIGHT;

        let close_response = ui
            .add(Button::new(RichText::new("❌").size(button_height)))
            .on_hover_text("Close the window");
        if close_response.clicked() {
            ui.send_viewport_cmd(egui::ViewportCommand::Close);
        }

        let is_maximized = ui.input(|i| i.viewport().maximized.unwrap_or(false));
        let button = Button::new(RichText::new("🗗").size(button_height));
        if is_maximized {
            if ui.add(button).on_hover_text("Restore window").clicked() {
                ui.send_viewport_cmd(egui::ViewportCommand::Maximized(false));
            }
        }
        else {
            if ui.add(button).on_hover_text("Maximize window").clicked() {
                ui.send_viewport_cmd(egui::ViewportCommand::Maximized(true));
            }
        }

        let is_minimized = ui.input(|i| i.viewport().minimized.unwrap_or(false));
        let button = Button::new(RichText::new("🗕").size(button_height));
        if is_minimized {
            if ui.add(button).on_hover_text("Restore window").clicked() {
                ui.send_viewport_cmd(egui::ViewportCommand::Minimized(false));
            }
        }
        else {
            if ui.add(button).on_hover_text("Minimize the window").clicked() {
                ui.send_viewport_cmd(egui::ViewportCommand::Minimized(true));
            }
        }
    }

    pub fn handle_viewport_output(&self, viewport_output: &BTreeMap<egui::ViewportId, egui::ViewportOutput>, commands: &mut Vec<ExampleCommand>) {
        let Some(output) = viewport_output.get(&egui::ViewportId::ROOT) else { return };

        let mut current_pointer: Option<&egui::Pos2> = None;
        let mut drag_pointer: Option<&egui::Pos2> = None;

        for cmd in &output.commands {
            match cmd {
                egui::ViewportCommand::Close => {
                    // use default handling
                }
                // egui::ViewportCommand::CancelClose => todo!(),
                // egui::ViewportCommand::Title(_) => todo!(),
                // egui::ViewportCommand::Transparent(_) => todo!(),
                // egui::ViewportCommand::Visible(_) => todo!(),
                egui::ViewportCommand::StartDrag => {
                    if current_pointer.is_some() {
                        drag_pointer = current_pointer.clone();
                    }
                }
                // egui::ViewportCommand::OuterPosition(pos2) => todo!(),
                // egui::ViewportCommand::InnerSize(vec2) => todo!(),
                // egui::ViewportCommand::MinInnerSize(vec2) => todo!(),
                // egui::ViewportCommand::MaxInnerSize(vec2) => todo!(),
                // egui::ViewportCommand::ResizeIncrements(vec2) => todo!(),
                // egui::ViewportCommand::BeginResize(resize_direction) => todo!(),
                // egui::ViewportCommand::Resizable(_) => todo!(),
                // egui::ViewportCommand::EnableButtons { close, minimized, maximize } => todo!(),
                egui::ViewportCommand::Minimized(minimized) => {
                    let info = match minimized {
                        true => CustomFrameCommand::Minimize(egui::Vec2::new(self.size.x, Self::TITLEBAR_HEIGHT)),
                        false => CustomFrameCommand::Restore(egui::Rect::from_min_size(self.origin, self.size))
                    };
                    commands.push(ExampleCommand::CustomFrame(info));
                }
                egui::ViewportCommand::Maximized(maximized) => {
                    let info = match maximized {
                        true => CustomFrameCommand::Maximize,
                        false => CustomFrameCommand::Restore(egui::Rect::from_min_size(self.origin, self.size))
                    };
                    commands.push(ExampleCommand::CustomFrame(info));
                }
                // egui::ViewportCommand::Fullscreen(_) => todo!(),
                // egui::ViewportCommand::Decorations(_) => todo!(),
                // egui::ViewportCommand::WindowLevel(window_level) => todo!(),
                // egui::ViewportCommand::Icon(icon_data) => todo!(),
                // egui::ViewportCommand::IMERect(rect) => todo!(),
                // egui::ViewportCommand::IMEAllowed(_) => todo!(),
                // egui::ViewportCommand::IMEPurpose(imepurpose) => todo!(),
                // egui::ViewportCommand::Focus => todo!(),
                // egui::ViewportCommand::RequestUserAttention(user_attention_type) => todo!(),
                egui::ViewportCommand::SetTheme(_) => {
                    // discard
                }
                // egui::ViewportCommand::ContentProtected(_) => todo!(),
                egui::ViewportCommand::CursorPosition(pos) => {
                    current_pointer = Some(pos);
                }
                // egui::ViewportCommand::CursorGrab(cursor_grab) => todo!(),
                // egui::ViewportCommand::CursorVisible(_) => todo!(),
                // egui::ViewportCommand::MousePassthrough(_) => todo!(),
                // egui::ViewportCommand::Screenshot(user_data) => todo!(),
                // egui::ViewportCommand::RequestCut => todo!(),
                // egui::ViewportCommand::RequestCopy => todo!(),
                // egui::ViewportCommand::RequestPaste => todo!(),
                _ => {
                    todo!("vireport-cmd: {cmd:?}");
                }
            }
        }

        if let Some(p) = drag_pointer {
            commands.push(ExampleCommand::CustomFrame(CustomFrameCommand::Dragging(p.clone())));
        }
    }

    pub fn update_bounds(&mut self, origin: Option<egui::Pos2>, size: Option<egui::Vec2>) {
        if let Some(origin) = origin {
            self.origin = origin;
        }
        if let Some(size) = size {
            self.size = size;
        }
    }

    pub fn is_maximized(&self) -> bool {
        self.status == WindowFrameStatus::Maximize
    }

    pub(crate) fn is_minimized(&self) -> bool {
        self.status == WindowFrameStatus::Minimize
    }

    pub fn change_status(&mut self, status: &WindowFrameStatus) {
        self.status = status.clone();
    }
}
