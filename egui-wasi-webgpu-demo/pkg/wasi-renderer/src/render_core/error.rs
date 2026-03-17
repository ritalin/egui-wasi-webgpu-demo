use crate::render_core::TextureKey;

#[derive(Debug, thiserror::Error)]
pub enum RenderError {
    #[error("Failed to write vertex (cause: {0})")]
    WriteVertexFailed(String),
    #[error("Failed to write index (cause: {0})")]
    WriteIndexFailed(String),
    #[error("Failed to write uniform (cause: {0})")]
    WriteUniformFailed(String),
    #[error("Bind group is not found/key: {key:?} (cause: {msg})")]
    BindGroupMissed{ key: TextureKey, msg: String },
    #[error("Failed to switch Bind group/index: {index:?} (cause: {msg})")]
    SwitchBindGroupFailed{ index: u32, msg: String },
}
