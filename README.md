# 森林瀑布的博客

个人博客与专栏站点，聚焦本体推理、知识图谱与 LLM/Agent 融合落地。

线上地址：[senlinpubu.top](https://senlinpubu.top) · 仓库：[github.com/georgewangchn/myblog](https://github.com/georgewangchn/myblog)

## 技术栈

- Astro `6.4.4` + Content Layer（`@astrojs/mdx` / `@astrojs/sitemap` / `@astrojs/rss`）
- Sass · TypeScript（strict）· Sharp
- pnpm（`pnpm-lock.yaml` 为准，`package-lock.json` 已废弃）
- 部署：Cloudflare Pages + Wrangler（`wrangler.jsonc`）

## 启动

```bash
pnpm install
pnpm dev      # http://localhost:4321
```

常用命令：

| 命令 | 说明 |
| :-- | :-- |
| `pnpm dev` | 本地开发，默认 `localhost:4321` |
| `pnpm build` | `astro check && astro build`，产物到 `dist/` |
| `pnpm preview` | 预览生产构建 |
| `pnpm astro check` | 仅类型检查 |

## 环境变量

复制 `.env.example` → `.env`，前缀 `PUBLIC_`：

- `PUBLIC_SITE_URL` — 生产地址，用于 sitemap/RSS/SEO（fallback `https://senlinpubu.top` 写死在 `astro.config.mjs`）
- `PUBLIC_SITE_NAME` — 站点名
- `PUBLIC_GA4_ID` / `PUBLIC_UMAMI_ID` — 可选统计 ID，留空则不渲染

## 内容

- 博客：`src/content/blog/*.mdx`，配置在 `src/content.config.ts`（glob loader）
- 系列文章：
  - `p1-` … `p6-` — 推理范式（OWL → Prolog → Jena → Fuzzy → Bayesian → Arbiter）
  - `pl1-` … `pl6-` — Agent 层变体
  - 独立篇：`why-llm-not-enough`、`asr-loop-engineering`、`people-management`、`vetvoice-intro`
- 在线专栏：`public/book/index.html`（《当LLM不够用了》在线阅读 + `.epub`/`.html`/`.pdf` 下载）
- 首页卡片数据：`src/data/home.json`
- 项目页数据：`src/data/project.ts`
- 站点配置：`src/data/content.ts`（nav / SEO TDK / 社交链接 / 分类筛选）

## 部署

```bash
pnpm build
wrangler pages deploy dist/
```

`wrangler` 不在 deps，需全局安装：`npm i -g wrangler`。

## 协议

双协议授权：

- **代码**（`.astro` / `.ts` / `.scss` / 配置文件等）：[MIT License](./LICENSE)
- **文字内容**（博客文章 `src/content/blog/*`、专栏 `public/book/*`、文档文案）：[CC BY-NC-SA 4.0](./LICENSE-CONTENT) — 署名 + 非商用 + 相同方式共享

自由阅读、分享、非商用改编；商用搬运或闭源衍生需另行授权。
