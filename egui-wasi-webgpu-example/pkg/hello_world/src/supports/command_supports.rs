use wasi_renderer::bindings::types;

use crate::{ClipboardData, ExampleCommand, ExampleEffect, bindings::interaction, supports::KeyWrapper};

impl From<ExampleCommand> for interaction::Command {
    fn from(value: ExampleCommand) -> Self {
        match value {
            ExampleCommand::OpenWindow(route) => interaction::Command::OpenWindow(route),
            ExampleCommand::RequestImage { paths } => interaction::Command::RequestImage(paths),
            ExampleCommand::Cursor(cursor) => interaction::Command::Cursor(cursor.into()),
            ExampleCommand::Clipboard(data) => interaction::Command::Clipboard(data.into()),
            ExampleCommand::ChangeSet(change_specs) => {
                interaction::Command::ChangeSet(change_specs.into_iter().map(Into::into).collect::<Vec<_>>())
            }
            ExampleCommand::CompositionBounds(bounds) =>interaction::Command::CompositionBounds(bounds.into()),
        }
    }
}

impl From<interaction::Effect> for ExampleEffect {
    fn from(value: interaction::Effect) -> Self {
        match value {
            interaction::Effect::ImageData(interaction::ExternalAsset{source, bytes}) => {
                ExampleEffect::ImageData { url: source, bytes: bytes.into() }
            }
            interaction::Effect::FontData(interaction::ExternalFont{source, name, bytes}) => {
                ExampleEffect::FontData { url: source, name, bytes: bytes.into() }
            }
        }
    }
}

impl From<egui::CursorIcon> for interaction::CursorStyle {
    fn from(value: egui::CursorIcon) -> Self {
        match value {
            egui::CursorIcon::Default => interaction::CursorStyle::Default,
            egui::CursorIcon::None => interaction::CursorStyle::None,
            egui::CursorIcon::ContextMenu => interaction::CursorStyle::ContextMenu,
            egui::CursorIcon::Help => interaction::CursorStyle::Help,
            egui::CursorIcon::PointingHand => interaction::CursorStyle::Pointer,
            egui::CursorIcon::Progress => interaction::CursorStyle::Progress,
            egui::CursorIcon::Wait => interaction::CursorStyle::Wait,
            egui::CursorIcon::Cell => interaction::CursorStyle::Cell,
            egui::CursorIcon::Crosshair => interaction::CursorStyle::Crosshair,
            egui::CursorIcon::Text => interaction::CursorStyle::Text,
            egui::CursorIcon::VerticalText => interaction::CursorStyle::VerticalText,
            egui::CursorIcon::Alias => interaction::CursorStyle::Alias,
            egui::CursorIcon::Copy => interaction::CursorStyle::Copy,
            egui::CursorIcon::Move => interaction::CursorStyle::Move,
            egui::CursorIcon::NoDrop => interaction::CursorStyle::NoDrop,
            egui::CursorIcon::NotAllowed => interaction::CursorStyle::NotAllowed,
            egui::CursorIcon::Grab => interaction::CursorStyle::Grab,
            egui::CursorIcon::Grabbing => interaction::CursorStyle::Grabbing,
            egui::CursorIcon::AllScroll => interaction::CursorStyle::AllScroll,
            egui::CursorIcon::ResizeHorizontal => interaction::CursorStyle::EwResize,
            egui::CursorIcon::ResizeNeSw => interaction::CursorStyle::NeswResize,
            egui::CursorIcon::ResizeNwSe => interaction::CursorStyle::NwseResize,
            egui::CursorIcon::ResizeVertical => interaction::CursorStyle::NsResize,
            egui::CursorIcon::ResizeEast => interaction::CursorStyle::EResize,
            egui::CursorIcon::ResizeSouthEast => interaction::CursorStyle::SeResize,
            egui::CursorIcon::ResizeSouth => interaction::CursorStyle::SResize,
            egui::CursorIcon::ResizeSouthWest => interaction::CursorStyle::SwResize,
            egui::CursorIcon::ResizeWest => interaction::CursorStyle::WResize,
            egui::CursorIcon::ResizeNorthWest => interaction::CursorStyle::NwResize,
            egui::CursorIcon::ResizeNorth => interaction::CursorStyle::NResize,
            egui::CursorIcon::ResizeNorthEast => interaction::CursorStyle::NeResize,
            egui::CursorIcon::ResizeColumn => interaction::CursorStyle::ColResize,
            egui::CursorIcon::ResizeRow => interaction::CursorStyle::RowResize,
            egui::CursorIcon::ZoomIn => interaction::CursorStyle::ZoomIn,
            egui::CursorIcon::ZoomOut => interaction::CursorStyle::ZoomOut,
        }
    }
}

impl From<ClipboardData> for interaction::ClipboardData {
    fn from(value: ClipboardData) -> Self {
        match value {
            ClipboardData::Text(text) => interaction::ClipboardData::Text(text),
        }
    }
}

impl<'a> From<KeyWrapper<'a>> for egui::Key {
    fn from(KeyWrapper(value): KeyWrapper) -> Self {
        match value {
            types::Keys::Whitespace(types::WhitespaceKey::Enter) => egui::Key::Enter,
            types::Keys::Whitespace(types::WhitespaceKey::Space) => egui::Key::Space,
            types::Keys::Whitespace(types::WhitespaceKey::Tab) => egui::Key::Tab,
            types::Keys::Edit(types::EditKey::Backspace) => egui::Key::Backspace,
            types::Keys::Edit(types::EditKey::Delete) => egui::Key::Delete,
            types::Keys::Ui(types::UiKey::Escape) => egui::Key::Escape,
            types::Keys::Navi(types::NaviKey::ArrowDown) => egui::Key::ArrowDown,
            types::Keys::Navi(types::NaviKey::ArrowLeft) => egui::Key::ArrowLeft,
            types::Keys::Navi(types::NaviKey::ArrowRight) => egui::Key::ArrowRight,
            types::Keys::Navi(types::NaviKey::ArrowUp) => egui::Key::ArrowUp,
        }
    }
}

impl From<crate::ChangeSpec> for interaction::ChangeSpec {
    fn from(value: crate::ChangeSpec) -> Self {
        Self {
            offset: value.offset,
            len: value.len,
            new_value: value.new_value,
        }
    }
}

impl From<egui::Rect> for interaction::CompositionBounds {
    fn from(value: egui::Rect) -> Self {
        interaction::CompositionBounds{
            left: value.left(),
            top: value.top(),
            width: value.width(),
            height: value.height(),
        }
    }
}
