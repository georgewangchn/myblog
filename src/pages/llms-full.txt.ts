import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { authorInfo, siteName } from '../data/content';

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

  return new Response(parts.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
