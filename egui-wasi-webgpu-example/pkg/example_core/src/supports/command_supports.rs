use egui::OpenUrl;
use wasi_renderer::bindings::types;

use crate::{ClipboardData, ExampleCommand, ExampleEffect, bindings::interaction, supports::KeyWrapper};

impl From<ExampleCommand> for interaction::Command {
    fn from(value: ExampleCommand) -> Self {
        match value {
            ExampleCommand::OpenWindow(route) => interaction::Command::OpenWindow(route),
            ExampleCommand::CloseWindow { with_query } => {
                let mut options = interaction::CloseOptions::empty();
                options.set(interaction::CloseOptions::WITH_QUERY, with_query);
                interaction::Command::CloseWindow(options)
            }
            ExampleCommand::RequestImage { paths } => interaction::Command::RequestImage(paths),
            ExampleCommand::Cursor(cursor) => interaction::Command::Cursor(cursor.into()),
            ExampleCommand::Clipboard(data) => interaction::Command::Clipboard(data.into()),
            ExampleCommand::OpenUrl(OpenUrl{ url, new_tab }) => {
                let mut options = interaction::OpenUrlOptions::empty();
                options.set(interaction::OpenUrlOptions::NEW_TAB, new_tab);
                interaction::Command::OpenUrl((url, options))
            }
            ExampleCommand::ChangeSet(change_specs) => {
                interaction::Command::ChangeSet(change_specs.into_iter().map(Into::into).collect::<Vec<_>>())
            }
            ExampleCommand::CompositionBounds(bounds) =>interaction::Command::CompositionBounds(RectW::from(bounds).0),
            ExampleCommand::Screenshot(dests) => {
                interaction::Command::Screenshot(dests.into_iter().map(Into::into).collect::<Vec<_>>())
            }
            ExampleCommand::CustomFrame(info) => {
                interaction::Command::CustomFrame(info.into())
            }
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
            interaction::Effect::RequestCloseQuery => {
                ExampleEffect::RequestCloseQuery
            }
            interaction::Effect::CustomFrameEffect(effect) => {
                ExampleEffect::CustomFrameEffect(effect.into())
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

pub(crate) struct LocationW(pub(crate) types::Location);
pub(crate) struct LocationRef<'a>(pub(crate) &'a types::Location);

impl From<egui::Pos2> for LocationW {
    fn from(value: egui::Pos2) -> Self {
        LocationW(types::Location { left:value.x, top: value.y })
    }
}
impl<'a> From<LocationRef<'a>> for egui::Pos2 {
    fn from(LocationRef::<'a>(value): LocationRef<'a>) -> Self {
        Self::new(value.left, value.top)
    }
}

pub(crate) struct SizeW(pub(crate) types::Size);
pub(crate) struct SizeRef<'a>(pub(crate) &'a types::Size);

impl From<egui::Vec2> for SizeW {
    fn from(value: egui::Vec2) -> Self {
        SizeW(types::Size { width: value.x, height: value.y })
    }
}
impl<'a> From<SizeRef<'a>> for egui::Vec2 {
    fn from(SizeRef::<'a>(value): SizeRef<'a>) -> Self {
        Self::new(value.width, value.height)
    }
}

struct RectW((types::Location, types::Size));

impl From<egui::Rect> for RectW {
    fn from(value: egui::Rect) -> Self {
        RectW((
            types::Location{left: value.left(), top: value.top() },
            types::Size{width: value.width(), height: value.height() }
        ))
    }
}

impl From<RectW> for egui::Rect {
    fn from(RectW((origin, size)): RectW) -> Self {
        Self::from_min_size(egui::Pos2::new(origin.left, origin.top), egui::Vec2::new(size.width, size.height))
    }
}

impl From<crate::Destination> for interaction::Destination {
    fn from(value: crate::Destination) -> Self {
        match value {
            crate::Destination::Origin => Self::Origin,
            crate::Destination::Route(route) => Self::Route(route),
            crate::Destination::Clipboard => Self::Clipboard,
        }
    }
}

impl From<crate::CustomFrameCommand> for interaction::CustomFrameCommand {
    fn from(value: crate::CustomFrameCommand) -> Self {
        match value {
            crate::CustomFrameCommand::Initialize(status) => interaction::CustomFrameCommand::Initialize(status.into()),
            crate::CustomFrameCommand::Maximize => interaction::CustomFrameCommand::Maximize,
            crate::CustomFrameCommand::Minimize(size) => interaction::CustomFrameCommand::Minimize(SizeW::from(size).0),
            crate::CustomFrameCommand::Restore(rect) => interaction::CustomFrameCommand::Restore(RectW::from(rect).0),
            crate::CustomFrameCommand::Dragging(pos) => interaction::CustomFrameCommand::Dragging(LocationW::from(pos).0),
        }
    }
}

impl From<interaction::CustomFrameEffect> for crate::CustomFrameEffect {
    fn from(value: interaction::CustomFrameEffect) -> Self {
        match value {
            interaction::CustomFrameEffect::Initialized((origin, size)) => Self::Initialized(RectW((origin, size)).into()),
            interaction::CustomFrameEffect::Changed(status) => Self::Changed(status.into()),
        }
    }
}

impl From<crate::WindowFrameStatus> for interaction::CustomFrameStatus {
    fn from(value: crate::WindowFrameStatus) -> Self {
        match value {
            crate::WindowFrameStatus::Normal => Self::Restored,
            crate::WindowFrameStatus::Maximize => Self::Maximized,
            crate::WindowFrameStatus::Minimize => Self::Minimized,
        }
    }
}

impl From<interaction::CustomFrameStatus> for crate::WindowFrameStatus {
    fn from(value: interaction::CustomFrameStatus) -> Self {
        match value {
            interaction::CustomFrameStatus::Maximized => Self::Maximize,
            interaction::CustomFrameStatus::Minimized => Self::Minimize,
            interaction::CustomFrameStatus::Restored => Self::Normal,
        }
    }
}
