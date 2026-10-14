// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';

/** Wraps <p><img title="Caption"></p> in <figure><img><figcaption>Caption</figcaption></figure> */
function rehypeFigure() {
  return (tree) => {
    function walk(node) {
      if (!node.children) return;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.tagName === 'p') {
          const real = child.children.filter(n => n.type !== 'text' || n.value.trim() !== '');
          if (real.length === 1 && real[0].tagName === 'img') {
            const img = real[0];
            const title = img.properties?.title;
            if (title) {
              delete img.properties.title;
              node.children[i] = {
                type: 'element',
                tagName: 'figure',
                properties: {},
                children: [
                  img,
                  { type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: title }] },
                ],
              };
            }
          }
        }
        walk(child);
      }
    }
    walk(tree);
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://itspatmorgan.com',
  output: 'static',
  // Preserve spaces between inline elements with Astro 7's new JSX default.
  compressHTML: true,
  devToolbar: {
    enabled: false,
  },
  integrations: [react(), mdx()],
  markdown: {
    // Keep the existing caption transform on the supported unified pipeline.
    processor: unified({ rehypePlugins: [rehypeFigure] }),
  },
  vite: {
    // Serve the deployed demo under the same origin in local development.
    // Studio's preview bridge intentionally rejects cross-origin hosts.
    server: { proxy: { '/design-studio-demo/': { target: 'https://itspatmorgan.com', changeOrigin: true } } },
    preview: { proxy: { '/design-studio-demo/': { target: 'https://itspatmorgan.com', changeOrigin: true } } },
    plugins: [tailwindcss()],
    optimizeDeps: {
      // Pre-bundle the client-only tool's imports before its first visit.
      include: ['html-to-image', '@hugeicons/react', '@hugeicons/core-free-icons'],
    },
  },
});
