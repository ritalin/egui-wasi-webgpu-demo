use example_core::bindings::{DispatcherEngineWrapper, DispatcherInner, render};
use wasi_renderer::bindings::surface::FrameSize;
mod recorder;

struct Component;

impl render::Guest for Component {
    type EventChannel = DispatcherEngineWrapper;
    type CommandChannel = DispatcherEngineWrapper;
    type Dispatcher = DispatcherInner;

    fn create_renderer(context: render::RenderContext,) -> render::Dispatcher {
        context.request_set_size(FrameSize{ width: 512, height: 512 });
        render::Dispatcher::new(DispatcherInner::new(context, recorder::RecoderInner::new()))
    }
}

example_core::export!(Component);
