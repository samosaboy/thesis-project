// for style loader
declare module '*.css' {
  const styles: any;
  export = styles;
}

declare module "*.json" {
  const value: any;
  export default value;
}

declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "*.mp3" {
  const sound: any;
  export = sound;
}
