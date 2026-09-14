import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { authorInfo, siteName } from '../data/content';
import { topics } from '../data/topics';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString().replace(/\/$/, '') || 'https://senlinpubu.top';

  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );

  const lines: string[] = [
    `# ${siteName}`,
    '',
    `> 《当LLM不够用了——本体推理的企业决策实践》作者。专注知识图谱、本体推理、LLM 与企业决策系统的融合落地。作者：${authorInfo.name}。`,
    '',
    `- 站点主页: ${siteUrl}/`,
    `- 专栏（书·在线阅读）: ${siteUrl}/book/index.html`,
    `- 开源项目: ${siteUrl}/project/`,
    `- 关于作者: ${siteUrl}/about/`,
    `- RSS: ${siteUrl}/rss.xml`,
    `- 全文语料: ${siteUrl}/llms-full.txt`,
    '',
    '## 专栏',
    '',
    `- [《当LLM不够用了——本体推理的企业决策实践》](${siteUrl}/book/index.html): 从 OWL 公理体系、SWRL 规则到 HermiT 推理引擎，从理论到 12 章完整实战。`,
    `- [GovernanceOps 演示](${siteUrl}/demo/index.html): 用本体推理替代人工流转的企业治理运维演示。`,
    '',
    '## 主题',
    '',
    ...topics.map((t) => `- [${t.title}](${siteUrl}/topic/${t.slug}/): ${t.description}`),
    '',
    '## 文章',
    '',
  ];

  for (const post of posts) {
    const date = post.data.publishDate.toISOString().slice(0, 10);
    lines.push(`- [${post.data.title}](${siteUrl}/blog/${post.id}/) (${date}): ${post.data.description}`);
  }

  lines.push('');

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
