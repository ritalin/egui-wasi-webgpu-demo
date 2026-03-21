use crate::{ExampleCommand, ExampleEffect, bindings::interaction};

impl From<ExampleCommand> for interaction::Command {
    fn from(value: ExampleCommand) -> Self {
        match value {
            ExampleCommand::OpenWindow(route) => interaction::Command::OpenWindow(route),
            ExampleCommand::RequestImage { paths } => interaction::Command::RequestImage(paths),
            ExampleCommand::Cursor(cursor) => interaction::Command::Cursor(cursor.into()),
        }
    }
}

impl From<ExampleEffect> for interaction::Effect {
    fn from(value: ExampleEffect) -> Self {
        match value {
            ExampleEffect::ImageData{ url, bytes } => {
                interaction::Effect::ImageData(interaction::ImageData{ source: url, bytes: bytes.to_vec() })
            }
        }
    }
}

impl From<interaction::Effect> for ExampleEffect {
    fn from(value: interaction::Effect) -> Self {
        match value {
            interaction::Effect::ImageData(interaction::ImageData{source, bytes}) => {
                ExampleEffect::ImageData { url: source, bytes: bytes.into() }
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
