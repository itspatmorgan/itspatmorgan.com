// The Vite features the kit uses. Vite supplies them at build time in both the site and Studio.
declare module '*?url' {
  const src: string;
  export default src;
}
interface ImportMeta {
  readonly env: { readonly DEV: boolean };
}
