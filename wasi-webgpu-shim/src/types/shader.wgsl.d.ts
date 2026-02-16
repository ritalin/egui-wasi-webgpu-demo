declare module "*.wgsl.js" {
  const content: string;
  export default content;
}

declare module "*.wgsl" {
  const _forbidden: never;
  export default _forbidden;
}
