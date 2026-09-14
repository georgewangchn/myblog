// https://astro.build/config
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { readdirSync, readFileSync } from 'node:fs';

const SITE_URL = (process.env.PUBLIC_SITE_URL || 'https://senlinpubu.top').replace(/\/$/, '');
const abs = (p) => (/^https?:\/\//.test(p) ? p : `${SITE_URL}${p.startsWith('/') ? '' : '/'}${p}`);

// 构建时读取每篇文章的 publishDate / 封面 / 标题，供 sitemap 设置真实 lastmod 与图片
function getPostMeta() {
  const dir = new URL('./src/content/blog/', import.meta.url);
  const map = new Map();
  for (const file of readdirSync(dir)) {
    if (!/\.(md|mdx)$/i.test(file)) continue;
    const src = readFileSync(new URL(file, dir), 'utf8');
    const dateMatch = src.match(/publishDate:\s*["']?(\d{4}-\d{2}-\d{2})/);
    if (!dateMatch) continue;
    const imgMatch = src.match(/^img:\s*(.+)$/m);
    const titleMatch = src.match(/^title:\s*(.+)$/m);
    const clean = (v) => (v ? v.trim().replace(/^['"]|['"]$/g, '') : undefined);
    const slug = file.replace(/\/index\.(md|mdx)$/i, '').replace(/\.(md|mdx)$/i, '');
    map.set(`/blog/${slug}/`, {
      date: new Date(dateMatch[1]),
      img: clean(imgMatch && imgMatch[1]),
      title: clean(titleMatch && titleMatch[1]),
    });
  }
  return map;
}

const postMeta = getPostMeta();
const withImg = (item, imgs) => {
  const list = imgs.filter(Boolean).map((url) => ({ url }));
  return list.length ? { ...item, img: list } : item;
};

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
        return withImg({ ...item, changefreq: 'weekly', priority: 1.0 }, [
          `${SITE_URL}/assets/cover/book-cover.png`,
          `${SITE_URL}/assets/cover/governanceops-demo.png`,
        ]);
      }
      if (path.startsWith('/blog/') && path !== '/blog/') {
        const meta = postMeta.get(path);
        const out = { ...item, lastmod: meta?.date ?? item.lastmod, changefreq: 'monthly', priority: 0.8 };
        return meta?.img ? withImg(out, [abs(meta.img)]) : out;
      }
      if (path === '/book/index.html') {
        return withImg({ ...item, changefreq: 'monthly', priority: 0.7 }, [`${SITE_URL}/assets/cover/book-cover.png`]);
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
