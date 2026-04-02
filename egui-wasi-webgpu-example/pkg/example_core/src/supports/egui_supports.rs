use egui::{Modifiers, PointerButton, Pos2};
use wasi_renderer::{ScreenDescriptor, bindings::types};

use crate::{ChangeSpec, ClipboardData, ExampleCommand, UnhandledEvent, supports};

pub fn populate_events(events: &[types::Event], screen: &ScreenDescriptor, in_compositioning: &mut bool, input: &mut egui::RawInput) -> UnhandledEvent {
    let viewport = input.viewports.entry(egui::ViewportId::ROOT).or_default();
    viewport.native_pixels_per_point = Some(screen.scale_factor);

    let (w, h) = screen.logical_size();
    input.screen_rect = Some(egui::Rect::from_min_max(egui::Pos2::ZERO, egui::Pos2::new(w, h)));

    let (mut cursor_x, mut cursor_y) = (0.0, 0.0);
    let mut modifiers = Modifiers::default();

    let mut unhandled_events = UnhandledEvent::default();

    for event in events.into_iter() {
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
            types::Event::KeyDown((types::Keys::Whitespace(types::WhitespaceKey::Enter), _)) |
            types::Event::KeyUp(types::Keys::Whitespace(types::WhitespaceKey::Enter)) if *in_compositioning => {
                // discard
            }
            types::Event::KeyDown((types::Keys::Whitespace(types::WhitespaceKey::Space), _)) if !*in_compositioning => {
                input.events.push(egui::Event::Text(" ".into()));
            }
            types::Event::KeyDown((key, opts)) => {
                println!("Event::KeyDown/key: {key:?}");
                let key: egui::Key = supports::KeyWrapper(key).into();

                input.events.push(egui::Event::Key {
                    key,
                    physical_key: None,
                    pressed: true,
                    repeat: opts.contains(types::KeyOptions::REPEAT),
                    modifiers
                });
            }
            types::Event::KeyUp(key) => {
                println!("Event::KeyUp/key: {key:?}");
                let key: egui::Key = supports::KeyWrapper(key).into();

                input.events.push(egui::Event::Key {
                    key,
                    physical_key: None,
                    pressed: false,
                    repeat: false,
                    modifiers
                });
            }
            types::Event::UpdateCompositionState(types::CompositionState::Start) => {
                *in_compositioning = true;
            }
            types::Event::UpdateCompositionState(types::CompositionState::PreEdit(text)) => {
                input.events.extend([
                    egui::Event::Ime(egui::ImeEvent::Enabled),
                    egui::Event::Ime(egui::ImeEvent::Preedit(text.clone()))
                ]);
            }
            types::Event::UpdateCompositionState(types::CompositionState::Commit(text)) => {
                println!("Event::UpdateCompositionState/text: {text:?}");
                input.events.extend([
                    egui::Event::Ime(egui::ImeEvent::Enabled),
                    egui::Event::Ime(egui::ImeEvent::Commit(text.clone()))
                ]);
                *in_compositioning = false;
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
            types::Event::KeepFocus => {
                input.focused = true;
            }
            types::Event::RequestCompositionBounds(_) => {
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

pub fn push_platform_output(_conetx: &egui::Context, output: egui::PlatformOutput, commands: &mut Vec<crate::ExampleCommand>) {
    let egui::PlatformOutput{ commands: output_cmds, cursor_icon, ime, events, .. } = output;

    // if !events.is_empty() { println!("Platform output/platform-events/len: {}, mutable_text_under_cursor: {}", events.len(), edit_mutable); }
    for event in events {
        let info = event.widget_info();

        match (info.prev_text_value.as_ref(), info.current_text_value.as_ref()) {
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

    if let Some(ime_output) = ime {
        commands.push(ExampleCommand::CompositionBounds(ime_output.cursor_rect.clone()));
    }

    commands.push(ExampleCommand::Cursor(cursor_icon));

    for cmd in output_cmds {
        match cmd {
            egui::OutputCommand::CopyText(text) => {
                commands.push(ExampleCommand::Clipboard(ClipboardData::Text(text)));
            }
            egui::OutputCommand::CopyImage(_image) => todo!(),
            egui::OutputCommand::OpenUrl(url) => {
                commands.push(ExampleCommand::OpenUrl(url));
            }
        }
    }
}

pub fn create_text_change_set(old_text: &str, new_text: &str) -> Vec<crate::ChangeSpec> {
    let old_indexes = std::iter::once(0)
        .chain(
            old_text.chars()
                .map(|c| c.len_utf16() as u32)
                .scan(0, |state, len| {
                    *state += len;
                    Some(*state)
                })
        )
        .collect::<Vec<_>>()
    ;
    let mut new_chars = new_text.chars();

    let diff = similar::TextDiff::from_chars(old_text, new_text);

    let ops = diff.ops();
    ops.iter()
        .filter_map(|op| match op {
            &similar::DiffOp::Delete { old_index, old_len, .. } => {
                let start = old_indexes[old_index];
                let end = old_indexes[old_index..][old_len];

                Some(crate::ChangeSpec{ offset: start, len: end - start, new_value: Some("".into()) })
            }
            &similar::DiffOp::Insert { old_index, new_index:_, new_len  } => {
                let start = old_indexes[old_index];

                Some(crate::ChangeSpec{ offset: start, len: 0, new_value: Some(new_chars.by_ref().take(new_len).collect()) })
            }
            &similar::DiffOp::Replace { old_index, old_len, new_index:_, new_len } => {
                let start = old_indexes[old_index];
                let end = old_indexes[old_index..][old_len];

                Some(crate::ChangeSpec{ offset: start, len: end - start, new_value: Some(new_chars.by_ref().take(new_len).collect()) })
            }
            similar::DiffOp::Equal { .. } => None,
        })
        .collect()
}
