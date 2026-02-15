pub mod immediate_renderer_world;

use std::{cell::RefCell, marker::PhantomData};
use anyhow::Context;

use immediate_renderer_world::exports::local::immediate_renderer::render;
use crate::{bindings::immediate_renderer_world::{export, local::immediate_renderer::{surface, types}, wasi::webgpu::webgpu}, widget_recorder::{self, RecordOutput}};
use crate::renderer;

struct DispatcherEngine<'a, Recorder: widget_recorder::Recorder> {
    events: Vec<types::Event>,
    recorder: Recorder,
    renderer: renderer::Renderer,
    _marker: PhantomData<&'a ()>,

}
impl<'a, Recorder: widget_recorder::Recorder> DispatcherEngine<'a, Recorder> {
    fn new(recorder: Recorder, mut renderer: renderer::Renderer) -> Self {
        renderer.send_texture(recorder.preset_textures());

        Self { events: vec![], recorder, renderer, _marker: PhantomData }
    }
}

trait Engine {
    fn push_event(&mut self, events: types::Event);
    fn push_event_all(&mut self, events: Vec<types::Event>);
    fn render(&mut self, canvas: &webgpu::GpuCanvasContext, screen: widget_recorder::ScreenDescriptor) -> Result<Vec<types::UnhandleEvent>, anyhow::Error>;
}

impl<'a, Recorder: widget_recorder::Recorder + 'a> Engine for DispatcherEngine<'a, Recorder> {
    fn push_event(&mut self, event: types::Event) {
        self.events.push(event);
    }

    fn push_event_all(&mut self, events: Vec<types::Event>) {
        self.events.extend(events);
    }

    fn render(&mut self, canvas: &webgpu::GpuCanvasContext, screen: widget_recorder::ScreenDescriptor) -> Result<Vec<types::UnhandleEvent>, anyhow::Error> {
        self.renderer.send_uniform(
            renderer::UniformInfo::from_size(screen.size, screen.scale_factor)
        ).context("Failed to send uniform")?;

        let output = self.recorder.record(screen, &self.events.split_off(0))?;
        self.renderer.send_texture(output.textures());
        let resolved = self.renderer.update_mesh(renderer::MeshVectorIter::new(&output.meshes()))?;
        self.renderer.render(canvas.get_current_texture(), resolved)?;
        self.renderer.remove_textures(&output.removed_textures());

        Ok(output.unhandle_events())
    }
}

#[allow(unused)]
struct DispatcherImpl {
    context: render::RenderContext,
    canvas: webgpu::GpuCanvasContext,
    engine: RefCell<Box<dyn Engine>>,
}
impl DispatcherImpl {
    fn new<Recorder: for<'a> widget_recorder::Recorder + 'static>(context: render::RenderContext, recorder: Recorder) -> Self {
        let renderer = renderer::Renderer::new(&context);
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
        engine.render(&self.canvas, widget_recorder::ScreenDescriptor { size: screen_size, scale_factor })
    }
}

impl render::GuestDispatcher for DispatcherImpl {
    fn push_event(&self,event: render::Event,) -> () {
        let mut engine = self.engine.borrow_mut();
        engine.push_event(event);
    }

    fn push_event_all(&self,events: Vec::<render::Event>,) -> () {
        let mut engine = self.engine.borrow_mut();
        engine.push_event_all(events);
    }

    fn dispatch(&self,) -> Vec::<render::UnhandleEvent> {
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

    fn create_main_renderer(context: render::RenderContext,) -> render::Dispatcher {
        context.request_set_size(surface::FrameSize{ width: 512, height: 1024 });
        let recorder = widget_recorder::recorder_main::MainWidgetRecorder::new();
        render::Dispatcher::new(DispatcherImpl::new(context, recorder))
    }

    fn create_triangle_renderer(context: render::RenderContext,) -> render::Dispatcher {
        context.request_set_size(surface::FrameSize{ width: 512, height: 512 });
        let recorder = widget_recorder::recorder_triangle::TriangleRecorder;
        render::Dispatcher::new(DispatcherImpl::new(context, recorder))
    }

    fn create_counter_renderer(context: render::RenderContext,) -> render::Dispatcher {
        context.request_set_size(surface::FrameSize{ width: 768, height: 1024 });
        let recorder = widget_recorder::recorder_counter::CounterWidgetRecorder::new();
        render::Dispatcher::new(DispatcherImpl::new(context, recorder))
    }
}

export!(Component);
