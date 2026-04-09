use egui::{Modifiers, PointerButton, Pos2};
use wasi_renderer::{ScreenDescriptor, bindings::types};

use crate::supports;

pub fn populate_events(events: &[types::Event], screen: &ScreenDescriptor, input: &mut egui::RawInput) {
    let viewport = input.viewports.entry(egui::ViewportId::ROOT).or_default();
    viewport.native_pixels_per_point = Some(screen.scale_factor);

    let (w, h) = screen.logical_size();
    input.screen_rect = Some(egui::Rect::from_min_max(egui::Pos2::ZERO, egui::Pos2::new(w, h)));

    let (mut cursor_x, mut cursor_y) = (0.0, 0.0);
    let mut modifiers = Modifiers::default();

    for event in events {
        match event {
            types::Event::Modifiers(m) => {
                modifiers.ctrl = ! m.ctrl.is_empty();
                modifiers.shift = ! m.shift.is_empty();
                modifiers.alt = ! m.alt.is_empty();
                modifiers.command = ! m.super_key.is_empty();
                modifiers.mac_cmd = ! m.super_key.is_empty();
            }
            types::Event::ViewportBounds((origin, size)) => {
                viewport.outer_rect = Some(egui::Rect::from_min_size(
                    egui::Pos2::new(origin.left, origin.top),
                    egui::Vec2::new(size.width, size.height)
                ))
            }
            types::Event::Pointer(p) => {
                (cursor_x, cursor_y) = (p.left / screen.scale_factor, p.top / screen.scale_factor);
                // For dragging
                input.events.push(egui::Event::PointerMoved(Pos2::new(cursor_x, cursor_y)));
            }
            types::Event::MouseDown(button) => {
                input.events.push(egui::Event::PointerButton { pos: Pos2::new(cursor_x, cursor_y), button: MouseButtonW(button).into(), pressed: true, modifiers });
            }
            types::Event::MouseUp(button) => {
                input.events.push(egui::Event::PointerButton { pos: Pos2::new(cursor_x, cursor_y), button: MouseButtonW(button).into(), pressed: false, modifiers });
            }
            types::Event::MouseMove => {
                input.events.push(egui::Event::PointerMoved(Pos2::new(cursor_x, cursor_y)));
            }
            types::Event::MouseWheel(types::MouseWheel{ delta_x, delta_y, wheel_unit }) => {
                input.events.push(egui::Event::MouseWheel { unit: MouseWheelUnitW(wheel_unit).into(), delta: egui::vec2(*delta_x, *delta_y), modifiers, phase: egui::TouchPhase::Move });
            }
            types::Event::KeyDown((key, opts)) => {
                input.events.push(egui::Event::Key {
                    key: supports::KeyWrapper(key).into(),
                    physical_key: None,
                    pressed: true,
                    repeat: opts.contains(types::KeyOptions::REPEAT),
                    modifiers
                });
            }
            types::Event::KeyUp(key) => {
                input.events.push(egui::Event::Key {
                    key: supports::KeyWrapper(key).into(),
                    physical_key: None,
                    pressed: false,
                    repeat: false,
                    modifiers
                });
            }
            types::Event::UpdateCompositionState(types::CompositionState::Start) => todo!(),
            types::Event::UpdateCompositionState(types::CompositionState::PreEdit(text)) => {
                input.events.extend([
                    egui::Event::Ime(egui::ImeEvent::Enabled),
                    egui::Event::Ime(egui::ImeEvent::Preedit(text.clone()))
                ]);
            }
            types::Event::UpdateCompositionState(types::CompositionState::Commit(text)) => {
                input.events.extend([
                    egui::Event::Ime(egui::ImeEvent::Enabled),
                    egui::Event::Ime(egui::ImeEvent::Commit(text.clone()))
                ]);
            }
            types::Event::UpdateCompositionState(types::CompositionState::SelectionRange(_range)) => todo!(),
            types::Event::RequestCompositionBounds(_req) => todo!(),
            types::Event::History(ops) => {
                input.events.extend([
                    egui::Event::Key {
                        key: egui::Key::Z,
                        physical_key: None,
                        pressed: true,
                        repeat: false,
                        modifiers: egui::Modifiers{ command: true, shift: ops == &types::HistoryOps::Redo, ..Default::default() }
                    },
                    egui::Event::Key {
                        key: egui::Key::Z,
                        physical_key: None,
                        pressed: false,
                        repeat: false,
                        modifiers: egui::Modifiers{ command: true, shift: ops == &types::HistoryOps::Redo, ..Default::default() }
                    }
                ]);
            }
            types::Event::Cut => input.events.push(egui::Event::Cut),
            types::Event::Copy => input.events.push(egui::Event::Copy),
            types::Event::Paste(text) => input.events.push(egui::Event::Paste(text.clone())),
            types::Event::Activate => todo!(),
            types::Event::KeepFocus => todo!(),
        }
    }

    input.modifiers = modifiers;
}

pub struct MouseButtonW<'a>(&'a types::MouseButton);

impl<'a> From<MouseButtonW<'a>> for PointerButton {
    fn from(MouseButtonW(value): MouseButtonW) -> Self {
        match value {
            types::MouseButton::Left => Self::Primary,
            types::MouseButton::Right => Self::Secondary,
            types::MouseButton::Middle => Self::Middle,
            types::MouseButton::Back => Self::Extra1,
            types::MouseButton::Forward => Self::Extra2,
        }
    }
}

pub struct MouseWheelUnitW<'a>(&'a types::MouseWheelUnit);

impl<'a> From<MouseWheelUnitW<'a>> for egui::MouseWheelUnit {
    fn from(MouseWheelUnitW(value): MouseWheelUnitW) -> Self {
        match value {
            types::MouseWheelUnit::LogicalPixel => Self::Point,
            types::MouseWheelUnit::Line => Self::Line,
            types::MouseWheelUnit::Page => Self::Page,
        }
    }
}
