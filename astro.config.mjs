// https://astro.build/config
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { readdirSync, readFileSync } from 'node:fs';

const SITE_URL = (process.env.PUBLIC_SITE_URL || 'https://senlinpubu.top').replace(/\/$/, '');

// 构建时读取每篇文章的 publishDate，供 sitemap 设置真实 lastmod
function getPostDates() {
  const dir = new URL('./src/content/blog/', import.meta.url);
  const map = new Map();
  for (const file of readdirSync(dir)) {
    if (!/\.(md|mdx)$/i.test(file)) continue;
    const src = readFileSync(new URL(file, dir), 'utf8');
    const match = src.match(/publishDate:\s*["']?(\d{4}-\d{2}-\d{2})/);
    if (!match) continue;
    const slug = file.replace(/\/index\.(md|mdx)$/i, '').replace(/\.(md|mdx)$/i, '');
    map.set(`/blog/${slug}/`, new Date(match[1]));
  }
  return map;
}

const postDates = getPostDates();

export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  markdown: {
    shikiConfig: {
    theme: "github-dark",
    wrap: true,
    }
  },
  envPrefix: 'PUBLIC_',
  site: SITE_URL,
  base: '/',
  integrations: [sitemap({
    changefreq: 'weekly',
    customPages: [
      `${SITE_URL}/book/index.html`,
    ],
    serialize(item) {
      const path = new URL(item.url).pathname;
      if (path === '/') {
        return { ...item, changefreq: 'weekly', priority: 1.0 };
      }
      if (path.startsWith('/blog/') && path !== '/blog/') {
        return { ...item, lastmod: postDates.get(path) ?? item.lastmod, changefreq: 'monthly', priority: 0.8 };
      }
      if (['/blog/', '/project/', '/about/'].includes(path)) {
        return { ...item, changefreq: 'weekly', priority: 0.7 };
      }
      if (path.startsWith('/topic/')) {
        return { ...item, changefreq: 'weekly', priority: 0.6 };
      }
      return { ...item, changefreq: 'monthly', priority: 0.4 };
    },
  }), mdx()],
  css: {
    preprocessorOptions: {
      sass: {
        api: "modern",
      },
    },
  },
})
