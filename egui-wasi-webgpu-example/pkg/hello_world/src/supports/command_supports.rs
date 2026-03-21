use crate::{ExampleCommand, ExampleEffect, bindings::interaction};

impl From<ExampleCommand> for interaction::Command {
    fn from(value: ExampleCommand) -> Self {
        match value {
            ExampleCommand::OpenWindow(route) => interaction::Command::OpenWindow(route),
            ExampleCommand::RequestImage { path } => interaction::Command::RequestImage(path),
        }
    }
}

impl From<interaction::Command> for ExampleCommand {
    fn from(value: interaction::Command) -> Self {
        match value {
            interaction::Command::OpenWindow(route) => ExampleCommand::OpenWindow(route),
            interaction::Command::RequestImage(path) => ExampleCommand::RequestImage { path: path.into() },
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
