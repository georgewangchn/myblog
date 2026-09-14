import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { authorInfo, siteName } from '../data/content';

function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<\/(p|div|h[1-6]|li|tr|blockquote|section)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function readBookText(): string | null {
  try {
    const file = resolve(process.cwd(), 'public/book/output/当LLM不够用了.html');
    const html = readFileSync(file, 'utf8');
    const start = html.indexOf('<div class="chapter-start">');
    const body = start >= 0 ? html.slice(start) : html;
    return htmlToText(body);
  } catch {
    return null;
  }
}

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString().replace(/\/$/, '') || 'https://senlinpubu.top';

  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );

  const parts: string[] = [
    `# ${siteName} — 全文语料`,
    '',
    `> 《当LLM不够用了——本体推理的企业决策实践》作者。专注知识图谱、本体推理、LLM 与企业决策系统的融合落地。作者：${authorInfo.name}。`,
    '',
    `站点: ${siteUrl}/`,
    `专栏: ${siteUrl}/book/index.html`,
    '',
    '---',
    '',
  ];

  for (const post of posts) {
    const date = post.data.publishDate.toISOString().slice(0, 10);
    const tags = (post.data.tags || []).join(', ');
    parts.push(
      `## ${post.data.title}`,
      '',
      `- URL: ${siteUrl}/blog/${post.id}/`,
      `- 发布日期: ${date}`,
      `- 分类: ${post.data.category}`,
      tags ? `- 标签: ${tags}` : '',
      `- 简介: ${post.data.description}`,
      '',
      post.body ?? post.data.description,
      '',
      '---',
      '',
    );
  }

  const bookText = readBookText();
  if (bookText) {
    parts.push(
      '## 书籍全文：《当LLM不够用了——本体推理的企业决策实践》',
      '',
      `- 在线阅读: ${siteUrl}/book/index.html`,
      `- 下载: ${siteUrl}/book/output/当LLM不够用了.pdf · .epub · .html`,
      '',
      bookText,
      '',
    );
  }

  return new Response(parts.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
