pub mod demo_world;

use std::{cell::RefCell, marker::PhantomData};
use anyhow::Context;

use wasi_renderer::{EngineCore, ScreenDescriptor, bindings::{surface, types, webgpu}, recorder_core, render_core};
use wasi_renderer::recorder_core::RecordOutput;

use crate::{bindings::demo_world::exports::local::immediate_renderer_demo::render, widget_recorder};

struct DispatcherEngine<'a, Recorder: recorder_core::Recorder<Effect = ()>> {
    events: Vec<types::Event>,
    recorder: Recorder,
    renderer: render_core::Renderer,
    _marker: PhantomData<&'a ()>,
}
impl<'a, Recorder: recorder_core::Recorder<Effect = ()>> DispatcherEngine<'a, Recorder> {
    fn new(recorder: Recorder, mut renderer: render_core::Renderer) -> Self {
        renderer.send_texture(recorder.preset_textures());

        Self { events: vec![], recorder, renderer, _marker: PhantomData }
    }
}

#[derive(Debug, thiserror::Error)]
enum EguiEngineError {
    #[error(transparent)]
    RenderError(#[from] render_core::error::RenderError),
    #[error(transparent)]
    RecorderError(#[from] recorder_core::RecorderError),
}

impl<'a, Recorder: recorder_core::Recorder<Effect = ()> + 'a, > EngineCore<EguiEngineError> for DispatcherEngine<'a, Recorder> {
    fn push_event(&mut self, event: types::Event) {
        self.events.push(event);
    }

    fn push_event_all(&mut self, events: Vec<types::Event>) {
        self.events.extend(events);
    }

    fn render(&mut self, canvas: &webgpu::GpuCanvasContext, screen: ScreenDescriptor) -> Result<Vec<types::UnhandleEvent>, EguiEngineError> {
        self.renderer
            .send_uniform(
                render_core::UniformInfo::from_size(screen.size, screen.scale_factor)
            )?
        ;

        let output = self.recorder.record(screen, &self.events.split_off(0), std::iter::empty::<()>())?;
        self.renderer.send_texture(output.textures());
        let resolved = self.renderer.update_mesh(render_core::MeshVectorIter::new(&output.meshes()))?;
        self.renderer.render(canvas.get_current_texture(), resolved)?;
        self.renderer.remove_textures(&output.removed_textures());

        Ok(output.unhandle_events())
    }
}

#[allow(unused)]
struct DispatcherImpl {
    context: surface::RenderContext,
    canvas: webgpu::GpuCanvasContext,
    engine: RefCell<Box<dyn EngineCore<EguiEngineError>>>,
}
impl DispatcherImpl {
    fn new<Recorder: for<'a> recorder_core::Recorder<Effect = ()> + 'static>(context: surface::RenderContext, recorder: Recorder) -> Self {
        let renderer = render_core::Renderer::new(&context);
        let inner = DispatcherEngine::new(recorder, renderer);

        Self {
            canvas: context.get_canvas(),
            context,
            engine: RefCell::new(Box::new(inner)),
        }
    }

    fn render(&self) -> Result<Vec<types::UnhandleEvent>, anyhow::Error> {
        let screen_size = self.context.size();
        let scale_factor = self.context.scale_factor();

        let mut engine = self.engine.borrow_mut();
        engine.render(&self.canvas, ScreenDescriptor { size: screen_size, scale_factor }).context("render failed")
    }
}

impl render::GuestDispatcher for DispatcherImpl {
    fn push_event(&self,event: types::Event,) -> () {
        let mut engine = self.engine.borrow_mut();
        engine.push_event(event);
    }

    fn push_event_all(&self,events: Vec::<types::Event>,) -> () {
        let mut engine = self.engine.borrow_mut();
        engine.push_event_all(events);
    }

    fn dispatch(&self,) -> Vec::<types::UnhandleEvent> {
        match self.render() {
            Ok(events) => events,
            Err(err) => {
                eprintln!("{err}");
                return vec![];
            }
        }
    }
}

struct Component;

impl render::Guest for Component {
    type Dispatcher = DispatcherImpl;

    fn create_main_renderer(context: surface::RenderContext,) -> render::Dispatcher {
        context.request_set_size(surface::FrameSize{ width: 512, height: 1024 });
        let recorder = widget_recorder::recorder_main::MainWidgetRecorder::new();
        render::Dispatcher::new(DispatcherImpl::new(context, recorder))
    }

    fn create_triangle_renderer(context: surface::RenderContext,) -> render::Dispatcher {
        context.request_set_size(surface::FrameSize{ width: 512, height: 512 });
        let recorder = widget_recorder::recorder_triangle::TriangleRecorder;
        render::Dispatcher::new(DispatcherImpl::new(context, recorder))
    }

    fn create_counter_renderer(context: surface::RenderContext,) -> render::Dispatcher {
        context.request_set_size(surface::FrameSize{ width: 768, height: 1024 });
        let recorder = widget_recorder::recorder_counter::CounterWidgetRecorder::new();
        render::Dispatcher::new(DispatcherImpl::new(context, recorder))
    }
}

demo_world::export!(Component);
