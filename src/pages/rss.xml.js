import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const blog = await getCollection('blog');
  const items = blog
    .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf())
    .map((post) => {
      const html = post.rendered?.html ?? post.body ?? post.data.description;
      return {
        title: post.data.title,
        pubDate: post.data.publishDate,
        description: post.data.description,
        link: `/blog/${post.id}/`,
        categories: post.data.tags,
        customData: `<content:encoded><![CDATA[${html}]]></content:encoded>`,
      };
    });

  return rss({
    title: '森林瀑布的博客',
    description: '《当LLM不够用了——本体推理的企业决策实践》作者。专注知识图谱、本体推理、LLM 与企业决策系统的融合落地。',
    site: context.site,
    stylesheet: '/rss/pretty-feed-v3.xsl',
    xmlns: { content: 'http://purl.org/rss/1.0/modules/content/' },
    items,
  });
}
