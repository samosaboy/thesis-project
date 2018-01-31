// for style loader
declare module '*.css' {
  const styles: any;
  export = styles;
}

declare module "*.json" {
    const value: any;
    export default value;
}
