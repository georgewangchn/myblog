import rss from "@astrojs/rss";
import { getCollection, render } from "astro:content";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import mdxRenderer from "@astrojs/mdx/server.js";

export async function GET(context) {
  const container = await AstroContainer.create();
  container.addServerRenderer({ renderer: mdxRenderer });

  const blog = await getCollection('blog');
  const sorted = blog.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());

  const items = [];
  for (const post of sorted) {
    let html = post.data.description;
    try {
      const { Content } = await render(post);
      html = await container.renderToString(Content);
    } catch (err) {
      html = post.body ?? post.data.description;
    }
    items.push({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
      content: html,
    });
  }

  return rss({
    title: '森林瀑布的博客',
    description: '《当LLM不够用了——本体推理的企业决策实践》作者。专注知识图谱、本体推理、LLM 与企业决策系统的融合落地。',
    site: context.site,
    stylesheet: '/rss/pretty-feed-v3.xsl',
    xmlns: { content: 'http://purl.org/rss/1.0/modules/content/' },
    items,
  });
}
