use egui::{Modifiers, PointerButton, Pos2};
use wasi_renderer::{ScreenDescriptor, bindings::types};

use crate::{ClipboardData, ExampleCommand};

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
            types::Event::Pointer(p) => {
                (cursor_x, cursor_y) = (p.x / screen.scale_factor, p.y / screen.scale_factor);
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
            types::Event::Cut => input.events.push(egui::Event::Cut),
            types::Event::Copy => input.events.push(egui::Event::Copy),
            types::Event::Paste(text) => input.events.push(egui::Event::Paste(text.clone())),
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

pub fn push_platform_output(output: egui::PlatformOutput, commands: &mut Vec<crate::ExampleCommand>) {
    let egui::PlatformOutput{ commands: clipboard_cmds, cursor_icon, ime, .. } = output;
    // println!("Platform output/ime: {:?}",
    //     &cursor_icon, output_cmds.len(), ime
    // );

    commands.push(ExampleCommand::Cursor(cursor_icon));

    for cmd in clipboard_cmds {
        match cmd {
            egui::OutputCommand::CopyText(text) => {
                commands.push(ExampleCommand::Clipboard(ClipboardData::Text(text)));
            }
            egui::OutputCommand::CopyImage(_image) => todo!(),
            egui::OutputCommand::OpenUrl(_url) => (),
        }
    }
}
