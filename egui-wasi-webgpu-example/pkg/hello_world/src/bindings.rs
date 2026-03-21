use std::{cell::RefCell, rc::Rc};

use wasi_renderer::{ScreenDescriptor, bindings::{surface::FrameSize, types, webgpu}, recorder_core::{self, RecordOutput}, render_core};

use crate::{ExampleEffect, recorder};
use example_world::exports::local::immediate_renderer_example::render;

mod example_world;

pub use example_world::local::immediate_renderer_example::interaction;

struct DispatcherInner {
    context: render::RenderContext,
    canvas: webgpu::GpuCanvasContext,
    engine: DispatcherEngineWrapper,
}
impl DispatcherInner {
    pub fn new<Recorder>(context: render::RenderContext, recorder: Recorder) -> Self
    where
        Recorder: recorder_core::Recorder<Effect = ExampleEffect> + 'static,
        for<'a> Recorder::Output<'a>: RecordOutput<RequestCommand = crate::ExampleCommand>,
    {
        let canvas = context.get_canvas();
        let renderer = render_core::Renderer::new(&context);

        Self {
            context,
            canvas,
            engine: DispatcherEngineWrapper(Rc::new(RefCell::new(DispatcherEngine::new(recorder, renderer)))),
        }
    }
}

trait EngineApi: 'static {
    fn post_event_all(&mut self,events: Vec::<render::Event>);
    fn post_effect_all(&mut self,commands: Vec::<interaction::Effect>);

    fn render(
        &mut self,
        canvas: &webgpu::GpuCanvasContext,
        screen: ScreenDescriptor) -> Result<(Vec::<render::UnhandleEvent>, Vec::<render::Command>), anyhow::Error>;
}

struct DispatcherEngine<Recorder>
where
    Recorder: recorder_core::Recorder,
    for<'a> Recorder::Output<'a>: RecordOutput<RequestCommand = crate::ExampleCommand>,
{
    events: Vec<types::Event>,
    effects: Vec<interaction::Effect>,
    renderer: render_core::Renderer,
    recorder: Recorder,
}
impl<Recorder> DispatcherEngine<Recorder>
where
    Recorder: recorder_core::Recorder,
    for<'a> Recorder::Output<'a>: RecordOutput<RequestCommand = crate::ExampleCommand>,
{
    fn new(recorder: Recorder, mut renderer: render_core::Renderer) -> Self {
        renderer.send_texture(recorder.preset_textures());

        Self {
            events: vec![],
            effects: vec![],
            renderer,
            recorder,
        }
    }
}

impl<Recorder> EngineApi for DispatcherEngine<Recorder>
where
    Recorder: recorder_core::Recorder<Effect = ExampleEffect> + 'static,
    for<'a> Recorder::Output<'a>: RecordOutput<RequestCommand = crate::ExampleCommand>,
{
    fn post_event_all(&mut self,events: Vec::<render::Event>,) -> () {
        self.events.extend(events);
    }

    fn post_effect_all(&mut self,commands: Vec::<interaction::Effect>) {
        self.effects.extend(commands);
    }

    fn render(
        &mut self,
        canvas: &webgpu::GpuCanvasContext,
        screen: ScreenDescriptor) -> Result<(Vec::<render::UnhandleEvent>, Vec::<render::Command>), anyhow::Error>
    {
        self.renderer
            .send_uniform(
                render_core::UniformInfo::from_size(screen.size, screen.scale_factor)
            )?
        ;

        let output = self.recorder.record(screen, &self.events.split_off(0), self.effects.drain(..))?;
        self.renderer.send_texture(output.textures());
        let resolved = self.renderer.update_mesh(render_core::MeshVectorIter::new(&output.meshes()))?;
        self.renderer.render(canvas.get_current_texture(), resolved)?;
        self.renderer.remove_textures(&output.removed_textures());

        Ok((output.unhandle_events(), output.command_requests().into_iter().map(render::Command::from).collect()))
    }
}

#[derive(Clone)]
struct DispatcherEngineWrapper(Rc<RefCell<dyn EngineApi>>);

impl render::GuestEventChannel for DispatcherEngineWrapper {
    fn post(&self,events: Vec::<render::Event>,) -> () {
        self.0.borrow_mut().post_event_all(events);
    }
}

impl render::GuestCommandChannel for DispatcherEngineWrapper {
    fn post(&self,effects: Vec::<interaction::Effect>,) -> () {
        self.0.borrow_mut().post_effect_all(effects);
    }
}

impl render::GuestDispatcher for DispatcherInner {
    fn event_channel(&self,) -> render::EventChannel {
        render::EventChannel::new(self.engine.clone())
    }

    fn command_channel(&self,) -> render::CommandChannel {
        render::CommandChannel::new(self.engine.clone())
    }

    fn dispatch(&self,) -> (Vec::<render::UnhandleEvent>, Vec::<render::Command>,) {
        let screen_size = self.context.size();
        let scale_factor = self.context.scale_factor();

        let mut engine = self.engine.0.borrow_mut();

        match engine.render(&self.canvas, ScreenDescriptor { size: screen_size, scale_factor }) {
            Ok((events, commands)) => (events, commands),
            Err(err) => {
                eprintln!("{err}");
                (vec![], vec![])
            }
        }
    }
}

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

example_world::export!(Component);
