use egui::{Modifiers, PointerButton, Pos2};
use wasi_renderer::{ScreenDescriptor, bindings::types};

use crate::{ChangeSpec, ClipboardData, ExampleCommand, UnhandledEvent, supports};

pub fn populate_events(events: &[types::Event], screen: &ScreenDescriptor, input: &mut egui::RawInput) -> UnhandledEvent {
    let viewport = input.viewports.entry(egui::ViewportId::ROOT).or_default();
    viewport.native_pixels_per_point = Some(screen.scale_factor);

    let (w, h) = screen.logical_size();
    input.screen_rect = Some(egui::Rect::from_min_max(egui::Pos2::ZERO, egui::Pos2::new(w, h)));

    let (mut cursor_x, mut cursor_y) = (0.0, 0.0);
    let mut modifiers = Modifiers::default();

    let mut unhandled_events = UnhandledEvent::default();

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
            types::Event::History(ops) => {
                println!("Event::History: {:?}", ops);
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
            types::Event::Activate => {
                input.focused = true;
                unhandled_events.activate = Some(());
            }
            types::Event::RequestCompositionBounds(req) => {
                unhandled_events.composition_bound_req = Some(());
            }
            types::Event::UpdateCompositionState(types::CompositionState::SelectionRange(range)) => {
                unhandled_events.composition_sel_range = Some(range.clone());
            }
        }
    }
    input.modifiers = modifiers;

    unhandled_events
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

pub fn push_platform_output(conetx: &egui::Context, output: egui::PlatformOutput, commands: &mut Vec<crate::ExampleCommand>) {
    let egui::PlatformOutput{ commands: clipboard_cmds, cursor_icon, ime, events, mutable_text_under_cursor: edit_mutable, .. } = output;

    // println!("Platform output/ime: {:?}", ime);
    if !events.is_empty() { println!("Platform output/platform-events/len: {}, mutable_text_under_cursor: {}", events.len(), edit_mutable); }
    for event in events {
        let info = event.widget_info();
        println!("Platform output/prev: {:?}, new: {:?}, sel: {:?}", info.prev_text_value.as_ref(), info.current_text_value.as_ref(), info.text_selection);

        match (info.prev_text_value.as_ref(), info.current_text_value.as_ref()) {
            (None, Some(text)) if edit_mutable => {

            }
            (Some(old_text), None) => {
                let len = old_text.chars().map(|c| c.len_utf16() as u32).sum::<u32>();
                commands.push(ExampleCommand::ChangeSet(vec![ChangeSpec{ offset: 0, len, new_value: Some("".into()) }]));
            },
            (Some(old_text), Some(new_text)) => {
                commands.push(ExampleCommand::ChangeSet(create_text_change_set(&old_text, &new_text)));
            }
            (None, _) => (),
        }
    }

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

pub fn create_text_change_set(old_text: &str, new_text: &str) -> Vec<crate::ChangeSpec> {
    let mut old_indexes = std::iter::once(0)
        .chain(
            old_text.chars()
                .map(|c| c.len_utf16() as u32)
                .scan(0, |state, len| {
                    *state += len;
                    Some(*state)
                })
        )
    ;
    let mut new_chars = new_text.chars();

    let diff = similar::TextDiff::from_chars(old_text, new_text);

    let mut current_old_index = 0;
    let mut current_new_index = 0;

    diff.ops().iter()
        .filter_map(|op| match op {
            &similar::DiffOp::Delete { old_index, old_len, .. } => {
                let start = old_indexes.nth(old_index - current_old_index);
                let end = old_indexes.by_ref().take(old_len).last();
                current_old_index = old_index + old_len + 1;

                start.zip(end).map(|(s, e)| crate::ChangeSpec{ offset: s, len: e - s, new_value: Some("".into()) })
            }
            &similar::DiffOp::Insert { old_index, new_index, new_len  } => {
                let start = old_indexes.nth(old_index - current_old_index);
                current_old_index = old_index + 1;

                for _ in 0..(new_index - current_new_index) { new_chars.next(); }
                current_new_index = new_index + new_len;

                start.map(|s| crate::ChangeSpec{ offset: s, len: 0, new_value: Some(new_chars.by_ref().take(new_len).collect()) })
            }
            &similar::DiffOp::Replace { old_index, old_len, new_index, new_len } => {
                let start = old_indexes.nth(old_index - current_old_index);
                let end = old_indexes.by_ref().take(old_len).last();
                current_old_index = old_index + old_len + 1;

                for _ in 0..(new_index - current_new_index) { new_chars.next(); }
                current_new_index = new_index + new_len;

                start.zip(end).map(|(s, e)| crate::ChangeSpec{ offset: s, len: e - s, new_value: Some(new_chars.by_ref().take(new_len).collect()) })
            }
            similar::DiffOp::Equal { .. } => None,
        })
        .collect()
}
